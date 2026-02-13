---
title: "【HOT100/双指针】LeetCode 125. 验证回文串"
date: 2025-09-16 21:02:00 +0900
categories: [算法, LeetCode]
tags: [字符串, 双指针]
---

## 题目回顾

> 如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样。则可以认为该短语是一个 **回文串** 。
>
> 字母和数字都属于字母数字字符。
>
> 给你一个字符串 `s`，如果它是 **回文串** ，返回 `true` ；否则，返回 `false` 。

**示例：**

**输入：** s = `"A man, a plan, a canal: Panama"`
**输出：** `true`
**解释：** `"amanaplanacanalpanama"` 是回文串。

## 核心思路：相向双指针

"回文"这个特性，天然就适合使用**相向双指针**来解决。我们可以设置一个指针从字符串头部开始，另一个指针从尾部开始，同时向中间移动并进行比较。

对于这道题，我们需要在比较之前，先对字符进行"清洗"，即忽略非字母数字字符和大小写。

1.  **初始化指针**：
    * 定义左指针 `left` 指向字符串的起始位置 `0`。
    * 定义右指针 `right` 指向字符串的末尾位置 `s.length() - 1`。

2.  **循环与过滤**：
    * 当 `left < right` 时，循环继续。
    * 在循环内部，首先要找到左右两边有效的、可用于比较的字符。
        * 移动 `left` 指针：如果 `left` 指向的字符**不是**字母或数字，就将 `left` 右移 (`left++`)，跳过该字符。
        * 移动 `right` 指针：如果 `right` 指向的字符**不是**字母或数字，就将 `right` 左移 (`right--`)，跳过该字符。

3.  **比较字符**：
    * 当左右指针都停留在有效的字母数字字符上时，将它们统一转换为小写进行比较。
    * 如果 `Character.toLowerCase(s.charAt(left))` **不等于** `Character.toLowerCase(s.charAt(right))`，说明字符串不是回文串，可以直接返回 `false`。

4.  **向中心移动**：
    * 如果当前左右指针指向的字符相等，则说明这对字符是匹配的。我们将两个指针向中间各移动一步（`left++`, `right--`），继续下一轮的比较。

5.  **返回结果**：
    * 如果循环正常结束（即 `left` 与 `right` 相遇或交错），说明所有有效的字符对都匹配成功，整个字符串是回文串，返回 `true`。

## 代码实现 (Java)

```java
class Solution {
    public boolean isPalindrome(String s) {
        if (s == null || s.length() == 0) {
            return true;
        }

        int left = 0, right = s.length() - 1;
        while (left < right) {
            // 从左边找到一个字母或数字
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }

            // 从右边找到一个字母或数字
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }

            // 比较找到的两个字符（忽略大小写）
            if (left < right) {
                if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                    return false;
                }
                // 指针向中间移动
                left++;
                right--;
            }
        }

        return true;
    }
}
```
**复杂度分析**

- 时间复杂度: `O(n)`。其中 n 是字符串的长度。left 和 right 指针最多各自遍历字符串一次。

- 空间复杂度: `O(1)`。只使用了常数个额外变量（指针），没有使用与输入大小相关的额外空间。