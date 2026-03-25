---
title: "[Python] LeetCode 热题 100 - 二分查找"
date: 2026-03-25T15:30:20+09:00
categories: [算法, LeetCode]
tags: [Python, 二分查找, 题解]
draft: false
author:
  name: Amemiya
  link:
  email:
  avatar: avatar.jpg
---

# 二分查找

### [35. 搜索插入位置 - Easy](https://leetcode.cn/problems/search-insert-position/)

### 核心思路
**左闭右闭区间：** 我们维护 `[left, right]`。当循环结束时，`left` 正好停在第一个大于或等于 `target` 的位置。



### 代码实现
```python
def searchInsert(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1

    while left <= right:
        # Python 3 中 // 是整数除法
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    # 规律：如果没找到，left 始终指向插入位置
    return left
```

---

### [74. 搜索二维矩阵 - Medium](https://leetcode.cn/problems/search-a-2d-matrix/)

### 核心思路
**虚拟展开：** 由于矩阵每一行接在上一行后面依然有序，我们可以把 $M \times N$ 的矩阵看作一个长度为 $M \times N$ 的有序一维数组。
- **一维转二维公式：** `row = idx // n`, `col = idx % n`

### 代码实现
```python
def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix or not matrix[0]: return False

    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1

    while left <= right:
        mid = left + (right - left) // 2
        # 核心：坐标映射
        pivot_val = matrix[mid // n][mid % n]

        if pivot_val == target:
            return True
        elif pivot_val < target:
            left = mid + 1
        else:
            right = mid - 1

    return False
```

---

### [34. 在排序数组中查找元素的第一个和最后一个位置 - Medium](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

### 核心思路
**边界挤压：** 普通二分在找到 `target` 后会停止，但为了找边界，我们在找到后继续向左（或向右）收缩区间。

### 代码实现
```python
def searchRange(nums: list[int], target: int) -> list[int]:
    def findBound(is_left):
        left, right = 0, len(nums) - 1
        bound = -1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                bound = mid
                if is_left:
                    right = mid - 1 # 找到相等也不停，向左挤压找起始点
                else:
                    left = mid + 1  # 找到相等也不停，向右挤压找终点
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return bound

    return [findBound(True), findBound(False)]
```

---

### [33. 搜索旋转排序数组 - Medium](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

### 核心思路
**局部有序：** 旋转数组中，`mid` 总是会将数组分成一个“有序”半区和一个“可能无序”半区。我们优先判断 target 是否在有序半区内。



### 代码实现
```python
def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid

        # 判断哪一半是有序的
        if nums[left] <= nums[mid]:
            # 左半部分有序
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # 右半部分有序
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1
```

---

### [153. 寻找旋转排序数组中的最小值 - Medium](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)

### 核心思路
**收敛到波谷：** 我们的目标是寻找旋转点。如果 `nums[mid] > nums[right]`，说明最小值一定在右边。

### 代码实现
```python
def findMin(nums: list[int]) -> int:
    left, right = 0, len(nums) - 1

    # 只要数组已经有序，直接返回第一个
    if nums[left] <= nums[right]:
        return nums[left]

    while left <= right:
        mid = left + (right - left) // 2

        # 旋转点特征：nums[mid] 比前后都大/小
        if mid > 0 and nums[mid] < nums[mid-1]:
            return nums[mid]
        if mid < len(nums)-1 and nums[mid] > nums[mid+1]:
            return nums[mid+1]

        # 判断最小值在哪个区间
        if nums[mid] > nums[left]:
            # 左边有序，旋转点（最小值）在右边
            left = mid + 1
        else:
            right = mid - 1
    return nums[0]
```

---

### [4. 寻找两个正序数组的中位数 - Hard](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

### 核心思路
**第 k 小元素（二分淘汰法）：**
中位数即为第 $k$ 小的数。我们每次比较两个数组中第 $k/2$ 个元素，将较小的那一半直接排除。这种逻辑能将复杂度降到 $O(\log(M+N))$。

### 代码实现
```python
def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    def getKth(k, s1, e1, s2, e2):
        # 边界情况：一个数组已排空
        if s1 > e1: return nums2[s2 + k - 1]
        if s2 > e2: return nums1[s1 + k - 1]
        if k == 1: return min(nums1[s1], nums2[s2])

        # 比较两个数组的第 k/2 个元素
        i = min(e1, s1 + k // 2 - 1)
        j = min(e2, s2 + k // 2 - 1)

        if nums1[i] < nums2[j]:
            # 排除 nums1 的前一部分
            return getKth(k - (i - s1 + 1), i + 1, e1, s2, e2)
        else:
            # 排除 nums2 的前一部分
            return getKth(k - (j - s2 + 1), s1, e1, j + 1, e2)

    n1, n2 = len(nums1), len(nums2)
    left = (n1 + n2 + 1) // 2
    right = (n1 + n2 + 2) // 2

    # 统一奇偶情况：奇数时 left=right，偶数时为中间两数
    return (getKth(left, 0, n1 - 1, 0, n2 - 1) +
            getKth(right, 0, n1 - 1, 0, n2 - 1)) / 2.0
```
