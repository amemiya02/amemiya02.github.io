---
title: "【哈希表 / 数组】LeetCode 383. 赎金信"
date: 2025-09-18 18:18:00 +0900
categories: [算法, LeetCode]
tags: [字符串, 哈希表, 数组]
---

## 题目回顾

> 给你两个字符串：`ransomNote` 和 `magazine` ，判断 `ransomNote` 能不能由 `magazine` 里面的字符构成。
>
> 如果可以，返回 `true` ；否则返回 `false` 。
>
> `magazine` 中的每个字符只能在 `ransomNote` 中使用一次。

**示例 1：**

**输入：** ransomNote = `"a"`, magazine = `"b"`
**输出：** `false`

**示例 2：**

**输入：** ransomNote = `"aa"`, magazine = `"aab"`
**输出：** `true`

## 核心思路：字符计数

这道题的本质是判断 `magazine` 字符串中的字符数量，是否足够“支付” `ransomNote` 中所需的字符数量。字符的顺序无关紧要，我们只关心每个字符的可用频率。

这是一个典型的**哈希表**或**频率统计**问题。

1.  **统计资源**：首先，我们需要清点我们拥有的“资源”，即 `magazine` 中每个字符的数量。
    * 我们可以遍历 `magazine` 字符串。
    * 由于题目中只包含小写英文字母，我们可以使用一个长度为 26 的整型数组 `counts` 来充当哈希表，这比使用 `HashMap` 更高效。数组的索引 `c - 'a'` 对应字符 `c`。
    * 遍历 `magazine` 时，将对应字符的计数值加 1。

2.  **消耗资源**：统计完 `magazine` 的字符后，我们再遍历 `ransomNote`，看看我们的资源是否足够。
    * 对于 `ransomNote` 中的每一个字符，我们检查它在 `counts` 数组中对应的计数值。
    * 如果计数值**等于 0**，说明 `magazine` 中已经没有这个字符可供使用了，因此无法构成 `ransomNote`，直接返回 `false`。
    * 如果计数值**大于 0**，说明资源充足。我们将该字符的计数值减 1，表示“消耗”掉了一个字符。

3.  **得出结论**：
    * 如果我们能成功遍历完整个 `ransomNote` 字符串而没有中途返回 `false`，那就说明 `magazine` 的资源完全足够，最终返回 `true`。

在开始计数前，可以做一个简单的剪枝判断：如果 `ransomNote` 的长度大于 `magazine` 的长度，那么 `magazine` 无论如何也不可能凑成 `ransomNote`，可以直接返回 `false`。

## 代码实现 (Java)


```java
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int n = ransomNote.length(), m = magazine.length();
        
        // 剪枝：如果赎金信比杂志长，肯定无法构成
        if (n > m) {
            return false;
        }

        // 创建一个长度为 26 的数组作为哈希表，统计 magazine 中各字符的频率
        int[] counts = new int[26];
        for (char c : magazine.toCharArray()) {
            counts[c - 'a']++;
        }

        // 遍历赎金信，消耗 magazine 中的字符
        for (char c : ransomNote.toCharArray()) {
            int index = c - 'a';
            // 如果对应字符的计数为 0，说明 magazine 中已无此字符
            if (counts[index] == 0) {
                return false;
            } else {
                // 消耗一个字符
                counts[index]--;
            }
        }
        
        // 成功遍历完赎金信，说明可以构成
        return true;
    }
}
```
**复杂度分析**

- 时间复杂度: O(m + n)。其中 m 是 magazine 的长度，n 是 ransomNote 的长度。我们需要分别遍历两个字符串各一次。

- 空间复杂度: O(1)。我们使用了一个额外的数组来存储字符频率。由于字符集的大小是固定的（小写字母共 26 个），所以空间消耗是常数级别的，不随输入字符串的长度而改变。因此，空间复杂度为 O(1)。
