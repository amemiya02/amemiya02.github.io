---
title: "【HOT100/哈希表 / 摩尔投票】LeetCode 169. 多数元素"
date: 2025-09-15 10:05:00 +0900
categories: [算法, LeetCode]
tags: [数组, 哈希表, 摩尔投票]
---

## 题目回顾

> 给定一个大小为 `n` 的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数 **大于** `⌊ n/2 ⌋` 的元素。
>
> 你可以假设数组是非空的，并且给定的数组总是存在多数元素。

**示例：**

**输入：** nums = `[2,2,1,1,1,2,2]`
**输出：** `2`

## 核心思路

这道题旨在寻找数组中数量过半的元素。我们介绍两种主流的思路。

### 思路一：哈希表计数

这是最直观、最容易想到的方法。我们可以利用一个哈希表（HashMap）来记录数组中每个元素出现的次数。

1.  **定义哈希表**：创建一个 `Map<Integer, Integer>` 用于存储 `元素 -> 出现次数` 的映射。
2.  **遍历数组**：遍历 `nums` 数组，对于每个元素 `num`：
    * 将其在哈希表中的计数值加 1。
    * 每次更新计数后，立即检查该元素的计数值是否已经大于 `n/2`。
    * 如果超过 `n/2`，那么这个元素就是我们要找的多数元素，直接返回它。
3.  **返回结果**：由于题目保证多数元素总是存在，所以在遍历过程中必然会找到答案。

这个方法用空间换时间，思路简单清晰，易于实现。

### 思路二：摩尔投票算法 (Boyer-Moore Voting Algorithm)

这是一种非常巧妙的算法，可以在线性的时间和常数的空间内解决问题。

它的核心思想是**对拼消耗**。可以想象成在数组中进行一场选举，不同阵营的候选人进行投票。

1.  **定义候选者和票数**：我们维护一个候选者 `candidate` 和一个计数器 `count`。
2.  **遍历数组**：遍历 `nums` 数组，对于每个元素 `num`：
    * 如果 `count` 为 `0`，表示之前的候选者已经被"淘汰"了，我们将当前元素 `num` 设为新的 `candidate`，并将 `count` 设为 1。
    * 如果 `num` 与 `candidate` **相同**，就给候选者"投一票"，`count` 加 1。
    * 如果 `num` 与 `candidate` **不同**，就让候选者的票数"抵消"一张，`count` 减 1。
3.  **返回结果**：遍历结束后，留下的 `candidate` 就是最终的多数元素。

**为什么这个方法可行？** 因为多数元素的数量超过了数组长度的一半，这意味着它的数量比所有其他元素数量的总和还要多。所以在对拼消耗的过程中，它的票数 `count` 最终不可能被减到 0 或以下，它必然是笑到最后的那个。

## 代码实现 (Java)

### 解法一：哈希表

```java
class Solution {
    public int majorityElement(int[] nums) {
        Map<Integer, Integer> map = new HashMap<>();
        int n = nums.length;

        for (int num : nums) {
            map.put(num, map.getOrDefault(num, 0) + 1);
            if (map.get(num) > n / 2) {
                return num;
            }
        }

        // 根据题意，循环中必定会返回，这里可以是任意返回值
        return -1;
    }
}
```
- 时间复杂度: `O(n)`。需要遍历一次数组。

- 空间复杂度: `O(n)`。在最坏情况下，哈希表可能需要存储近 n/2 个不同的元素。

### 解法二：摩尔投票

```java
class Solution {
    public int majorityElement(int[] nums) {
        int count = 0;
        Integer candidate = null;

        for (int num : nums) {
            if (count == 0) {
                candidate = num;
            }
            count += (num == candidate) ? 1 : -1;
        }

        return candidate;
    }
}
```
- 时间复杂度: `O(n)`。需要遍历一次数组。

- 空间复杂度: `O(1)`。只使用了 `candidate` 和 `count` 两个额外变量。