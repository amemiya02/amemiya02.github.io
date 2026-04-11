# [Python] LeetCode 热题 100 - 二分查找


# 二分查找

### [35. 搜索插入位置 - Easy](https://leetcode.cn/problems/search-insert-position/)

### 题目回顾
> 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
> 请必须使用时间复杂度为 $O(log n)$ 的算法。

### 核心思路
**左闭右闭区间：** 我们维护 `[left, right]`。当循环结束时，`left` 正好停在第一个大于或等于 `target` 的位置。



### 代码实现
```python
class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1

        while left <= right:
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

### 题目回顾
> 编写一个高效的算法来判断 m x n 矩阵中，是否存在一个目标值。该矩阵具有以下特性：
> - 每行中的整数从左到右按升序排列。
> - 每行的第一个整数大于前一行的最后一个整数。
> 给你一个整数 target ，如果 target 在矩阵中，返回 true ；否则，返回 false 。

### 核心思路
**虚拟展开：** 由于矩阵每一行接在上一行后面依然有序，我们可以把 $M \times N$ 的矩阵看作一个长度为 $M \times N$ 的有序一维数组。
- **一维转二维公式：** `row = idx // n`, `col = idx % n`

### 代码实现
```python
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
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

### 题目回顾
> 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target 。请你找出给定目标值在数组中的开始位置和结束位置。
> 如果数组中不存在目标值 target，返回 [-1, -1] 。
> 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

### 核心思路
**边界挤压：** 普通二分在找到 `target` 后会停止，但为了找边界，我们在找到后继续向左（或向右）收缩区间。

### 代码实现
```python
class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
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

### 题目回顾
> 整数数组 nums 按升序排列，数组中的值 互不相同 。
> 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 向左旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 下标 3 上向左旋转后可能变为 [4,5,6,7,0,1,2] 。
> 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
> 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。

### 核心思路
**局部有序：** 旋转数组中，`mid` 总是会将数组分成一个“有序”半区和一个“可能无序”半区。我们优先判断 target 是否在有序半区内。


### 代码实现
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
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

### 题目回顾
> 已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：
> 若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]
> 若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]
> 注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次 的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]] 。
> 给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。
> 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。

### 核心思路
**收敛到波谷：** 我们的目标是寻找旋转点。如果 `nums[mid] > nums[right]`，说明最小值一定在右边。

### 代码实现
```python
class Solution:
    def findMin(self, nums: List[int]) -> int:
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

### 题目回顾
> 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
> 算法的时间复杂度应该为 O(log (m+n)) 。

### 核心思路
**第 k 小元素（二分淘汰法）：**
中位数即为第 $k$ 小的数。我们每次比较两个数组中第 $k/2$ 个元素，将较小的那一半直接排除。这种逻辑能将复杂度降到 $O(\log(M+N))$。

### 代码实现
```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        def getKth(k, s1, e1, s2, e2):
            """
            s1 > e1：说明 nums1 的有效区间已经为空（里面的数全被排除了）。
            那第 $k$ 小的数肯定在 nums2 剩下的数里面，
            直接取 nums2[s2 + k - 1] 即可。s2 > e2：同理，说明 nums2 已经空了，直接去 nums1 里拿。
            """
            if s1 > e1: return nums2[s2 + k - 1]
            if s2 > e2: return nums1[s1 + k - 1]
            if k == 1: return min(nums1[s1], nums2[s2])

            # 比较两个数组的第 k/2 个元素
            i = min(e1, s1 + k // 2 - 1)
            j = min(e2, s2 + k // 2 - 1)

            if nums1[i] < nums2[j]:
                """
                这意味着 nums1 的前 $k/2$ 个元素，
                绝对不可能是合并后的第 $k$ 个元素，
                最多也只能是第 $k-1$ 个元素
                （即使 nums2 的前 $k/2 - 1$ 个元素全比它们小，
                加起来也只有 $(k/2) + (k/2 - 1) = k - 1$ 个）。
                """
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


---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-binary-search/  

