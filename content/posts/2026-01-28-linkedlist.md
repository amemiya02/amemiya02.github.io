---
title: "[Golang] LeetCode 热题 100 - 链表"
date: 2026-01-28 9:00:00 +0900
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

### 复杂度分析
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

### 复杂度分析
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

### 复杂度分析
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

### 复杂度分析
- 时间复杂度: `O(n)`。其中 n 是链表的长度，快慢指针最多遍历链表一次。
- 空间复杂度: `O(1)`。只使用了常数个额外指针变量。

## [142. 环形链表 II - Mid](https://leetcode.cn/problems/linked-list-cycle-ii/)

### 题目回顾
> 给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
>如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。
>不允许修改 链表。

### 核心思路
为什么“一个指针从 head 出发，一个从相遇点出发，等速移动必会在入环点相遇”？我们来做个简单的算术题：

定义距离：

设从 起点 到 入环点 的距离为 $a$。

设从 入环点 到 首次相遇点 的距离为 $b$。

设从 首次相遇点 回到 入环点 的剩余距离为 $c$。

环的总周长就是 $b + c$。

指针走过的路程：

慢指针 (slow) 走的距离：$s = a + b$

快指针 (fast) 走的距离：$f = a + n(b + c) + b$ （$n$ 是快指针绕环的圈数）

速度关系：

因为快指针速度是慢指针的两倍，所以 $f = 2s$。

代入公式：$a + n(b + c) + b = 2(a + b)$

化简得：$n(b + c) = a + b$

我们要找的是 $a$（起点到入环点的距离），所以把 $a$ 孤立出来：

$a = n(b + c) - b$

进一步整理：$a = (n - 1)(b + c) + c$

结论：

这个公式 $a = (n - 1) \times \text{周长} + c$ 告诉我们：从起点走 $a$ 步，等同于从相遇点走过 $n-1$ 圈后再走 $c$ 步。

由于都在环里转圈，那 $n-1$ 圈可以忽略，结论简化为：走 $a$ 步的路程等于走 $c$ 步的路程。 所以两个指针再次相遇时，一定是在入环点。

### 代码实现

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 * Val int
 * Next *ListNode
 * }
 */
func detectCycle(head *ListNode) *ListNode {
    if head == nil || head.Next == nil {
        return nil
    }

    slow, fast := head, head

    // 第一阶段：判断是否有环（龟兔赛跑）
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next

        // 如果快慢指针相遇，说明有环
        if slow == fast {
            // 第二阶段：寻找入环点
            // 将其中一个指针重置到 head，另一个留在相遇点
            p := head
            for p != slow {
                p = p.Next
                slow = slow.Next
            }
            // 它们再次相遇的地方就是入环点
            return p
        }
    }

    return nil
}

```

### 复杂度分析

* **时间复杂度**：。第一阶段快慢指针相遇最多 ，第二阶段寻找入环点最多 。
* **空间复杂度**：。只使用了指针。


## [21. 合并两个有序链表 - Easy](https://leetcode.cn/problems/merge-two-sorted-lists/)

### 题目回顾

> 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

### 核心思路

核心步骤：
哨兵节点（Dummy Node）：我们先造一个“假”的头节点。它的作用是作为新链表的起点，避免我们在循环里去写 if head == nil 这种逻辑判断。

比较与连接：像拉链一样，比较 p 和 q 的值，谁小就把 curr.Next 指向谁，然后那个指针后移。

收尾工作：因为两个链表长度可能不等，当一个遍历完后，另一个肯定还剩下一截。由于原链表已经是有序的，我们直接把剩余的那一整截挂在 curr.Next 上即可。

### 代码实现

```go

/**
 * Definition for singly-linked list.
 * type ListNode struct {
 * Val int
 * Next *ListNode
 * }
 */
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    // 1. 创建虚拟头节点，便于处理返回结果
    // 在 Go 中，&ListNode{} 会分配内存并返回指针
    dummy := &ListNode{}
    curr := dummy

    // 2. 同时遍历两个链表
    p, q := list1, list2
    for p != nil && q != nil {
        if p.Val < q.Val {
            curr.Next = p
            p = p.Next
        } else {
            curr.Next = q
            q = q.Next
        }
        curr = curr.Next
    }

    // 3. 处理剩余部分
    // Go 没有三元运算符，直接用 if 赋值即可
    if p != nil {
        curr.Next = p
    } else {
        curr.Next = q
    }

    // 返回虚拟头节点的下一个节点，即合并后的真正头节点
    return dummy.Next
}
```

### 复杂度分析

- `时间复杂度`：$O(n + m)$，其中 $n$ 和 $m$ 分别是两个链表的长度。我们只需要遍历每个节点一次。
- `空间复杂度`：$O(1)$。我们只是在修改原有节点的指针指向，并没有创建 $n+m$ 个新节点。


## [2. 两数相加 - Mid](https://leetcode.cn/problems/add-two-numbers/)

### 题目回顾

>给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
>请你将两个数相加，并以相同形式返回一个表示和的链表。
>你可以假设除了数字 0 之外，这两个数都不会以 0 开头。


### 核心思路

这道题的本质是 模拟竖式加法。由于链表已经是逆序存储的（个位在头），这反而降低了难度，因为我们可以直接从头开始加。

### 代码实现

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 * Val int
 * Next *ListNode
 * }
 */
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := &ListNode{} // 虚拟头节点
    curr := dummy
    carry := 0 // 进位

    // 只要 l1, l2 没走完，或者最后还有一个进位没处理，就继续循环
    for l1 != nil || l2 != nil || carry > 0 {
        sum := carry // 开始计算当前位的和

        if l1 != nil {
            sum += l1.Val
            l1 = l1.Next
        }
        if l2 != nil {
            sum += l2.Val
            l2 = l2.Next
        }

        // 计算新的进位和当前位的值
        carry = sum / 10
        val := sum % 10

        // 创建新节点并移动指针
        curr.Next = &ListNode{Val: val}
        curr = curr.Next
    }

    return dummy.Next
}
```

### 复杂度分析

- 时间复杂度: $O(max(m, n))$，其中 m 和 n 分别是两个链表的长度。我们需要遍历最长的链表。
- 空间复杂度: $O(1)$，用于存储结果


## [19. 删除链表的倒数第 N 个结点 - Mid](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

### 题目回顾

> 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

### 核心思路
让快指针先走 $n+1$ 步，然后快慢指针同步移动。当快指针到达末尾时，慢指针正好指向倒数第 $n$ 个节点的前驱。

或者把所有的节点入栈，弹出 $n$ 个节点后，栈顶节点就是倒数第 $n$ 个节点的前驱。

### 代码实现

```go
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    // 1. 创建虚拟头节点，处理删除头节点的情况
    dummy := &ListNode{Next: head}

    // 2. 初始化快慢指针都指向 dummy
    fast, slow := dummy, dummy

    // 3. 快指针先走 n+1 步
    // 为什么要走 n+1？因为我们要让 slow 停在被删节点的前一个位置
    for i := 0; i <= n; i++ {
        fast = fast.Next
    }

    // 4. 快慢指针同步移动，直到 fast 走到头
    for fast != nil {
        fast = fast.Next
        slow = slow.Next
    }

    // 5. 此时 slow 就在待删除节点的前面，直接跳过目标节点
    slow.Next = slow.Next.Next

    return dummy.Next
}
```

栈版本

```go
func removeNthFromEndStack(head *ListNode, n int) *ListNode {
    dummy := &ListNode{Next: head}
    stack := []*ListNode{}

    // 入栈
    curr := dummy
    for curr != nil {
        stack = append(stack, curr)
        curr = curr.Next
    }

    // 出栈 n 次
    stack = stack[:len(stack)-n]

    // 栈顶就是待删除节点的前驱
    prev := stack[len(stack)-1]
    prev.Next = prev.Next.Next

    return dummy.Next
}
```

### 复杂度分析

- 时间复杂度: $O(n)$。其中 n 是链表的长度，快指针需要遍历链表一次。
- 空间复杂度: $O(1)$。只使用了常数个额外空间。或者栈版本的空间复杂度是 $O(n)$，因为需要存储所有节点。


## [24. 两两交换链表中的节点 - Mid](https://leetcode.cn/problems/swap-nodes-in-pairs/)

### 题目回顾

> 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

### 核心思路

两两交换链表节点的关键在于顺序。我们需要改动三个指针的指向才能完成一次完整的内部易位：

关键点解析
为什么 prev = node1？ 交换前顺序是：prev -> node1 -> node2 -> node3。 交换后顺序是：prev -> node2 -> node1 -> node3。 为了处理下一对，我们的 prev 必须移动到 node1 的位置，因为 node1 现在是下一对节点的“前驱”。

边界条件：

如果链表为空或只有一个节点，prev.Next 或 prev.Next.Next 会为 nil，循环直接不执行，返回原链表。符合预期。

### 代码实现

```go
func swapPairs(head *ListNode) *ListNode {
    // 1. 创建虚拟头节点，指向当前的 head
    dummy := &ListNode{Next: head}
    // prev 指向待交换的一对节点之前的一个位置
    prev := dummy

    // 2. 只有当后面至少有两个节点时，才需要交换
    for prev.Next != nil && prev.Next.Next != nil {
        // 确定要交换的两个节点
        node1 := prev.Next
        node2 := prev.Next.Next

        // 3. 执行交换逻辑 (三个指针的变动)
        // 第一步：让前驱指向第二个节点
        prev.Next = node2
        // 第二步：让第一个节点指向第三个节点 (node2.Next)
        node1.Next = node2.Next
        // 第三步：让第二个节点指向第一个节点
        node2.Next = node1

        // 4. 更新 prev，准备处理下一对
        // 此时 node1 已经换到了后面，所以它就是下一对的前驱
        prev = node1
    }

    return dummy.Next
}
```

### 复杂度分析
- 时间复杂度: $O(n)$。其中 n 是链表的长度，所有方法都需要遍历整个链表一次。
- 空间复杂度: $O(1)$。