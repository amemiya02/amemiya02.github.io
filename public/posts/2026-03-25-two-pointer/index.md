# [Python] LeetCode 热题 100 - 双指针


# 双指针

## [283. 移动零 - Easy](https://leetcode.cn/problems/move-zeroes/)

### 题目回顾

> 给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。
>
> 必须原地修改数组。

---

### 核心思路：快慢指针

将问题转化为：

👉 把所有非零元素按顺序移动到前面，再补 0

---

### 代码实现（Python）

```python
def moveZeroes(nums):
    slow = 0

    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow] = nums[fast]
            slow += 1

    for i in range(slow, len(nums)):
        nums[i] = 0
````

---

### 复杂度分析

* 时间复杂度: $O(n)$
* 空间复杂度: $O(1)$

---

## [11. 盛最多水的容器 - Mid](https://leetcode.cn/problems/container-with-most-water/)

### 核心思路：双指针 + 贪心

关键结论：

👉 **每次移动短板**

---

### 代码实现（Python）

```python
def maxArea(height):
    l, r = 0, len(height) - 1
    ans = 0

    while l < r:
        width = r - l
        h = min(height[l], height[r])
        ans = max(ans, h * width)

        if height[l] < height[r]:
            l += 1
        else:
            r -= 1

    return ans
```

---

### 复杂度分析

* 时间复杂度: $O(n)$
* 空间复杂度: $O(1)$

---

## [15. 三数之和 - Mid](https://leetcode.cn/problems/3sum/)

### 核心思路：排序 + 双指针

👉 转化为：固定一个数，做两数之和

---

### 代码实现（Python）

```python
def threeSum(nums):
    nums.sort()
    n = len(nums)
    res = []

    for i in range(n - 2):
        # 剪枝
        if nums[i] > 0:
            break

        # 去重
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        l, r = i + 1, n - 1

        while l < r:
            s = nums[i] + nums[l] + nums[r]

            if s == 0:
                res.append([nums[i], nums[l], nums[r]])

                l += 1
                r -= 1

                # 去重
                while l < r and nums[l] == nums[l - 1]:
                    l += 1
                while l < r and nums[r] == nums[r + 1]:
                    r -= 1

            elif s < 0:
                l += 1
            else:
                r -= 1

    return res
```

---

### 复杂度分析

* 时间复杂度: $O(n^2)$
* 空间复杂度: $O(\log n)$（排序）

---

## [42. 接雨水 - Hard](https://leetcode.cn/problems/trapping-rain-water/)

### 核心思路：动态规划（按列计算）

核心公式：

$$
water[i] = \min(left[i], right[i]) - height[i]
$$

---

### 代码实现（Python - DP）

```python
def trap(height):
    n = len(height)
    if n <= 1:
        return 0

    left = [0] * n
    right = [0] * n

    left[0] = height[0]
    for i in range(1, n):
        left[i] = max(left[i - 1], height[i])

    right[-1] = height[-1]
    for i in range(n - 2, -1, -1):
        right[i] = max(right[i + 1], height[i])

    ans = 0
    for i in range(n):
        ans += min(left[i], right[i]) - height[i]

    return ans
```

---

### 进阶：双指针优化（推荐面试写法）

```python
def trap(height):
    l, r = 0, len(height) - 1
    left_max = right_max = 0
    ans = 0

    while l < r:
        if height[l] < height[r]:
            if height[l] >= left_max:
                left_max = height[l]
            else:
                ans += left_max - height[l]
            l += 1
        else:
            if height[r] >= right_max:
                right_max = height[r]
            else:
                ans += right_max - height[r]
            r -= 1

    return ans
```

---

### 复杂度分析

* 时间复杂度: $O(n)$
* 空间复杂度:

  * DP：$O(n)$
  * 双指针：$O(1)$



---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-two-pointer/  

