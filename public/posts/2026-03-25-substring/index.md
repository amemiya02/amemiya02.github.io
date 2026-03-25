# [Python] LeetCode 热题 100 - 子串


# 子串

## [560. 和为 K 的子数组 - Mid](https://leetcode.cn/problems/subarray-sum-equals-k/)

### 题目回顾

> 给你一个整数数组 `nums` 和一个整数 `k` ，请你统计和为 `k` 的子数组个数。

---

### 核心思路：前缀和 + 哈希表

关键转化：

$$
pre[i] - pre[j-1] = k
\Rightarrow pre[j-1] = pre[i] - k
$$

👉 转化为：找有多少个前缀和等于 `pre - k`

---

### 代码实现（Python）

```python
def subarraySum(nums, k):
    from collections import defaultdict

    mp = defaultdict(int)
    mp[0] = 1  # 关键初始化

    pre = 0
    count = 0

    for num in nums:
        pre += num

        if pre - k in mp:
            count += mp[pre - k]

        mp[pre] += 1

    return count
````

---

### 复杂度分析

* 时间复杂度: $O(n)$
* 空间复杂度: $O(n)$

---

## [239. 滑动窗口最大值 - Hard](https://leetcode.cn/problems/sliding-window-maximum/)

### 核心思路：单调队列

👉 维护一个**单调递减队列（存下标）**

---

### 代码实现（Python）

```python
from collections import deque

def maxSlidingWindow(nums, k):
    q = deque()
    res = []

    for i, num in enumerate(nums):
        # 1. 维护单调性（递减）
        while q and nums[q[-1]] < num:
            q.pop()

        q.append(i)

        # 2. 移除过期元素
        if q[0] <= i - k:
            q.popleft()

        # 3. 记录结果
        if i >= k - 1:
            res.append(nums[q[0]])

    return res
```

---

### 复杂度分析

* 时间复杂度: $O(n)$
* 空间复杂度: $O(k)$

---

## [76. 最小覆盖子串 - Hard](https://leetcode.cn/problems/minimum-window-substring/)

### 核心思路：滑动窗口 + 计数

👉 本质：找到最小窗口，使得 **窗口频次 ≥ t 频次**

---

### 代码实现（Python）

```python
from collections import Counter

def minWindow(s, t):
    need = Counter(t)
    window = {}

    need_cnt = len(t)
    left = 0
    start = 0
    min_len = float('inf')

    for right, c in enumerate(s):
        if c in need:
            if window.get(c, 0) < need[c]:
                need_cnt -= 1
            window[c] = window.get(c, 0) + 1

        # 收缩窗口
        while need_cnt == 0:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                start = left

            remove = s[left]
            if remove in need:
                if window[remove] == need[remove]:
                    need_cnt += 1
                window[remove] -= 1

            left += 1

    return "" if min_len == float('inf') else s[start:start + min_len]
```

---

### 复杂度分析

* 时间复杂度: $O(m+n)$
* 空间复杂度: $O(k)$


---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-substring/  

