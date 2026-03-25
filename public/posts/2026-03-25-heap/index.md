# [Python] LeetCode 热题 100 - 堆


# 堆


### [215. 数组中的第 K 个最大元素 - Medium](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

### 核心思路
虽然题目分类在“堆”，但在面试中，**快速选择 (Quick Select)** 往往是面试官更想看到的 $O(N)$ 方案。
1. **快速选择**：利用快排的 partition 思想。每次分区后，基准值的位置就是它最终排序后的位置。
2. **堆搜索**：维护一个大小为 $k$ 的小顶堆。遍历完数组后，堆顶就是第 $k$ 大元素。



### 代码实现 (快速选择版)
```python
import random

def findKthLargest(nums: list[int], k: int) -> int:
    # 第 k 大 = 升序排序后的索引 len(nums) - k
    target = len(nums) - k

    def quick_select(left, right):
        # 随机选择 pivot 避免极端情况下的 O(n^2)
        pivot_idx = random.randint(left, right)
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]

        pivot = nums[right]
        i = left
        for j in range(left, right):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[right] = nums[right], nums[i]

        # 判断当前 pivot 的位置
        if i == target:
            return nums[i]
        elif i < target:
            return quick_select(i + 1, right)
        else:
            return quick_select(left, i - 1)

    return quick_select(0, len(nums) - 1)
```

> **Pythonic 捷径**：在实际面试中，如果你想展示对库函数的熟悉程度，可以直接用 `heapq.nlargest(k, nums)[-1]`。

---

## [347. 前 K 个高频元素 - Medium](https://leetcode.cn/problems/top-k-frequent-elements/)

### 核心思路
1. **统计频率**：使用 Python 内置的 `collections.Counter`，一行搞定。
2. **维护小顶堆**：遍历频率图，保持堆的大小为 $k$。当新元素频率高于堆顶时，弹出堆顶并压入新元素。

### 代码实现
```python
import heapq
from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    # 1. 统计频率，结果类似 {num: count}
    count_map = Counter(nums)

    # 2. 维护一个小顶堆，元素为 (频率, 数值)
    # Python heapq 默认比较元组的第一个元素
    hp = []
    for num, freq in count_map.items():
        if len(hp) < k:
            heapq.heappush(hp, (freq, num))
        elif freq > hp[0][0]:
            heapq.heapreplace(hp, (freq, num))

    # 3. 提取结果
    return [item[1] for item in hp]
```

### 复杂度分析
- **时间复杂度**：$O(N \log K)$，其中 $N$ 是数组长度。
- **空间复杂度**：$O(N)$，用于存储哈希表。

---

## [295. 数据流的中位数 - Hard](https://leetcode.cn/problems/find-median-from-data-stream/)

### 核心思路
**双堆对峙法**：
- **左堆 (queMax)**：大顶堆，存储较小的一半元素。
- **右堆 (queMin)**：小顶堆，存储较大的一半元素。
- **动态平衡**：
    - 保证左堆的大小等于右堆，或比右堆多 1。
    - 保证左堆的所有元素 $\le$ 右堆的所有元素。



### 代码实现
```python
import heapq

class MedianFinder:
    def __init__(self):
        # Python 只有小顶堆，所以大顶堆通过取负数实现
        self.queMax = [] # 大顶堆 (存储较小的一半)
        self.queMin = [] # 小顶堆 (存储较大的一半)

    def addNum(self, num: int) -> None:
        # 逻辑：先入大顶堆，再将大顶堆顶转入小顶堆，确保顺序
        if not self.queMax or num <= -self.queMax[0]:
            heapq.heappush(self.queMax, -num)
            # 检查平衡：左边不能比右边多超过 1 个
            if len(self.queMax) > len(self.queMin) + 1:
                heapq.heappush(self.queMin, -heapq.heappop(self.queMax))
        else:
            heapq.heappush(self.queMin, num)
            # 检查平衡：右边不能比左边多
            if len(self.queMin) > len(self.queMax):
                heapq.heappush(self.queMax, -heapq.heappop(self.queMin))

    def findMedian(self) -> float:
        if len(self.queMax) > len(self.queMin):
            return float(-self.queMax[0])
        return (-self.queMax[0] + self.queMin[0]) / 2.0
```


---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-heap/  

