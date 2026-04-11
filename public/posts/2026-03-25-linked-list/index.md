# [Python] LeetCode 热题 100 - 链表

# 链表

## 160. 相交链表 - Easy

### 核心思路

#### 思路一：长度对齐

1. 计算两个链表长度
2. 让长链表先走差值步
3. 同步移动直到相遇

#### 思路二：双指针换路（推荐）

两个指针分别走 A+B 和 B+A，总路径相同，一定会相遇或同时为 None。

### Python 实现

```python
class Solution:
    def getIntersectionNode(self, headA, headB):
        if not headA or not headB:
            return None

        pA, pB = headA, headB

        while pA != pB:
            pA = pA.next if pA else headB
            pB = pB.next if pB else headA

        return pA
````

---

## 206. 反转链表 - Easy

### 核心思路

经典三指针：

* prev
* curr
* next

### Python 实现

```python
class Solution:
    def reverseList(self, head):
        prev = None
        curr = head

        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt

        return prev
```

---

## 234. 回文链表 - Easy

### 核心思路

1. 快慢指针找中点
2. 反转后半部分
3. 前后比较

### Python 实现

```python
class Solution:
    def isPalindrome(self, head):
        if not head:
            return True

        # 找中点
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        # 反转后半部分
        prev = None
        while slow:
            nxt = slow.next
            slow.next = prev
            prev = slow
            slow = nxt

        # 比较
        left, right = head, prev
        while right:
            if left.val != right.val:
                return False
            left = left.next
            right = right.next

        return True
```

---

## 141. 环形链表 - Easy

### 核心思路

快慢指针（Floyd 判圈）

### Python 实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

            if slow == fast:
                return True

        return False
```

---

## 142. 环形链表 II - Mid

### 核心思路

相遇后：

* 一个从 head 出发
* 一个从相遇点出发
* 同速再次相遇 = 入环点

### Python 实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head

        # 判断是否有环
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

            if slow == fast:
                # 找入口
                p = head
                while p != slow:
                    p = p.next
                    slow = slow.next
                return p

        return None
```

---

## 21. 合并两个有序链表 - Easy

### 核心思路

类似“拉链合并”，使用 dummy 节点

### Python 实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        curr = dummy

        p, q = list1, list2
        while p and q:
            if p.val < q.val:
                curr.next = p
                p = p.next
            else:
                curr.next = q
                q = q.next
            curr = curr.next

        curr.next = p if p else q
        return dummy.next
```

---

## 2. 两数相加 - Mid

### 核心思路

模拟竖式加法（带进位）

### Python 实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        curr = dummy
        carry = 0

        while l1 or l2 or carry:
            s = carry

            if l1:
                s += l1.val
                l1 = l1.next
            if l2:
                s += l2.val
                l2 = l2.next

            carry = s // 10
            curr.next = ListNode(s % 10)
            curr = curr.next

        return dummy.next
```

---

## 19. 删除链表的倒数第 N 个结点 - Mid

### 核心思路

快慢指针间隔 n+1

### Python 实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        fast = slow = dummy

        for _ in range(n + 1):
            fast = fast.next

        while fast:
            fast = fast.next
            slow = slow.next

        slow.next = slow.next.next
        return dummy.next
```

---

## 24. 两两交换链表中的节点 - Mid

### Python 实现

```python
class Solution:
    def swapPairs(self, head):
        dummy = ListNode(0, head)
        prev = dummy

        while prev.next and prev.next.next:
            a = prev.next
            b = a.next

            prev.next = b
            a.next = b.next
            b.next = a

            prev = a

        return dummy.next
```

---

## 25. K 个一组翻转链表 - Hard

### Python 实现

```python
class Solution:
    def reverseKGroup(self, head, k):
        dummy = ListNode(0, head)
        pre = dummy

        while True:
            end = pre
            for _ in range(k):
                end = end.next
                if not end:
                    return dummy.next

            start = pre.next
            nxt = end.next
            end.next = None

            pre.next = self.reverse(start)
            start.next = nxt

            pre = start

    def reverse(self, head):
        prev = None
        curr = head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev
```

---

## 23. 合并 K 个升序链表 - Hard

### 核心思路

小顶堆（heapq）

### Python 实现

```python
import heapq

class Solution:
    def mergeKLists(self, lists):
        heap = []

        for i, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, i, node))

        dummy = ListNode(0)
        curr = dummy

        while heap:
            val, i, node = heapq.heappop(heap)
            curr.next = node
            curr = curr.next

            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))

        return dummy.next
```

---

## 146. LRU 缓存 - Mid

### 核心思路

* 哈希表 + 双向链表
* O(1) get / put

### Python 实现

```python
class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = self.next = None


class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = {}

        self.head = Node()
        self.tail = Node()

        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key):
        if key not in self.cache:
            return -1

        node = self.cache[key]
        self._move_to_head(node)
        return node.val

    def put(self, key, value):
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_head(node)
        else:
            node = Node(key, value)
            self.cache[key] = node
            self._add(node)

            if len(self.cache) > self.cap:
                removed = self._remove_tail()
                del self.cache[removed.key]

    def _add(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _move_to_head(self, node):
        self._remove(node)
        self._add(node)

    def _remove_tail(self):
        node = self.tail.prev
        self._remove(node)
        return node
```



---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-linked-list/  

