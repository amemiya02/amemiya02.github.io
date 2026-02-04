---
title: "[Golang] LeetCode 热题 100 - 二分查找"
date: 2026-02-05 8:00:00 +0900
categories: [算法, LeetCode]
tags: [Go, 二分查找, 题解]
---
# 二分查找

## [35. 搜索插入位置 - Easy](https://leetcode-cn.com/problems/search-insert-position/)

### 题目回顾

> 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
> 请必须使用时间复杂度为 $O(log n)$ 的算法。

### 核心思路

1. 为什么最后返回 left？
当循环 left <= right 结束时，必然满足 left > right。

如果 target 大于数组中所有元素，left 会一直右移直到 len(nums)。

如果 target 小于数组中所有元素，right 会一直左移，最后 left 停在 0。

在中间某处没找到时，left 最终会停在第一个大于 target 的元素位置上，这正是插入点。

2. 防止溢出的写法
在 Go（以及其他语言）中，写 mid = (left + right) / 2 在 left 和 right 很大时可能导致整数溢出。使用 mid = left + (right-left)/2 是一种更健壮、更地道的写法。

### 代码实现

```go

func searchInsert(nums []int, target int) int {
    left := 0
    right := len(nums) - 1

    for left <= right {
        // 使用这种方式防止 (left + right) 溢出
        mid := left + (right-left)/2

        if nums[mid] == target {
            // 找到目标值，直接返回索引
            return mid
        } else if nums[mid] < target {
            // 目标值在右半部分，更新左边界
            left = mid + 1
        } else {
            // 目标值在左半部分，更新右边界
            right = mid - 1
        }
    }

    // 如果循环结束未找到，left 指向的正是它应该被插入的位置
    return left
}
```

### 复杂度分析

- 时间复杂度：$O(log n)$，每次迭代将搜索空间减半。
- 空间复杂度：$O(1)$，只使用了常数级别的额外空间。

## [74. 搜索二维矩阵 - Medium](https://leetcode-cn.com/problems/search-a-2d-matrix/)

### 题目回顾

> 编写一个高效的算法来判断 m x n 矩阵中，是否存在一个目标值。该矩阵具有以下特性：
> - 每行中的整数从左到右按升序排列。
> - 每行的第一个整数大于前一行的最后一个整数。
> 给你一个整数 target ，如果 target 在矩阵中，返回 true ；否则，返回 false 。

### 核心思路

坐标映射公式这是本题最关键的数学技巧。假设矩阵总共有 $n$ 列：一维转二维：对于一维索引 $idx$，其在矩阵中的位置是 matrix[idx / n][idx % n]。二维转一维：对于坐标 $(i, j)$，其在一维序列中的位置是 idx = i * n + j。

### 代码实现

```go

func searchMatrix(matrix [][]int, target int) bool {
    if len(matrix) == 0 || len(matrix[0]) == 0 {
        return false
    }

    m, n := len(matrix), len(matrix[0])
    left, right := 0, m*n-1

    for left <= right {
        mid := left + (right-left)/2

        // 核心技巧：将一维索引 mid 映射回二维坐标 (i, j)
        // 行号 i = mid / 列数
        // 列号 j = mid % 列数
        val := matrix[mid/n][mid%n]

        if val == target {
            return true
        } else if val < target {
            left = mid + 1 // 标准二分：跳跃式收缩
        } else {
            right = mid - 1
        }
    }

    return false
}
```

### 复杂度分析
- 时间复杂度：$O(log(m * n))$，其中 $m$ 和 $n$ 分别是矩阵的行数和列数。每次迭代将搜索空间减半。
- 空间复杂度：$O(1)$，只使用了常数级别的额外空间。

## [34. 在排序数组中查找元素的第一个和最后一个位置 - Medium](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

### 题目回顾
> 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target 。请你找出给定目标值在数组中的开始位置和结束位置。
> 如果数组中不存在目标值 target，返回 [-1, -1] 。
> 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

### 核心思路

核心原理解析：如何“挤压”边界
普通的二分查找在发现 nums[mid] == target 时会立即返回。但在有重复元素的数组中，我们要继续探索：

寻找起始位置：即使找到了目标值，我们也不敢停，而是把 right 指针移到 mid - 1，强迫搜索区间向左半部分收缩，看看左边还有没有相同的数字。

寻找结束位置：同理，当发现目标值时，把 left 指针移到 mid + 1，强迫搜索区间向右半部分收缩。

### 代码实现

```go
func searchRange(nums []int, target int) []int {
    // 初始化结果
    res := []int{-1, -1}
    if len(nums) == 0 {
        return res
    }

    // 1. 查找左边界
    res[0] = findBound(nums, target, true)

    // 如果没找到左边界，说明目标值不存在，直接返回
    if res[0] == -1 {
        return res
    }

    // 2. 查找右边界
    res[1] = findBound(nums, target, false)

    return res
}

// findBound 辅助函数：isLeft 为 true 找第一个，false 找最后一个
func findBound(nums []int, target int, isLeft bool) int {
    left, right := 0, len(nums)-1
    bound := -1

    for left <= right {
        mid := left + (right-left)/2

        if nums[mid] == target {
            bound = mid
            if isLeft {
                // 找左边界：在左半部分继续挤压
                right = mid - 1
            } else {
                // 找右边界：在右半部分继续挤压
                left = mid + 1
            }
        } else if nums[mid] > target {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }
    return bound
}
```

### 复杂度分析

- 时间复杂度：$O(log n)$，其中 $n$ 是数组的长度。我们进行了两次二分查找，每次的时间复杂度都是对数级别。
- 空间复杂度：$O(1)$，只使用了常数级别的额外空间。
