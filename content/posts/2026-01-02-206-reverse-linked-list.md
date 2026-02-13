---
title: "【HOT100/链表】LeetCode 206. 反转链表"
date: 2026-01-02 20:01:00 +0900
categories: [算法, LeetCode]
tags: [链表]
---

## 题目回顾

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

## 核心思路

### 思路一：迭代法（双指针）

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

### 思路二：递归法

递归法的思路是：先递归到链表末尾，然后在回溯的过程中逐个反转节点。

1. **递归终止条件**：当 `head` 为 `null` 或 `head.next` 为 `null` 时，直接返回 `head`
2. **递归调用**：先递归处理 `head.next`，得到反转后的子链表
3. **反转当前节点**：将 `head.next.next` 指向 `head`，将 `head.next` 设为 `null`
4. **返回结果**：返回子链表的头节点（即新链表的头节点）

递归法的优点是代码简洁，但缺点是可能会因为链表过长导致栈溢出。

### 思路三：头插法（虚拟头节点）

这个方法使用一个虚拟头节点，将原链表的节点逐个插入到虚拟头节点后面。

1. **创建虚拟头节点**：`dummy = new ListNode(0)`
2. **遍历原链表**：
   - 保存当前节点 `curr`
   - 将当前节点从原链表中断开
   - 将当前节点插入到虚拟头节点后面
3. **返回结果**：返回 `dummy.next`

## 代码实现 (Java)

### 解法一：迭代法（双指针）

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        
        while (curr != null) {
            ListNode next = curr.next;  // 保存下一个节点
            curr.next = prev;           // 反转当前节点
            prev = curr;                // prev 前进
            curr = next;                // curr 前进
        }
        
        return prev;  // prev 是新链表的头节点
    }
}
```

### 解法二：递归法

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // 递归终止条件
        if (head == null || head.next == null) {
            return head;
        }
        
        // 递归反转后面的链表
        ListNode newHead = reverseList(head.next);
        
        // 反转当前节点
        head.next.next = head;
        head.next = null;
        
        return newHead;
    }
}
```

### 解法三：头插法（虚拟头节点）

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null) {
            return null;
        }
        ListNode dummy = new ListNode(0);  // 虚拟头节点
        ListNode curr = head;
        
        while (curr != null) {
            ListNode next = curr.next;     // 保存下一个节点
            curr.next = dummy.next;        // 将当前节点插入到虚拟头节点后面
            dummy.next = curr;
            curr = next;                   // 处理下一个节点
        }
        
        return dummy.next;
    }
}
```

**复杂度分析**
- 时间复杂度: `O(n)`。其中 n 是链表的长度，所有方法都需要遍历整个链表一次。
- 空间复杂度: 
  - 迭代法：`O(1)`，只使用了常数个额外指针变量。
  - 递归法：`O(n)`，递归调用栈的深度为 n。
  - 头插法：`O(1)`，只使用了虚拟头节点和几个指针变量。

## 总结

反转链表是链表操作中的经典问题，掌握这个问题的解法对于理解链表操作非常重要：

1. **迭代法**是最推荐的解法，空间复杂度最优，且不会出现栈溢出问题
2. **递归法**代码简洁，但要注意栈溢出的风险
3. **头插法**思路清晰，适合理解链表插入操作

在实际面试中，建议熟练掌握迭代法，能够清晰地解释每一步的操作过程。