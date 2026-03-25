# [Python] LeetCode 热题 100 - 贪心算法


# 贪心算法


## [121. 买卖股票的最佳时机 - Easy](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)

### 题目回顾
你只能选择 **某一天** 买入，并在 **未来的另一个日子** 卖出。求最大利润。

### 核心思路
我们的目标是：在历史最低点买入，在之后的最高点卖出。
1.  **min_price**：记录到目前为止遇到的最低价格。初始化为正无穷 `float('inf')`。
2.  **max_profit**：记录到目前为止能获得的最大利润。
3.  遍历价格：
    * 更新最低买入价。
    * 计算如果今天卖出能赚多少，并尝试更新最大利润。

### 代码实现

```python
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        # 初始化最低价格为无穷大，最大利润为 0
        min_price = float('inf')
        max_profit = 0

        for price in prices:
            # 1. 更新历史最低价
            min_price = min(min_price, price)
            # 2. 计算当前利润并更新最大利润
            max_profit = max(max_profit, price - min_price)

        return max_profit
```

### 复杂度分析
- **时间复杂度**：$O(n)$，只需一次遍历。
- **空间复杂度**：$O(1)$，仅使用两个变量。

---

## [55. 跳跃游戏 - Medium](https://leetcode.cn/problems/jump-game/)

### 核心思路
维护一个变量 `max_reach`，代表当前**你最远能跳到哪儿**。
1.  遍历数组，如果当前索引 `i` 已经超过了 `max_reach`，说明你根本跳不到这一步，直接失败。
2.  否则，尝试用 `i + nums[i]` 更新 `max_reach`。
3.  如果 `max_reach` 已经涵盖了终点，提前收工。



### 代码实现

```python
class Solution:
    def canJump(self, nums: list[int]) -> bool:
        max_reach = 0
        # 使用 enumerate 同时获取索引和步数
        for i, jump in enumerate(nums):
            # 如果当前位置已经不可达，直接返回 False
            if i > max_reach:
                return False

            # 更新最远可达位置
            max_reach = max(max_reach, i + jump)

            # 提前优化：如果已经能跳到终点
            if max_reach >= len(nums) - 1:
                return True

        return False
```

### 复杂度分析
- **时间复杂度**：$O(n)$。
- **空间复杂度**：$O(1)$。

---

## [45. 跳跃游戏 II - Medium](https://leetcode.cn/problems/jump-game-ii/)

### 题目回顾
返回到达最后一个下标的**最小跳跃次数**。

### 核心思路
这题是上一题的升级版。我们要像“波纹扩散”一样跳跃：
1.  **cur_end**：当前这一跳能到达的最远边界。
2.  **max_reach**：在当前边界内，再跳一次能到达的最远位置（为下一跳做准备）。
3.  每当走到 `cur_end` 时，步数 `steps` 加 1，并更新 `cur_end = max_reach`。

### 代码实现

```python
class Solution:
    def jump(self, nums: list[int]) -> int:
        n = len(nums)
        if n <= 1: return 0

        steps = 0
        cur_end = 0    # 当前跳跃的边界
        max_reach = 0  # 下一跳能达到的最远位置

        # 注意：遍历到 n-1 即可，因为在最后一个点不需要再起跳
        for i in range(n - 1):
            max_reach = max(max_reach, i + nums[i])

            # 达到了当前跳跃的边界，必须再跳一次
            if i == cur_end:
                steps += 1
                cur_end = max_reach

                # 如果当前边界已经覆盖终点，可以结束
                if cur_end >= n - 1:
                    break

        return steps
```

### 复杂度分析
- **时间复杂度**：$O(n)$。
- **空间复杂度**：$O(1)$。

---

## [763. 划分字母区间 - Medium](https://leetcode.cn/problems/partition-labels/)

### 核心思路
我们要把字符串划分为尽可能多的片段，且同一字母只能出现在一个片段里。
1.  **记录位置**：先遍历一遍，记下每个字母最后出现的下标。
2.  **确定边界**：再遍历一遍。每遇到一个字符，就更新当前片段必须达到的“最远终点” `end`。
3.  **收割片段**：当索引 `i` 真的走到了 `end`，说明这就是一个完整的最小独立片段了。

### 代码实现

```python
class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        # 1. 记录每个字母最后出现的索引
        # Python 的字典或 [0]*26 均可，这里用字典更直观
        last_occurrence = {char: i for i, char in enumerate(s)}

        res = []
        start, end = 0, 0

        for i, char in enumerate(s):
            # 更新当前片段需要延伸到的最远边界
            end = max(end, last_occurrence[char])

            # 走到边界，记录长度并重置起始点
            if i == end:
                res.append(end - start + 1)
                start = i + 1

        return res
```

### 复杂度分析
- **时间复杂度**：$O(n)$，两次 $O(n)$ 的遍历。
- **空间复杂度**：$O(k)$，其中 $k$ 是字符集的大小（本题为 26），可视为 $O(1)$。



---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-greedy/  

