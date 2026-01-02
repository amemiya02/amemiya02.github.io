---
title: "【HOT100/滑动窗口】LeetCode 76. Minimum Window Substring"
date: 2025-12-18 14:00:00 +0800
categories: [算法, LeetCode]
tags: [字符串, 哈希表, 滑动窗口]
---

## 题目回顾

> 给定两个字符串 `s` 和 `t`，长度分别是 `m` 和 `n`，返回 `s` 中的 **最短窗口** 子串，使得该子串包含 `t` 中的每一个字符（包括重复字符）。如果没有这样的子串，返回空字符串 `""`。
>
> 测试用例保证答案唯一。

**示例：**

**输入：** `s = "ADOBECODEBANC"`, `t = "ABC"`  
**输出：** `"BANC"`  
**解释：** 最小覆盖子串 `"BANC"` 包含 `t` 中所有字符 `'A'`, `'B'`, `'C'`。

---

## 核心思路：滑动窗口 + 哈希计数

本题是「滑动窗口」的经典应用，核心目标是：在 `s` 中找到一个**最短连续子串**，使其**字符频次 ≥ `t` 的字符频次**（即完全覆盖 `t`）。

### 关键观察点：
1. **窗口有效性判定**：不能只看字符是否出现，而要看**频次是否足够**。例如 `t = "AAB"`，窗口中至少要有 2 个 `'A'` 和 1 个 `'B'`。
2. **扩展与收缩策略**：
   - **右指针 `r` 扩展窗口**：直到窗口**首次满足覆盖条件**；
   - **左指针 `l` 收缩窗口**：在满足条件的前提下，尽可能缩小窗口，尝试找到更优解；
   - 重复上述过程，维护全局最小窗口。

### 实现细节：
- 使用两个哈希表：
  - `ori`：统计 `t` 中各字符的**目标频次**；
  - `cnt`：动态维护当前窗口 `[l, r]` 中各字符的**实际频次**；
- 辅助函数 `check()`：遍历 `ori`，检查 `cnt` 中每个字符频次是否 ≥ `ori` 中对应值；
  - ✅ 优化点：可改用「需匹配字符种类数」+「当前达标种类数」实现 O(1) 判断（见文末优化提示），但为清晰起见，此处保留原写法。

> ⚠️ 注意边界：当 `r` 向右移动后需先判断是否越界再访问 `s.charAt(r)`。

---

## 代码实现 (Java)

```java
class Solution {
    // ori: 目标字符串 t 的字符频次
    // cnt: 当前窗口 [l, r] 的字符频次
    Map<Character, Integer> ori = new HashMap<>();
    Map<Character, Integer> cnt = new HashMap<>();

    public String minWindow(String s, String t) {
        // 初始化 ori：统计 t 中每个字符出现次数
        for (char c : t.toCharArray()) {
            ori.put(c, ori.getOrDefault(c, 0) + 1);
        }

        int l = 0, r = -1; // 窗口初始为 [0, -1]，即空窗口
        int len = Integer.MAX_VALUE; // 记录最小窗口长度
        int ansL = -1, ansR = -1;   // 记录最小窗口起止位置

        int sLen = s.length();
        while (r < sLen) {
            // 右指针右移，尝试扩大窗口
            ++r;
            
            // 注意：r 可能越界，需先判断
            if (r < sLen && ori.containsKey(s.charAt(r))) {
                cnt.put(s.charAt(r), cnt.getOrDefault(s.charAt(r), 0) + 1);
            }

            // 当前窗口满足覆盖条件时，尝试收缩左边界
            while (check() && l <= r) {
                // 更新最优解
                int windowLen = r - l + 1;
                if (windowLen < len) {
                    len = windowLen;
                    ansL = l;
                    ansR = r;
                }

                // 左指针右移，缩小窗口
                char leftChar = s.charAt(l);
                if (ori.containsKey(leftChar)) {
                    cnt.put(leftChar, cnt.get(leftChar) - 1);
                }
                l++;
            }
        }
        // 若未找到有效窗口，ansL 仍为 -1
        return ansL == -1 ? "" : s.substring(ansL, ansR + 1);
    }

    // 检查当前窗口 cnt 是否完全覆盖 ori
    private boolean check() {
        for (Map.Entry<Character, Integer> entry : ori.entrySet()) {
            char key = entry.getKey();
            int required = entry.getValue();
            // 实际频次 < 目标频次 → 不满足
            if (cnt.getOrDefault(key, 0) < required) {
                return false;
            }
        }
        return true;
    }
}

```

## 复杂度分析

- 时间复杂度: `O(m + n × C)`  
  其中 `m = s.length()`, `n = t.length()`, `C` 为字符集大小（本题 `C ≤ 58`，大小写字母共 52 + 其他符号）。  
  最坏情况下，`l` 和 `r` 各遍历 `s` 一次（`O(m)`），每次 `check()` 需 `O(C)`，共 `O(m × C)`；预处理 `t` 为 `O(n)`。  
  （若将 `check()` 优化为 O(1) 判断，则总时间可降至 `O(m + n)`）

- 空间复杂度: `O(C)`  
  两个哈希表 `ori` 和 `cnt` 最多存储 `C` 个键值对。
