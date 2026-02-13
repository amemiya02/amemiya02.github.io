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


## [33. 搜索旋转排序数组 - Medium](https://leetcode-cn.com/problems/search-in-rotated-sorted-array/)

### 题目回顾


> 整数数组 nums 按升序排列，数组中的值 互不相同 。
> 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 向左旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 下标 3 上向左旋转后可能变为 [4,5,6,7,0,1,2] 。
> 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
> 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。


### 核心思路

这道题的核心是在旋转过的有序数组中高效查找目标值，要求时间复杂度为 O (log n)，因此需要基于二分查找进行改造：
1. 旋转后的数组特点：以中间点 mid 为界，[0, mid] 或 [mid, n-1] 必有一个子数组是有序的；
2. 每次二分后，先判断哪一部分有序，再检查目标值是否在这个有序区间内：
- 若在，则在该有序区间内继续二分；
- 若不在，则去另一部分无序区间继续二分；
3. 循环结束仍未找到目标值则返回 -1。

### 代码实现

```go

func search(nums []int, target int) int {
	n := len(nums)
	// 边界条件：空数组直接返回 -1
	if n == 0 {
		return -1
	}
	// 边界条件：只有一个元素，直接判断是否等于目标值
	if n == 1 {
		if nums[0] == target {
			return 0
		}
		return -1
	}

	// 初始化左右指针
	left, right := 0, n-1
	// 二分查找核心循环
	for left <= right {
		// 计算中间索引（避免 left+right 溢出，等价于 (left+right)/2）
		mid := left + (right-left)/2
		// 找到目标值，直接返回索引
		if nums[mid] == target {
			return mid
		}

		// 判断左半部分 [left, mid] 是否有序
		if nums[left] <= nums[mid] {
			// 目标值在左半有序区间内
			if nums[left] <= target && target < nums[mid] {
				right = mid - 1
			} else {
				// 目标值不在左半，去右半部分查找
				left = mid + 1
			}
		} else {
			// 右半部分 [mid, right] 有序
			// 目标值在右半有序区间内
			if nums[mid] < target && target <= nums[right] {
				left = mid + 1
			} else {
				// 目标值不在右半，去左半部分查找
				right = mid - 1
			}
		}
	}
    return -1
}

```

### 复杂度分析

- 时间复杂度：$O(log n)$，每次迭代将搜索空间减半。
- 空间复杂度：$O(1)$，只使用了常数级别的额外空间。

## [153. 寻找旋转排序数组中的最小值 - Medium](https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/)

### 题目回顾

> 已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：
若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]
若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]
注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次 的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]] 。
> 给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。
> 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。

### 核心思路

这道题的核心是在旋转排序数组中找到最小值，核心思路延续了旋转数组的二分特性：
1. 若数组未旋转（nums[0] < nums[n-1]），直接返回第一个元素；
2. 旋转数组的最小值是 “旋转点”，即满足 nums[mid] < nums[mid-1] 的位置，或 nums[mid] > nums[mid+1] 的下一个位置；
3. 利用二分缩小范围：若左半部分有序（nums[0] < nums[mid]），说明最小值在右半部分；反之在左半部分；
4. 循环中找到旋转点直接返回，未找到则返回初始值（应对数组只有 1 个元素的边界情况）。


### 代码实现

```go



func findMin(nums []int) int {
    n := len(nums)
    // 数组未旋转，直接返回第一个元素
    if nums[0] < nums[n-1] {
        return nums[0]
    }

    // 初始化结果为第一个元素（应对只有1个元素的情况）
    res := nums[0]
    left, right := 0, n-1

    for left <= right {
        mid := left + (right-left)/2 // 避免溢出的mid计算方式

        // 找到旋转点：当前元素比前一个小，说明是最小值
        if mid > 0 && nums[mid] < nums[mid-1] {
            return nums[mid]
        }
        // 找到旋转点：当前元素比后一个大，后一个是最小值
        if mid < n-1 && nums[mid] > nums[mid+1] {
            return nums[mid+1]
        }

        // 左半部分有序，最小值在右半部分
        if nums[0] < nums[mid] {
            left = mid + 1
        } else {
            // 右半部分有序，最小值在左半部分
            right = mid - 1
        }
    }

    return res
}
```

### 复杂度分析
- 时间复杂度：$O(log n)$，每次迭代将搜索空间减半。
- 空间复杂度：$O(1)$，只使用了常数级别的额外空间。

## [4. 寻找两个正序数组的中位数 - Hard](https://leetcode-cn.com/problems/median-of-two-sorted-arrays/)

### 题目回顾
> 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
> 算法的时间复杂度应该为 O(log (m+n)) 。

### 核心思路

这道题的核心要求是在 O (log (m+n)) 时间复杂度内找到两个有序数组的中位数，核心思路是将中位数问题转化为找第 k 小元素的问题：
1. 若两个数组总长度为奇数，中位数就是第 (m+n)/2 + 1 小的元素；
2. 若为偶数，中位数是第 (m+n)/2 和 (m+n)/2 + 1 小的元素的平均值；
3. 找第 k 小元素的递归逻辑：
- 每次从两个数组中各取前 k/2 个元素，比较末尾值，排除较小的那部分（这部分一定不包含第 k 小元素）；
- 缩小 k 的值（减去排除的元素个数），递归查找剩余部分；
- 递归终止条件：某个数组遍历完、k=1（取两数组当前首元素最小值）。

### 代码实现

```go

func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
	m, n := len(nums1), len(nums2)
	sum := m + n
	if sum%2 == 1 {
		// 奇数：找第 sum/2 + 1 小的元素
		k := sum/2 + 1
		return float64(findKthSmall(k, nums1, 0, m-1, nums2, 0, n-1))
	} else {
		// 偶数：找第 sum/2 和 sum/2+1 小的元素取平均
		k1 := sum / 2
		k2 := sum/2 + 1
		val1 := findKthSmall(k1, nums1, 0, m-1, nums2, 0, n-1)
		val2 := findKthSmall(k2, nums1, 0, m-1, nums2, 0, n-1)
		return float64(val1+val2) / 2.0
	}
}

// findKthSmall 查找两个有序数组中第 k 小的元素
// start1/end1: nums1 的当前查找区间
// start2/end2: nums2 的当前查找区间
func findKthSmall(k int, nums1 []int, start1, end1 int, nums2 []int, start2, end2 int) int {
	// 终止条件1：nums1 已无元素，直接从 nums2 取第 k 个
	if start1 > end1 {
		return nums2[start2+k-1]
	}
	// 终止条件2：nums2 已无元素，直接从 nums1 取第 k 个
	if start2 > end2 {
		return nums1[start1+k-1]
	}
	// 终止条件3：k=1，取两个数组当前首元素的最小值
	if k == 1 {
		return min(nums1[start1], nums2[start2])
	}

	// 计算两个数组中要比较的位置（防止越界）
	i1 := min(start1+k/2-1, end1)
	i2 := min(start2+k/2-1, end2)

	// 排除较小的那部分元素，递归查找剩余部分
	if nums1[i1] < nums2[i2] {
		excluded := i1 - start1 + 1 // 排除的元素个数
		return findKthSmall(k-excluded, nums1, i1+1, end1, nums2, start2, end2)
	} else {
		excluded := i2 - start2 + 1 // 排除的元素个数
		return findKthSmall(k-excluded, nums1, start1, end1, nums2, i2+1, end2)
	}
}

// min 辅助函数：返回两个整数的最小值
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
```

### 复杂度分析

- 时间复杂度：$O(log (m+n))$，每次递归调用将 k 减半，最多递归 log (m+n) 次。
- 空间复杂度：$O(log (m+n))$，递归调用栈的空间复杂度，最坏情况下递归深度为 log (m+n)。