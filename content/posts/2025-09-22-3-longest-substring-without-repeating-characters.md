---
title: "【HOT100/滑动窗口/Middle】LeetCode 3. 无重复字符的最长子串"
date: 2025-09-22 18:24:00 +0900
categories: [算法, LeetCode]
tags: [字符串, 哈希集合, 滑动窗口, 双指针]
---

## 题目回顾

> 给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。

**示例 1:**

**输入:** `s = "abcabcbb"`
**输出:** `3`
**解释:** 因为无重复字符的最长子串是 `"abc"`，所以其长度为 3。

**示例 2:**

**输入:** `s = "pwwkew"`
**输出:** `3`
**解释:** 因为无重复字符的最长子串是 `"wke"`，所以其长度为 3。
请注意，你的答案必须是 **子串** 的长度，`"pwke"` 是一个子序列，不是子串。

## 核心思路：滑动窗口

这道题要求我们找到一个**连续**的子串，这个子串需要满足"无重复字符"的条件，并且长度要最长。这种在连续区间上求解的问题，非常适合使用**滑动窗口**算法。

我们可以想象有一个窗口在字符串 `s` 上滑动，窗口的左右边界由两个指针 `left` 和 `right` 决定。这个窗口 `s[left...right]` 就代表了我们正在考察的当前子串。

1.  **数据结构选择**：我们需要一个数据结构来快速判断窗口内是否存在重复字符。**哈希集合 (HashSet)** 是不二之选，它可以在 $O(1)$ 的时间内添加、删除和查找元素。

2.  **窗口的移动逻辑**：
    * **扩大窗口**：我们不断地移动右指针 `right`，将新的字符纳入窗口中。
    * **缩小窗口**：当新加入的字符 `s[right]` 已经在哈希集合中存在时，说明窗口内出现了重复。此时，我们必须从左侧开始缩小窗口，即不断地移动左指针 `left` 并从哈希集合中移除 `s[left]`，直到窗口内不再包含重复的 `s[right]` 为止。

3.  **算法步骤**：
    * 初始化左指针 `left = 0`，右指针 `right = 0`，最大长度 `maxLength = 0`，以及一个空的哈希集合 `set`。
    * 右指针 `right` 开始遍历整个字符串：
        a.  获取当前右指针的字符 `c = s.charAt(right)`。
        b.  **检查重复**：在 `set` 中检查是否存在字符 `c`。如果存在，就进入一个循环，不断从 `set` 中移除左指针 `left` 指向的字符，并递增 `left`，直到 `set` 中不再有 `c`。
        c.  **添加新字符**：将当前字符 `c` 添加到 `set` 中。
        d.  **更新最大长度**：此时，从 `left` 到 `right` 的窗口内一定是无重复字符的。我们更新最大长度：`maxLength = Math.max(maxLength, right - left + 1)`。
        e.  将右指针 `right` 右移一位，考察下一个字符。
    * 遍历结束后，`maxLength` 就是最终答案。

通过这种一扩一缩的动态调整，滑动窗口能够保证在一次遍历中就找到最优解。

## 代码实现 (Java)

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length();
        int maxLength = 0;

        // left 是窗口的左边界，right 是窗口的右边界
        int left = 0;
        // set 存储当前窗口内的不重复字符
        Set<Character> set = new HashSet<>();

        for (int right = 0; right < n; right++) {
            char currentChar = s.charAt(right);

            // 如果 set 中已存在当前字符，说明窗口需要从左侧收缩
            while (set.contains(currentChar)) {
                set.remove(s.charAt(left));
                left++;
            }

            // 将当前字符加入窗口，并扩大窗口
            set.add(currentChar);

            // 更新最大长度 (当前窗口的长度为 right - left + 1)
            maxLength = Math.max(maxLength, right - left + 1);
        }

        return maxLength;
    }
}
```
**复杂度分析**
- 时间复杂度: `O(n)`。虽然代码中有一个 for 循环嵌套一个 while 循环，但每个字符最多被左指针 left 和右指针 right 访问一次。因此，总的操作次数是线性的，而不是二次方。
- 空间复杂度: `O(k)`。其中 k 是字符串中不同字符的数量（即字符集的大小）。哈希集合在最坏情况下需要存储 k 个字符。对于 ASCII 字符集，k 最多为 128，可以看作是 O(1)。