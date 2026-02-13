---
title: "[Golang] LeetCode 热题 100 - 链表"
date: 2026-01-27 9:00:00 +0900
categories: [算法, LeetCode]
tags: [Go, 链表, 题解]
---
# 链表

## [160. 相交链表 - Easy](https://leetcode.cn/problems/intersection-of-two-linked-lists/)


### 题目回顾

> 给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点, 返回 `null` 。
>
> 题目数据 **保证** 整个链式结构中不存在环，并且函数返回结果后，链表必须 **保持其原始结构** 。

![示意图](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)

### 核心思路

#### 思路0：HashSet去重

#### 思路一：双指针 + 长度对齐

这是最直观的解法。既然相交前的部分长度可能不同，导致我们无法直接同步遍历，那我们想办法让它们变得一样长就可以了。

1.  **计算长度**：首先，分别遍历两个链表，得到它们的长度 `lenA` 和 `lenB`。

2.  **对齐指针**：计算出长度差 `diff = |lenA - lenB|`。让**较长**的那个链表的指针先走 `diff` 步。这样操作之后，两个指针距离各自链表的末尾就有了相同的距离。

3.  **同步遍历**：现在两个指针位于同一起跑线（相对终点而言），我们让它们同步向后移动，一次一步。

4.  **寻找交点**：在同步移动的过程中，第一次出现两个指针相等 (`headA == headB`) 的地方，就是它们的第一个相交节点。如果一直走到末尾 (`null`) 都没有相遇，则说明两个链表不相交。

这个方法就像两个人去同一个终点，路程长的人先出发一段距离，然后两个人再同时出发，这样他们就能同时到达终点。

#### 思路二：双指针"浪漫"相遇法

这是一个更巧妙，代码也更简洁的解法，它避免了显式地计算长度。

想象有两个指针 `pA` 和 `pB`，分别从 `headA` 和 `headB` 出发。它们同时前进，当任何一个指针走到自己链表的末尾时，就**跳到对方链表的头节点**继续前进。

**为什么这个方法可行？**

* **路径长度相等**：
    * `pA` 走过的路径：`链表A的长度` + `链表B的长度`
    * `pB` 走过的路径：`链表B的长度` + `链表A的长度`
    * 两个指针走过的总路程是完全相同的。

* **相遇点**：
    * **如果相交**：设 A 不相交部分长 `a`，B 不相交部分长 `b`，相交部分长 `c`。`pA` 走 `a+c` 到达终点，然后从 B 的头部走 `b` 步。`pB` 走 `b+c` 到达终点，然后从 A 的头部走 `a` 步。当它们都走了 `a+b+c` 的路程时，会在相交点相遇。
    * **如果不相交**：`pA` 走完 A 再走完 B，`pB` 走完 B 再走完 A。它们会同时到达终点 `null`，此时 `pA == pB == null`，循环结束，正确返回 `null`。

这个方法可以理解为，通过让两个指针都走一遍 `A+B` 和 `B+A` 的路程，从而消除了长度差，使得它们能够在终点前相遇。

### 代码实现

#### 解法一：长度对齐法

```go
func getIntersectionNode(headA, headB *ListNode) *ListNode {
    if headA == nil || headB == nil {
        return nil
    }

    // 1. 计算长度
    lenA, lenB := 0, 0
    currA, currB := headA, headB
    for currA != nil {
        lenA++
        currA = currA.Next
    }
    for currB != nil {
        lenB++
        currB = currB.Next
    }

    // 2. 指针重置并对齐
    currA, currB = headA, headB
    if lenA > lenB {
        for i := 0; i < lenA-lenB; i++ {
            currA = currA.Next
        }
    } else {
        for i := 0; i < lenB-lenA; i++ {
            currB = currB.Next
        }
    }

    // 3. 同时移动，直到相遇
    for currA != currB {
        currA = currA.Next
        currB = currB.Next
    }

    return currA
}
```

#### 解法二：双指针"换路"法 (更巧妙)

```go
func getIntersectionNode(headA, headB *ListNode) *ListNode {
    if headA == nil || headB == nil {
        return nil
    }

    pA, pB := headA, headB

    for pA != pB {
        // Go 中没有三元运算符 a ? b : c
        // 如果 pA 到头了，就跳到 B 的头
        if pA == nil {
            pA = headB
        } else {
            pA = pA.Next
        }

        // 如果 pB 到头了，就跳到 A 的头
        if pB == nil {
            pB = headA
        } else {
            pB = pB.Next
        }
    }

    // 最终 pA == pB，可能是相交节点，也可能是 nil
    return pA
}
```

**复杂度分析**
- 时间复杂度: `O(m + n)`。其中 m 和 n 分别是两个链表的长度。两种方法都需要线性遍历链表。
- 空间复杂度: `O(1)`。两种方法都只使用了常数个额外指针变量。

## [206. 反转链表 - Easy](https://leetcode.cn/problems/reverse-linked-list/)


### 题目回顾

> 给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。

**示例 1：**
```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

**示例 2：**
```
输入：head = [1,2]
输出：[2,1]
```

**示例 3：**
```
输入：head = []
输出：[]
```

### 核心思路

#### 思路一：迭代法（双指针）

这是最直观的解法。我们需要遍历链表，在遍历过程中改变每个节点的 `next` 指针指向。

1. **三个指针**：我们需要三个指针来完成反转：
   - `prev`：指向当前节点的前一个节点（初始为 `null`）
   - `curr`：指向当前节点（初始为 `head`）
   - `next`：临时存储当前节点的下一个节点

2. **遍历反转**：
   - 保存 `curr.next` 到 `next`（防止断链）
   - 将 `curr.next` 指向 `prev`（反转当前节点）
   - 将 `prev` 移动到 `curr` 位置
   - 将 `curr` 移动到 `next` 位置

3. **返回结果**：遍历结束后，`prev` 就是新链表的头节点

这个方法就像把一列火车车厢的方向逐个反转，需要临时标记下一个车厢的位置。

### 思路二：头插法（虚拟头节点）

这个方法使用一个虚拟头节点，将原链表的节点逐个插入到虚拟头节点后面。

1. **创建虚拟头节点**：`dummy = new ListNode(0)`
2. **遍历原链表**：
   - 保存当前节点 `curr`
   - 将当前节点从原链表中断开
   - 将当前节点插入到虚拟头节点后面
3. **返回结果**：返回 `dummy.next`

### 代码实现

#### 解法一：迭代法（双指针）

```go
func reverseList(head *ListNode) *ListNode {
    var prev *ListNode // 在 Go 中，nil 是指针的零值
    curr := head

    for curr != nil {
        // 利用 Go 的多重赋值特性：
        // 1. 记录 curr.Next 到下一次循环的 curr
        // 2. 将 curr.Next 指向 prev (完成反转)
        // 3. 将 prev 移动到当前 curr 位置
        // 顺序必须保证：先处理 curr.Next，再更新 curr
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }

    return prev
}
```


#### 解法二：头插法（虚拟头节点）

```go
func reverseList(head *ListNode) *ListNode {
    if head == nil {
        return nil
    }

    // 初始化虚拟头节点
    dummy := &ListNode{Val: 0}
    curr := head

    for curr != nil {
        next := curr.Next    // 暂时保存余下的链表

        // 头插逻辑：
        curr.Next = dummy.Next
        dummy.Next = curr

        curr = next          // 继续处理原链表
    }

    return dummy.Next
}
```

**复杂度分析**
- 时间复杂度: `O(n)`。其中 n 是链表的长度，所有方法都需要遍历整个链表一次。
- 空间复杂度:
  - 迭代法：`O(1)`，只使用了常数个额外指针变量。
  - 头插法：`O(1)`，只使用了虚拟头节点和几个指针变量。


## [234. 回文链表 - Easy](https://leetcode.cn/problems/palindrome-linked-list/)

### 题目回顾

> 给你一个单链表的头节点 `head` ，请你判断该链表是否为回文链表。如果是，返回 `true` ；否则，返回 `false` 。

### 核心思路

#### 快慢指针 + 反转后半部分
这是一个经典的解法，利用快慢指针找到链表的中点，然后反转后半部分，再与前半部分进行比较。
1. **找到中点**：使用快慢指针，快指针每次走两步，慢指针每次走一步。当快指针到达末尾时，慢指针正好到达中点。
2. **反转后半部分**：从慢指针开始，反转链表的后半部分。
3. **比较前后部分**：从头节点和反转后的中点开始，逐个比较节点值是否相等。


### 代码实现

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 * Val int
 * Next *ListNode
 * }
 */

func isPalindrome(head *ListNode) bool {
    if head == nil {
        return true
    }

    // 1. 找到前半部分的末尾节点
    firstHalfEnd := endOfFirstHalf(head)
    // 2. 反转后半部分链表
    secondHalfStart := reverseList(firstHalfEnd.Next)

    // 3. 判断是否回文
    p1 := head
    p2 := secondHalfStart
    result := true
    for result && p2 != nil {
        if p1.Val != p2.Val {
            result = false
        }
        p1 = p1.Next
        p2 = p2.Next
    }

    // 4. 还原链表（可选，但在实际工程中是好习惯）
    firstHalfEnd.Next = reverseList(secondHalfStart)

    return result
}

// 使用快慢指针寻找中点
func endOfFirstHalf(head *ListNode) *ListNode {
    fast := head
    slow := head
    // 快指针走两步，慢指针走一步
    for fast.Next != nil && fast.Next.Next != nil {
        fast = fast.Next.Next
        slow = slow.Next
    }
    return slow
}

// 原地反转链表（双指针法，比头插法更简洁）
func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    return prev
}
```

**复杂度分析**
- 时间复杂度: `O(n)`。其中 n 是链表的长度，所有方法都需要遍历整个链表一次。
- 空间复杂度: `O(1)`。只使用了常数个额外指针变量。

## [141. 环形链表 - Easy](https://leetcode.cn/problems/linked-list-cycle/)

### 题目回顾

> 给你一个链表的头节点 head ，判断链表中是否有环。如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。如果链表中存在环 ，则返回 true 。 否则，返回 false 。

### 核心思路

- 相对速度：想象在环形跑道上，兔子（快指针）比乌龟（慢指针）快一步。从乌龟进入环的那一刻起，每移动一次，兔子和乌龟之间的距离就会缩短 $1$。
- 最终相遇：既然距离每次缩小 $1$，那么在有限的步数内，距离一定会变成 $0$（即相遇），而不会出现“跳过”彼此的情况。

### 代码实现

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 * Val int
 * Next *ListNode
 * }
 */

func hasCycle(head *ListNode) bool {
    // 如果链表为空或者只有一个节点且无环，直接返回 false
    if head == nil || head.Next == nil {
        return false
    }

    slow, fast := head, head

    // 只要快指针没有走到尽头，就继续跑
    // 因为 fast 每次走两步，所以要检查 fast 和 fast.Next
    for fast != nil && fast.Next != nil {
        slow = slow.Next      // 慢指针走一步
        fast = fast.Next.Next // 快指针走两步

        // 如果相遇，说明有环
        if slow == fast {
            return true
        }
    }

    // 如果跳出循环，说明快指针指向了 nil，即链表有终点，无环
    return false
}
```

**复杂度分析**
- 时间复杂度: `O(n)`。其中 n 是链表的长度，快慢指针最多遍历链表一次。
- 空间复杂度: `O(1)`。只使用了常数个额外指针变量。
