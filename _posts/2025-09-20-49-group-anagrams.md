---
title: "【HOT100/哈希表】LeetCode 49. 字母异位词分组"
date: 2025-09-20 14:45:00 +0900
categories: [算法, LeetCode]
tags: [字符串, 哈希表]
---

## 题目回顾

> 给你一个字符串数组，请你将 **字母异位词** 组合在一起。可以按任意顺序返回结果列表。
>
> **字母异位词** 是由相同字母按不同顺序排列组成的单词。

**示例 1:**

**输入:** `strs = ["eat", "tea", "tan", "ate", "nat", "bat"]`
**输出:** `[["bat"],["nat","tan"],["ate","eat","tea"]]`

## 核心思路：寻找唯一标识

除了字母完全相同，字母异位词的另一个充要条件是**每个字母出现的频率完全相同**。因此，我们也可以根据一个单词的字符频率来生成 `key`。

例如，对于 `"aab"`，其字符频率可以表示为一个长度为 26 的数组 `[2, 1, 0, 0, ...]`。为了把这个数组用作哈希表的 `key`，我们需要将它转换成一个不可变的字符串。

我们可以简单地将计数拼接起来，例如用 `"#"` 分隔：`"2#1#0#0#..."`。这样，所有异位词（如 `"aba"`, `"baa"`）都会生成这个完全相同的字符串 `key`。

你提供的答案正是采用了这种思路，通过一个辅助函数 `strToCount` 将频率数组转换成一个固定格式的字符串，同样起到了唯一标识的作用。

## 代码实现 (Java)

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String str : strs) {
            // 1. 将每个字符串的字符计数转换为唯一的 key
            String key = generateCountKey(str);
            // 2. 从 map 中获取该 key 对应的列表，若不存在则创建新列表
            List<String> list = map.getOrDefault(key, new ArrayList<>());
            // 3. 将当前字符串加入列表
            list.add(str);
            // 4. 将更新后的列表放回 map
            map.put(key, list);
        }
        // 返回 map 中所有的值（即分组后的列表）
        return new ArrayList<>(map.values());
    }

    // 将字符串转换为基于字符计数的 key
    private String generateCountKey(String str) {
        int[] counts = new int[26];
        for (char c : str.toCharArray()) {
            counts[c - 'a']++;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 26; i++) {
            // 用特殊字符分隔，防止歧义，例如 "b1c2" vs "bc12"
            sb.append((char)('a' + i));
            sb.append(counts[i]);
        }
        return sb.toString();
    }
}
```

**复杂度分析**
设 N 是字符串数组 strs 的长度，K 是数组中字符串的最大长度。

- 时间复杂度: `O(N * K)`。我们需要遍历 N 个字符串，对于每个长度为 K 的字符串，计算其字符频率的时间是 O(K)。

- 空间复杂度: `O(N * K)`。用于存储哈希表和结果。