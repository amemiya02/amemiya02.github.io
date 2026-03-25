# [Python] LeetCode 热题 100 - 滑动窗口


# 滑动窗口

## [3. 无重复字符的最长子串 - Mid](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

### 题目回顾

> 给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。

---

### 核心思路：滑动窗口

核心模型：

👉 用一个窗口 `[left, right]` 维护「无重复子串」

---

### 代码实现（Python）

```python
def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    ans = 0

    for right in range(len(s)):
        # 如果重复，就不断收缩窗口
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1

        char_set.add(s[right])
        ans = max(ans, right - left + 1)

    return ans
````

---

### 优化写法（跳跃式移动 left）

```python
def lengthOfLongestSubstring(s):
    last = {}
    left = 0
    ans = 0

    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1

        ans = max(ans, right - left + 1)
        last[c] = right

    return ans
```

---

### 复杂度分析

* 时间复杂度: $O(n)$
* 空间复杂度: $O(k)$（字符集大小）

---

## [438. 找到字符串中所有字母异位词 - Mid](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

### 核心思路：定长滑动窗口 + 频率统计

👉 本质：比较两个字符串的字符频率

---

### 代码实现（Python）

```python id="5q7bfi"
def findAnagrams(s, p):
    from collections import Counter

    res = []
    p_count = Counter(p)
    window = Counter()

    left = 0
    for right, c in enumerate(s):
        window[c] += 1

        # 保持窗口长度等于 len(p)
        if right - left + 1 > len(p):
            window[s[left]] -= 1
            if window[s[left]] == 0:
                del window[s[left]]
            left += 1

        # 判断是否匹配
        if window == p_count:
            res.append(left)

    return res
```

---

### 更高性能写法（数组代替 Counter）

```python id="d0t7pq"
def findAnagrams(s, p):
    res = []
    s_len, p_len = len(s), len(p)

    if s_len < p_len:
        return res

    p_count = [0] * 26
    s_count = [0] * 26

    for i in range(p_len):
        p_count[ord(p[i]) - ord('a')] += 1
        s_count[ord(s[i]) - ord('a')] += 1

    if s_count == p_count:
        res.append(0)

    for i in range(p_len, s_len):
        s_count[ord(s[i]) - ord('a')] += 1
        s_count[ord(s[i - p_len]) - ord('a')] -= 1

        if s_count == p_count:
            res.append(i - p_len + 1)

    return res
```

---

### 复杂度分析

* 时间复杂度: $O(n)$
* 空间复杂度: $O(1)$（固定 26 字母）



---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-sliding-window/  

