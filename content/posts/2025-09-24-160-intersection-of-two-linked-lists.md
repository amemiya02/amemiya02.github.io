---
title: "【HOT100/双指针 / 链表】LeetCode 160. 相交链表"
date: 2025-09-24 20:01:00 +0900
categories: [算法, LeetCode]
tags: [链表, 双指针]
---

## 题目回顾

> 给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点, 返回 `null` 。
>
> 题目数据 **保证** 整个链式结构中不存在环，并且函数返回结果后，链表必须 **保持其原始结构** 。

![示意图](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)

## 核心思路

### 思路0：HashSet去重

### 思路一：双指针 + 长度对齐

这是最直观的解法。既然相交前的部分长度可能不同，导致我们无法直接同步遍历，那我们想办法让它们变得一样长就可以了。

1.  **计算长度**：首先，分别遍历两个链表，得到它们的长度 `lenA` 和 `lenB`。

2.  **对齐指针**：计算出长度差 `diff = |lenA - lenB|`。让**较长**的那个链表的指针先走 `diff` 步。这样操作之后，两个指针距离各自链表的末尾就有了相同的距离。

3.  **同步遍历**：现在两个指针位于同一起跑线（相对终点而言），我们让它们同步向后移动，一次一步。

4.  **寻找交点**：在同步移动的过程中，第一次出现两个指针相等 (`headA == headB`) 的地方，就是它们的第一个相交节点。如果一直走到末尾 (`null`) 都没有相遇，则说明两个链表不相交。

这个方法就像两个人去同一个终点，路程长的人先出发一段距离，然后两个人再同时出发，这样他们就能同时到达终点。

### 思路二：双指针"浪漫"相遇法

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

## 代码实现 (Java)

### 解法一：长度对齐法

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) {
            return null;
        }

        // 1. 计算两个链表的长度
        int lenA = 0, lenB = 0;
        ListNode pA = headA, pB = headB;
        while (pA != null) {
            lenA++;
            pA = pA.next;
        }
        while (pB != null) {
            lenB++;
            pB = pB.next;
        }

        // 2. 将较长链表的头指针向前移动，以对齐
        pA = headA;
        pB = headB;
        if (lenA > lenB) {
            for (int i = 0; i < lenA - lenB; i++) {
                pA = pA.next;
            }
        } else {
            for (int i = 0; i < lenB - lenA; i++) {
                pB = pB.next;
            }
        }

        // 3. 同步遍历，寻找相交节点
        while (pA != pB) {
            pA = pA.next;
            pB = pB.next;
        }

        return pA;
    }
}
```

### 解法二：双指针"换路"法 (更巧妙)

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) {
            return null;
        }

        ListNode pA = headA, pB = headB;

        while (pA != pB) {
            // pA 走完自己的路，就去走 pB 的路
            pA = (pA == null) ? headB : pA.next;
            // pB 走完自己的路，就去走 pA 的路
            pB = (pB == null) ? headA : pB.next;
        }

        return pA;
    }
}
```

**复杂度分析**
- 时间复杂度: `O(m + n)`。其中 m 和 n 分别是两个链表的长度。两种方法都需要线性遍历链表。
- 空间复杂度: `O(1)`。两种方法都只使用了常数个额外指针变量。