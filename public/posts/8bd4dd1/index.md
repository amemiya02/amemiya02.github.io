# 黑马点评-Go语言实战


## 项目概览

本项目是基于 Go 语言生态对经典 O2O 社交与营销平台（[黑马点评](https://www.bilibili.com/video/BV1NV411u7GE/)）的深度重构与架构升级。项目模拟了类似大众点评的核心业务场景，完成了从用户鉴权、商户查询、社交探店、到高并发秒杀抢券的完整业务闭环。

在重构过程中，不仅实现了单体架构向高并发场景的平滑演进，更深度结合了 Go 语言的高并发特性（Goroutine + Channel）与多种分布式中间件（Redis、Kafka），系统性地解决了分布式会话、缓存雪崩/击穿/穿透、高并发秒杀超卖、分布式锁以及异步削峰等复杂架构痛点。适合作为展示高并发业务落地能力和 Go 生态工程化实践的标杆项目。

项目源码地址：[hmdp-go](https://github.com/amemiya02/hmdp-go)

这是一篇为您量身定制的技术博客。这篇博客不仅深入浅出地讲解了业务痛点与技术难点，还完美融入了你用 Go 语言（Gin + GORM + Redis + Kafka）重构时的思考过程、架构演进（从 V1 到 V3 的推导）以及核心代码实现，非常适合发布在掘金、知乎或个人博客上作为你的“项目门面”。

---

## 模块一：分布式 Session 与短信登录演进

### 1. 业务需求与面临的问题
**V1 阶段：单机 Session 时代的痛点**
最初的登录逻辑很简单：用户验证短信验证码通过后，将用户信息存入 Tomcat/Go 原生的内存 Session 中。但在微服务或多实例集群部署下，Nginx 负载均衡会将请求分发到不同节点，导致**Session 状态不共享**，用户频繁掉线。

### 2. 架构演进与业务设计
**V2 阶段：Redis + Token 无状态会话**
为了解决集群状态共享，我引入了 Redis。服务端不保存用户的登录状态，而是交由统一的中间件（Redis）来集中存储，客户端通过 Token 作为凭证来验证身份。用户登录成功后，后端生成一个全局唯一的 `Token`（如 UUID），以此为 Key，用户信息（脱敏后的 `UserDTO`）为 Value 存入 Redis Hash 中，并将 Token 下发给前端。
当用户通过验证码或密码登录成功后，服务端需要为其生成一个身份凭证，并在 Redis 中建立映射关系。

在 UserService.Login 方法中，具体流程如下：

- 生成唯一标识： 使用 uuid 库生成一个去除了中划线的随机字符串作为 Token。

- 数据脱敏与瘦身： 并没有将整张 User 表的数据存入缓存，而是精简为 UserDTO（仅包含 id, nickName, icon），极大地节省了 Redis 的内存空间。

- Hash 结构存储： 使用 Redis 的 Hash 数据结构（HSet）来存储这个 Map。以 login:token:<Token> 为 Key，以用户的属性字典为 Value。相比于存储序列化后的 JSON 字符串，Hash 结构允许后续单独修改或读取某个字段，更加灵活。

- 设置 TTL： 为这个 Key 设置有效期（如 30 分钟），随后将 Token 返回给客户端（通常前端会将其存在 LocalStorage 中）。

**V3 阶段：双层拦截器（Gin Middleware）彻底解决活跃续期问题**
如果只在受保护的路由（如“下单”）加拦截器，会导致用户一直在浏览公开页面（如首页）时，Token 无法刷新 TTL，最终莫名掉线。为此，我设计了**双层中间件**模型：
* **全局拦截器 (`RefreshTokenInterceptor`)**：拦截所有请求，只要携带 Token 就去 Redis 查，查到就刷新 TTL 并将其放入 `gin.Context`，然后全部放行。
* **权限拦截器 (`LoginInterceptor`)**：只拦截需要登录的路由，仅仅判断 `gin.Context` 中有没有用户信息，没有直接返回 401。

#### 第一层拦截：状态续期 (全局拦截器)
如果只在下单、修改个人信息等需要登录的接口上做拦截校验，会导致一个严重的体验问题：用户在平台的主页逛了 40 分钟（公开页面，不触发鉴权拦截器），当他准备下单时，却发现自己掉线了（因为 Redis 中的 Token 已过了 30 分钟的 TTL）。

为了解决这个问题，设计了双层拦截器。第一层是 RefreshTokenInterceptor：

- 拦截范围： 拦截所有的 HTTP 请求。

- 核心逻辑： 尝试从请求头（Authorization）中获取 Token。如果拿到 Token，就去 Redis 中查询对应的 Hash 数据。

- 上下文流转： 如果查到了用户，将其封装回 dto.UserDTO，并使用 Gin 的 c.Set 将其保存在当前请求的内存上下文 (Context) 中。

- 活跃续期： 最关键的一步，重新给 Redis 中的这个 Token 设置 30 分钟的过期时间。

- 无条件放行： 无论用户有没有 Token、Token 是否过期，这一层统统调用 c.Next() 放行，因为它只负责“刷新活跃度”，不负责“阻拦”。

#### 第二层拦截：权限校验 (路由拦截器)
真正的访问控制交给了第二层拦截器 LoginInterceptor。

- 拦截范围： 仅针对需要保护的路由组（如 /order/*, /user/info 等）进行挂载。

- 核心逻辑： 它的逻辑极其轻量，不需要再查一次 Redis。它只需要通过 c.Get(constant.ContextUserKey) 检查第一层拦截器有没有在内存中塞入用户信息。

- 决断： 如果拿不到用户，说明未登录或 Token 已失效，直接 AbortWithStatusJSON 返回 401 拦截请求；如果拿到了，就调用 c.Next() 放行。

### 3. 核心代码实现 (Gin Middleware)
```go
// 1. 全局刷新拦截器：不管是否需要登录，只要有 token 就尝试续期
func RefreshTokenInterceptor(rdb *redis.Client) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.Next()
            return
        }
        // 从 Redis 获取用户信息并转为 DTO
        key := "login:token:" + token
        userMap, err := rdb.HGetAll(c, key).Result()
        if err == nil && len(userMap) > 0 {
            // 存入 Context
            c.Set("user", userMap)
            // 刷新 Redis 过期时间 (30分钟)
            rdb.Expire(c, key, 30*time.Minute)
        }
        c.Next()
    }
}

// 2. 鉴权拦截器：保护特定路由
func LoginInterceptor() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 直接从内存上下文中取，避免二次查 Redis
        _, exists := c.Get("user")
        if !exists {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"msg": "未登录"})
            return
        }
        c.Next()
    }
}
```

---

## 模块二：缓存治理与商户查询（穿透、雪崩、击穿）

### 1. 业务需求与问题推导
在 O2O 平台中，商铺信息的 QPS 极高。
* **V1 阶段：直连 DB**。哪怕只有几百并发，DB 也可能连接池打满。
* **V2 阶段：Cache Aside 模式**。引入 Redis，先查缓存，没有再查 DB 并回写。但这引出了缓存界的三大难题。

Cache Aside（旁路缓存） 是目前最常用的缓存模式，它的核心思想是：应用程序（代码）负责统筹数据库和缓存的交互，缓存本身不主动与数据库交互。

1. 具体的读写逻辑
   - 读数据：程序先去查询缓存；如果命中，直接返回数据；如果未命中，程序去查询数据库，查到数据后将其写入缓存，最后返回数据给用户。

   - 写数据：程序先更新数据库，然后再删除缓存。

2. 为什么是“删除缓存”而不是“更新缓存”？

  - **避免无效计算与资源浪费**：很多时候，写入缓存的数据并不是直接从数据库里查出来的原封不动的数据，而是经过多张表 Join 或复杂计算得来的。如果每次修改数据库都去计算并更新缓存，但这个数据在接下来的很长一段时间都没有人读，这部分计算和网络开销就全浪费了。**删除缓存是一种“懒加载”思想**，只有当下次真正有人查的时候，再去计算并放入缓存。

  - **并发一致性问题**：如果是“更新缓存”，在并发写的情况下极易产生脏数据。比如线程 A 和 B 同时写，A 先写 DB，B 后写 DB；但在更新缓存时，可能因为网络原因，B 先更新了缓存，A 后更新了缓存。这导致 DB 里存的是 B 的最新值，而缓存里却被覆盖成了 A 的旧值。直接删除缓存能最大程度规避这种更新错乱。

“先更新 DB，再删除缓存”在 99% 的情况下是安全的，但依然存在极端情况下的数据不一致：
比如：缓存刚好失效的瞬间，线程 A 去查 DB 拿到了旧值（此时还没写入缓存）；就在这极短的时间内，线程 B 更新了 DB 并删除了缓存；最后线程 A 把刚才拿到的旧值写回了缓存。
解决不一致的方案：

- **延迟双删**：写数据时，先删缓存，再更新 DB，然后休眠一小段时间（如 500ms），再删一次缓存。这能规避并发读写导致缓存被写入旧值的问题。

- **强一致性要求**：如果业务（如金融资产）绝对不能容忍哪怕一秒的不一致，就必须引入分布式读写锁（如 Redisson/Redsync 的 RWMutex），在更新期间阻塞所有读请求。

**除了 Cache Aside 还有什么模式？**
- Read-Through / Write-Through（读穿透/写穿透）：应用程序只和缓存打交道。由缓存中间件自己去维护与数据库的同步。更新时，程序更新缓存，缓存组件同步更新 DB。

- Write-Behind (Write-Back)（异步回写）：程序只更新缓存并立刻返回，由后台线程异步地批量将缓存的数据写入数据库。这种模式性能极高，但如果机器宕机，数据会丢失，常见于操作系统操作磁盘或 MySQL 的 Buffer Pool。

### 2. 架构演进与解决方案
**1. 缓存穿透（恶意请求不存在的 ID）**
缓存穿透是指用户高频请求一个数据库里根本不存在的 ID。

* **解决**：
  * **空值缓存**。查不到 DB 时，把空字符串也存进 Redis，并设置极短 TTL（如 2 分钟），防止反复击打 DB。 

    - 写空值拦截：在 `QueryWithPassThrough` 中，当 `fallback()` 查数据库返回为空 (`t == nil`) 时，代码会向 Redis 写入一个空字符串 ""，并且只赋予一个非常短的存活时间。

    - 读空值拦截：当下次请求来查 Redis 时，代码通过 `if jsonStr == ""` 进行了专门的校验。 如果发现是我们故意设置的空字符串，它会直接抛出你自定义的 ErrPenetration（触发防穿透，数据为空）。 这样就成功把恶意请求拦截在了 Redis 这一层。
  - **布隆过滤器**。这个是一个由位数组（BitMap） 和多个 哈希函数 组成的数据结构。它的核心逻辑如下：

    - 初始化：将数据库中所有存在的 Key 经过多个哈希函数映射到对应的位数组位置，并将这些位置的值设为 1。

    - 查询校验：当一个请求进入时，先计算该 Key 的哈希值并检查布隆过滤器：

      - 判定不存在：如果布隆过滤器说该 Key 不存在，那么它 一定不存在 于数据库中。此时直接拦截请求，不再查询缓存或数据库。

      - 判定存在：如果布隆过滤器说该 Key 存在，那么它 可能存在（存在一定的误判率）。此时放行请求去查询缓存或数据库。

**2. 缓存雪崩（大批热点数据同时过期）**
缓存雪崩是指大量缓存同时过期，导致所有请求瞬间打到数据库。解决它的最常用方案是在基础 TTL 上加一个随机的过期时间。
* **解决**：**随机 TTL**。在设置缓存过期时间时，基础时间上附加一个随机值（如 `300s + rand.Intn(100)s`），打散过期时间。

**3. 缓存击穿（单一超高并发热点 Key 突然失效）**
缓存击穿是指某一个高并发的热点 Key 突然失效。
* **解决**：逻辑过期和互斥锁。

**方案 1：互斥锁（对应 QueryWithMutex）**

核心思想：强一致性，牺牲部分性能。

代码实现：当缓存未命中时，并没有让所有 Goroutine 蜂拥去查 DB，而是使用了 Redis 的 `SetNX` 命令作为分布式互斥锁：`isLocked, _ := rdb.SetNX(ctx, lockKey, "1", 10*time.Second).Result()`。

排队机制：如果没有抢到锁（!isLocked），当前协程会主动 `time.Sleep(50 * time.Millisecond)` 休眠 50 毫秒，然后递归调用自身重新尝试查询缓存。

释放锁：抢到锁的协程去查数据库、写缓存，并通过 `defer rdb.Del(ctx, lockKey)` 保证无论如何最终会释放锁。

**方案 2：逻辑过期（对应 QueryWithLogicalExpire）**

核心思想：极致性能，允许短暂的数据不一致。

代码封装：你定义了 `RedisData` 结构体，将业务实体和 `ExpireTime` 封装在一起存入 Redis，物理上永久有效。

旧数据降级：当检查到 `time.Now().Before(rd.ExpireTime)` 为 false 时（说明逻辑已过期），**无论后续有没有抢到重构缓存的锁**，函数在最后都会直接 `return &t, nil` 返回旧数据给前端。 这保证了前端绝对不会阻塞等待。

Go 特色的异步重建：如果成功抢到了锁（isLocked），你利用 Go 语言的优势，直接开启了一个后台协程 `go func() { ... }()`。 这个后台协程负责去数据库查询最新数据并更新 Redis 的逻辑时间。

在开启后台协程时，注意 Gin 上下文销毁的问题，特意使用了 `bgCtx := context.Background()` 传递给后台重构任务，这是一个非常有经验的处理方式。

### 3. 核心代码实现 (逻辑过期 + Go 协程异步重建)
结合 Go 语言轻量级协程的优势，逻辑过期的实现比 Java 更加优雅：

```go
func QueryShopWithLogicalExpire(ctx *gin.Context, id string) (*Shop, error) {
    redisData, err := rdb.Get(ctx, "shop:"+id).Result()
    // ... 解析 JSON 获取 RedisData (包含 Shop 和 ExpireTime)
    
    // 判断逻辑是否过期
    if time.Now().Before(redisData.ExpireTime) {
        return redisData.Shop, nil // 未过期，直接返回
    }
    
    // 已过期，尝试获取互斥锁 (Redis SETNX)
    lockKey := "lock:shop:" + id
    isLock := TryLock(lockKey)
    
    if isLock {
        // 拿到锁，开启 Goroutine 异步重建缓存！(Go 的核心优势)
        go func() {
            defer Unlock(lockKey)
            // 查 DB，重置逻辑过期时间，写回 Redis
            RebuildShopCache(id) 
        }()
    }
    
    // 无论是否拿到锁，当前请求都直接返回旧数据（降级，保证极致响应）
    return redisData.Shop, nil
}
```

---

## 模块三：高并发秒杀与分布式锁

在高并发秒杀业务中，单纯依靠数据库难以支撑瞬时洪峰，且容易出现“超卖”和“一人多单”等并发安全问题。你通过从 **同步阻塞** 到 **内存预检+消息队列** 的三层架构迭代，并结合自研的 **分布式锁**，构建了一套生产级的解决方案。

---

### 第一阶段：同步下单 + 分布式锁 (V1)

**面临问题：** 在集群环境下，传统的单机锁（如 Go 的 `sync.Mutex`）无法跨进程生效。
**业务设计：** 采用 **Cache Aside** 模式，直接在主流程中查询数据库判断库存与资格，通过分布式锁保证“一人一单”。
**核心改进：** 手动实现了基于 Redis 的分布式锁，解决了多实例部署下的并发安全。

#### 单机锁sync.Mutex 实现

**核心业务痛点**

在秒杀场景下，如果同一个用户通过脚本开启多个协程并发请求下单，由于数据库查询（判断是否已购买）和写入订单之间存在时间差，可能会出现一个用户抢到多张券的情况。

**核心代码实现**

`internal/service/voucher_order.go`，最初的单机锁逻辑是通过 `sync.Map` 结合 `sync.Mutex` 实现的细粒度锁：

```Go
// 1. 定义全局 Map，存放每个用户专属的锁
var userLockMap sync.Map

func (vos *VoucherOrderService) createVoucherOrder(c context.Context, voucherId uint64) *dto.Result {
    userId := util.GetUserId(c)

    // 2. 从 sync.Map 中获取或创建该 userId 专属的锁
    // LoadOrStore 保证了获取锁对象的原子性
    lock, _ := userLockMap.LoadOrStore(userId, &sync.Mutex{})
    mu := lock.(*sync.Mutex)

    // 3. 加锁
    mu.Lock()
    
    // 4. 使用 defer 保证函数结束（包括事务完成后）才释放锁
    defer mu.Unlock()

    // 执行后续逻辑：查询是否已下单 -> 扣减库存 -> 创建订单
    // ...
}
```
**技术要点解析**

细粒度锁 (Fine-grained Locking)：
如果直接对整个下单方法加全局锁，会导致所有用户都必须排队，性能极差。通过`userId` 作为 Key，确保了只有同一个用户并发时才会互斥，不同用户之间是并行的。

sync.Map 的妙用：
普通 map 在并发读写时会 panic。`sync.Map` 是线程安全的，其 **LoadOrStore** 方法可以原子性地完成“存在即获取，不存在则创建”的动作，避免了多个协程为同一个用户创建出多个锁对象的问题。

锁与事务的顺序：
在 Go 实现中，锁的释放通过 defer 放在了事务逻辑之后。这保证了只有当数据库事务彻底 Commit 后，锁才会释放，有效防止了由于事务未提交导致其他协程读到旧数据（幻读）而重复下单的问题。

**单机锁的局限性**

虽然这种方案在单台服务器上运行完美，但在**集群模式**下，负载均衡会将同一用户的请求分发到不同的 Go 进程。不同进程拥有独立的内存空间和不同的 userLockMap，导致锁机制失效。这也是后续为什么要演进到 Redis 分布式锁 的根本原因。

#### 核心代码：SimpleRedisLock 实现
利用 `SETNX` 指令尝试加锁，并配合 Lua 脚本实现原子解锁，防止锁被误删。
```go
// TryLock：尝试获取锁
func (l *SimpleRedisLock) TryLock(timeoutSec uint64) bool {
    key := keyPrefix + l.name
    // 使用 SETNX 保证互斥，设置超时防止死锁
    success, err := l.client.SetNX(l.ctx, key, l.token, time.Duration(timeoutSec)*time.Second).Result()
    return success && err == nil
}

// Unlock：Lua 脚本原子释放
// 脚本逻辑：判断当前锁的 token 是否属于自己，是则删除
var unlockLua = `
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end`
```

---

### 第二阶段：异步下单 + 阻塞队列 (V2)

**面临问题：** 同步流程涉及多次数据库 I/O，QPS 极低，且响应耗时随并发量剧增。

**业务设计：** 将业务拆分为“快速校验”和“异步落库”。
* **校验层**：使用 Redis + Lua 脚本原子化地完成库存判断、一人一单校验、库存预扣减。
* **通信层**：校验通过后，将订单信息丢入 Go 的 `chan`（内存通道）。
* **落库层**：后台开启独立协程从 `chan` 取出订单并写入 MySQL。

#### 核心代码：Lua 原子预检
```lua
-- seckill.lua 核心逻辑
-- 1. 判断库存是否充足
if (tonumber(redis.call("get", stockKey)) <= 0) then return 1 end
-- 2. 判断用户是否已下单 (一人一单)
if (redis.call("sismember", orderKey, userId) == 1) then return 2 end
-- 3. 扣库存并记录已下单用户
redis.call("incrby", stockKey, -1)
redis.call("sadd", orderKey, userId)
return 0
```

---

### 第三阶段：终极方案：Kafka 异步削峰 (V3)

**面临问题：** 内存通道（`chan`）存在数据易失性，若服务宕机，排队中的订单会丢失；且无法横向扩展。

**最终设计：** 引入 **Kafka** 作为高可靠的消息中转站，形成了完整的三层防护体系。

1.  **第一层（Redis + Lua）**：极速前置过滤，拦截 90% 的无效请求。
2.  **第二层（Kafka）**：流量削峰，起到缓冲作用，保证订单数据的高可靠性。
3.  **第三层（MySQL + 乐观锁）**：后台异步落库。即使此时由于 MQ 重试导致重复消费，数据库层面通过 `stock > 0` 的乐观锁和唯一索引进行最终兜底。

#### 核心代码：Kafka 生产者集成
```go
func (vos *VoucherOrderService) SeckillVoucherByRedisAndKafka(c context.Context, voucherId uint64) *dto.Result {
    // ... 执行 Lua 预检成功后 ...
    msg := kafka.Message{
        Key:   []byte(strconv.FormatUint(userId, 10)), // 相同用户路由到同分区，保证顺序性
        Value: orderBytes,
    }
    // 异步投递消息，随后立即返回
    err = global.KafkaWriter.WriteMessages(c, msg)
    return dto.OkWithData(orderId)
}
```

---

### 进阶优化：带有“看门狗”的分布式锁实现

为了弥补 `SimpleRedisLock` 锁过期导致的安全隐患，参考 Redisson 实现了更完备的 `RedissonLock`。

1.  **看门狗 (Watchdog)**：加锁成功后，开启一个后台协程，每隔 `expiration / 3` 的时间通过 Lua 脚本刷新过期时间。
2.  **可重试逻辑**：使用 `time.Ticker` 在等待时间内不断自旋尝试加锁，而非直接报错。
3.  **优雅释放**：在 `Unlock` 时，通过 `context.CancelFunc` 主动关闭看门狗协程，并原子删除锁。

#### 核心实现：看门狗协程
```go
func (l *RedissonLock) startWatchDog(ctx context.Context) {
    ticker := time.NewTicker(l.expiration / 3) // 续期周期
    defer ticker.Stop()
    for {
        select {
        case <-ticker.C:
            // 只要业务没结束，就一直续命
            renewScript.Run(context.Background(), l.client, []string{l.name}, l.token, int(l.expiration.Seconds()))
        case <-ctx.Done():
            // 收到 Unlock 信号，停止续期
            return
        }
    }
}
```


### 总结：架构设计的推导逻辑
* **性能瓶颈**：通过将耗时的 MySQL 写操作从主链路剥离，移动到后台异步执行，解决了 QPS 低下的问题。
* **数据安全**：通过 Lua 脚本原子操作和分布式锁解决了并发下的重复下单问题。
* **高可用性**：从 `chan` 升级到 Kafka，解决了内存队列数据不安全和单机瓶颈问题，支持更大规模的洪峰冲击。

---

## 模块四：社交与统计等高阶玩法 （Redis 高级数据结构的实战应用）

常规的 RDBMS 在应对地理空间、日活统计等场景时往往力不从心。项目中我大量运用了 Redis 的高级数据结构：
在模块四中，你充分利用了 Redis 的高级数据结构（ZSet、Set、GEO、BitMap、HyperLogLog）来处理高频社交互动和海量统计需求。这些场景如果直接使用传统关系型数据库（MySQL），往往会面临性能瓶颈或复杂的 SQL 查询。

以下是每一部分的详细设计思路与核心代码实现：

---

### 1. 点赞与点赞列表（ZSet）

**面临问题：**
点赞功能需要实现：一人只能点一次（去重）、按点赞时间排序展示（点赞榜单）。

**业务设计：**
* **V1 方案（Set）**：使用 Redis 的 Set 集合存储点赞用户 ID，可以去重，但无法排序。
* **最终方案（ZSet）**：使用 `Sorted Set`。`member` 存用户 ID，`score` 存点赞时间戳。这样既能保证唯一性，又能利用 `score` 自动排序。

**核心代码实现：**
```go
func (bs *BlogService) LikeBlog(c context.Context, id uint64) *dto.Result {
    // 1. 获取登录用户
    userId := util.GetUserId(c)
    // 2. 判断当前登录用户是否已经点赞 (查询 ZSet 的 score)
    key := constant.BlogLikedKey + strconv.FormatUint(id, 10)
    score, _ := global.RedisClient.ZScore(c, key, strconv.FormatUint(userId, 10)).Result()

    if score == 0 {
        // 3. 如果未点赞，可以点赞
        // 3.1 数据库点赞数 +1
        err := bs.blogRepo.UpdateLiked(c, id, 1)
        if err == nil {
            // 3.2 保存用户到 Redis 的 ZSet (zadd key score member)
            global.RedisClient.ZAdd(c, key, redis.Z{
                Score:  float64(time.Now().UnixMilli()),
                Member: userId,
            })
        }
    } else {
        // 4. 如果已点赞，取消点赞
        // 4.1 数据库点赞数 -1
        err := bs.blogRepo.UpdateLiked(c, id, -1)
        if err == nil {
            // 4.2 把用户从 Redis 的 ZSet 移除
            global.RedisClient.ZRem(c, key, userId)
        }
    }
    return dto.Ok()
}
```

---

### 2. 关注与共同关注（Set）

**面临问题：**
“共同关注”需要计算两个用户关注列表的交集。在 SQL 中这通常需要复杂的自连接或 `INTERSECT` 操作。

**业务设计：**
利用 Redis Set 的集合运算能力。每个用户的关注列表存为一个 Set，Key 为 `follow:userID`。计算共同关注即执行 `SINTER` 命令。

**核心代码实现：**
```go
func (fs *FollowService) CommonFollow(c context.Context, id uint64) *dto.Result {
    // 1. 获取当前登录用户
    userId := util.GetUserId(c)
    key1 := constant.FollowKey + strconv.FormatUint(userId, 10)
    key2 := constant.FollowKey + strconv.FormatUint(id, 10)

    // 2. 求交集 (SINTER key1 key2)
    intersect, err := global.RedisClient.SInter(c, key1, key2).Result()
    if err != nil || len(intersect) == 0 {
        return dto.OkWithData(make([]*dto.UserDTO, 0))
    }

    // 3. 解析 ID 并查询用户信息...
    return dto.OkWithData(users)
}
```

---

### 3. 附近商铺搜索（GEO）

**面临问题：**
计算用户当前坐标与数万家商铺的球面距离，并按距离进行分页排序。

**业务设计：**
使用 Redis 的 `GEO` 数据结构。其底层是 ZSet，通过 GeoHash 将经纬度编码为权重。

**核心代码实现：**
```go
func (ss *ShopService) QueryShopByType(c *gin.Context, typeId uint64, current int, lon float64, lat float64) *dto.Result {
    // 1. 基础校验与分页参数计算
    limit := constant.DefaultPageSize
    from := (current - 1) * limit
    end := current * limit

    // 2. 查询 Redis GEO (GEOSEARCH key BYLONLAT lon lat BYRADIUS 5000 m ASC COUNT end)
    key := constant.ShopGeoKey + strconv.FormatUint(typeId, 10)
    results, err := global.RedisClient.GeoSearchLocation(c, key, &redis.GeoSearchLocationQuery{
        GeoSearchQuery: redis.GeoSearchQuery{
            Longitude: lon, Latitude: lat, Radius: 5000, RadiusUnit: "m", Sort: "ASC",
            Count: end, // 注意：GEO 无法直接 offset，需全量查出后手动截取
        },
        WithDist: true,
    }).Result()

    // 3. 手动分页截取
    if len(results) <= from { return dto.OkWithData(make([]*entity.Shop, 0)) }
    pagedResults := results[from:min(len(results), end)]

    // 4. 批量查询数据库并保持顺序，手动赋值距离字段...
    return dto.OkWithData(shops)
}
```

---

### 4. 用户签到与连续签到统计（BitMap）

**面临问题：**
如果按天存数据库，一个用户一年就有 365 条记录，海量用户下存储压力巨大。且“连续签到”的计算逻辑较为复杂。

**业务设计：**
使用 `BitMap`。一个月最多 31 天，只需 31 个 bit 位（约 4 字节）即可存下一个月的所有签到信息。
* **签到**：使用 `SETBIT` 将对应天数的位设为 1。
* **统计**：使用 `BITFIELD` 获取截止到今天的二进制数，转为十进制后，通过位运算（`&1` 和 `>>1`）从低位开始循环统计连续的 1。

**核心代码实现：**
```go
func (us *UserService) SignCount(ctx context.Context) *dto.Result {
    now := time.Now()
    key := constant.UserSignKey + strconv.FormatUint(util.GetUserId(ctx), 10) + now.Format(":200601")
    dayOfMonth := now.Day()

    // 1. 获取本月截止到今天的签到数据 (十进制)
    args := []interface{}{"GET", fmt.Sprintf("u%d", dayOfMonth), 0}
    result, _ := global.RedisClient.BitField(ctx, key, args...).Result()
    num := result[0]

    // 2. 循环位运算
    count := 0
    for num > 0 {
        if num&1 == 0 { // 如果最后一位是 0，说明连续签到中断
            break
        }
        count++
        num >>= 1 // 右移一位，检查前一天
    }
    return dto.OkWithData(count)
}
```

---

### 5. UV 统计（HyperLogLog）

**面临问题：**
统计每天的独立访客（UV），需要对用户 ID 去重。如果用 Set 存千万级 ID，内存占用会非常恐怖。

**业务设计：**
使用 `HyperLogLog`。它基于概率估算算法，无论存多少数据，单个 Key 占用内存永远固定在约 12KB 左右。虽然有 0.81% 的误差，但对大数据量的 UV 统计来说完全可以接受。

**核心实现逻辑：**
```go
// 测试代码中展示了该思路：
func TestHyperLogLog(t *testing.T) {
    key := "hll_uv_20241207"
    // 模拟 100 万次访问，由于 HLL 的特性，最终 PFCOUNT 结果会接近 100 万但存在微小误差
    for i := 0; i < 1000000; i++ {
        global.RedisClient.PFAdd(ctx, key, fmt.Sprintf("user_%d", i))
    }
    count, _ := global.RedisClient.PFCount(ctx, key).Result()
    fmt.Printf("UV 统计结果: %d\n", count)
}
```


---

> 作者: <no value>  
> URL: https://amemiya02.github.io/posts/8bd4dd1/  

