# [Golang] LeetCode 热题 100 - 堆

# 堆

## [215. 数组中的第 K 个最大元素 - Medium](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

### 题目回顾
> 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。


### 核心思路

这道题的核心是用快速选择算法（快速排序的变种）在 O (n) 平均时间复杂度内找到第 k 大元素，核心思路：
1. 第 k 大元素等价于数组升序排序后第 nums.length - k 小的元素，将问题转化为找第 nums.length - k 小的元素；
2. 快速选择的核心是 partition（分区）：选择基准值，将数组分为 “小于基准” 和 “大于基准” 两部分，返回基准值的索引；
3. 若基准索引等于目标索引 k，直接返回该值；若基准索引大于 k，递归左区间；否则递归右区间；
4. 优化点：提前判断区间是否已有序，若有序则直接返回目标索引值，减少不必要的分区操作。

### 代码实现

```go

func findKthLargest(nums []int, k int) int {
	// 第k大元素 = 升序后第 len(nums)-k 小的元素
	target := len(nums) - k
	return quickSelect(nums, 0, len(nums)-1, target)
}

// quickSelect 快速选择：找到 [left, right] 区间内第 k 小的元素
func quickSelect(nums []int, left, right, k int) int {
	// 区间只有一个元素，直接返回
	if left == right {
		return nums[left]
	}

	// 优化：提前判断区间是否已有序，有序则直接返回目标值
	ordered := true
	for i := left; i < right; i++ {
		if nums[i] > nums[i+1] {
			ordered = false
			break
		}
	}
	if ordered {
		return nums[k]
	}

	// 分区操作，返回基准值的索引
	p := partition(nums, left, right)

	// 根据基准索引递归查找
	if p == k {
		return nums[p]
	} else if p > k {
		return quickSelect(nums, left, p-1, k)
	} else {
		return quickSelect(nums, p+1, right, k)
	}
}

// partition 分区函数：以右边界为基准，将小于基准的元素移到左侧，返回基准最终索引
func partition(nums []int, left, right int) int {
	pivot := nums[right] // 选择右边界为基准值
	i := left - 1        // 小于基准的区域边界

	// 遍历 [left, right-1] 区间
	for j := left; j < right; j++ {
		if nums[j] < pivot {
			i++
			swap(nums, i, j) // 交换到小于基准的区域
		}
	}

	// 将基准值放到正确位置（小于基准的区域右侧）
	i++
	swap(nums, i, right)
	return i
}

// swap 交换数组中两个位置的元素
func swap(nums []int, i, j int) {
	nums[i], nums[j] = nums[j], nums[i]
}
```

### 复杂度分析
- 时间复杂度：平均 $O(n)$，最坏情况 $O(n^2)$（每次分区都极端不平衡）。
- 空间复杂度：$O(1)$，原地分区操作。

## [347. 前 K 个高频元素 - Medium](https://leetcode-cn.com/problems/top-k-frequent-elements/)

### 题目回顾
> 给定一个非空的整数数组，返回其中出现频率前 k 高的元素。

### 核心思路

这道题的核心是 “统计频率 + 筛选高频元素”，暴力解法（排序所有频率）时间复杂度 O (n log n)，最优解法是小顶堆：
1. 哈希表统计频率：遍历数组，用 map 记录每个数字的出现次数；
2. 小顶堆筛选前 k 高：
- 遍历哈希表，将元素和频率加入堆中；
- 若堆的大小超过 k，弹出堆顶（频率最小的元素），保证堆中始终是当前频率前 k 高的元素；
3. 提取结果：遍历堆，取出所有元素即为答案（顺序可任意）。

### 代码实现

```go


import "container/heap"

// 定义小顶堆的元素结构：包含数字和对应的频率
type Item struct {
	num   int
	count int
}

// 定义小顶堆类型，底层是 Item 切片
type MinHeap []Item

// 实现 heap.Interface 接口的 Len 方法：返回堆的大小
func (h MinHeap) Len() int { return len(h) }

// 实现 heap.Interface 接口的 Less 方法：小顶堆的比较逻辑（count 小的优先）
func (h MinHeap) Less(i, j int) bool { return h[i].count < h[j].count }

// 实现 heap.Interface 接口的 Swap 方法：交换两个元素的位置
func (h MinHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }

// 实现 heap.Interface 接口的 Push 方法：向堆中添加元素
func (h *MinHeap) Push(x interface{}) {
	*h = append(*h, x.(Item))
}

// 实现 heap.Interface 接口的 Pop 方法：从堆中弹出最小元素
func (h *MinHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

// topKFrequent 主函数：找出前 k 个高频元素
func topKFrequent(nums []int, k int) []int {
	// 1. 统计每个数字的出现频率
	freqMap := make(map[int]int)
	for _, num := range nums {
		freqMap[num]++
	}

	// 2. 初始化小顶堆
	minHeap := &MinHeap{}
	heap.Init(minHeap)

	// 3. 遍历频率 map，维护大小为 k 的小顶堆
	for num, count := range freqMap {
		heap.Push(minHeap, Item{num: num, count: count})
		// 堆大小超过 k 时，弹出最小频率的元素
		if minHeap.Len() > k {
			heap.Pop(minHeap)
		}
	}

	// 4. 提取堆中的元素作为结果
	result := make([]int, k)
	for i := 0; i < k; i++ {
		item := heap.Pop(minHeap).(Item)
		result[k-1-i] = item.num // 倒序填充（也可正序，题目允许任意顺序）
	}

	return result
}
```

### 复杂度分析
- 时间复杂度：$O(n \log k)$，其中 n 是数组长度，k 是需要返回的高频元素数量。
- 空间复杂度：$O(n)$，哈希表存储频率，堆中最多存储 k 个元素。

## [295. 数据流的中位数 - Hard](https://leetcode-cn.com/problems/find-median-from-data-stream/)

### 题目回顾

> 中位数是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。
> 例如 arr = [2,3,4] 的中位数是 3 。
> 例如 arr = [2,3] 的中位数是 (2 + 3) / 2 = 2.5 。
> 实现 MedianFinder 类:
> MedianFinder() 初始化 MedianFinder 对象。
> void addNum(int num) 将数据流中的整数 num 添加到数据结构中。
> double findMedian() 返回到目前为止所有元素的中位数。与实际答案相差 10-5 以内的答案将被接受。

### 核心思路

数据流的中位数需要支持 “动态添加” 和 “快速查询”，普通排序的方法时间复杂度太高（O (n log n) 每次添加），双堆法是最优解：
1. 大顶堆（左堆）：存储数据流中较小的一半元素，堆顶是这一半的最大值；
2. 小顶堆（右堆）：存储数据流中较大的一半元素，堆顶是这一半的最小值；
3. 堆的平衡规则：
- 左堆大小 = 右堆大小 或 左堆大小 = 右堆大小 + 1；
- 添加元素时，先根据大小加入对应堆，再调整堆的大小以满足平衡规则；
4. 查询中位数：
- 若总元素数为奇数：左堆顶就是中位数；
- 若为偶数：(左堆顶 + 右堆顶) / 2 就是中位数。

### 代码实现

```go

import "container/heap"

// -------------------------- 大顶堆实现 --------------------------
// MaxHeap 大顶堆，底层是 int 切片
type MaxHeap []int

func (h MaxHeap) Len() int           { return len(h) }
func (h MaxHeap) Less(i, j int) bool { return h[i] > h[j] } // 大顶堆：值大的优先
func (h MaxHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MaxHeap) Push(x interface{}) {
	*h = append(*h, x.(int))
}

func (h *MaxHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

// -------------------------- 小顶堆实现 --------------------------
// MinHeap 小顶堆，底层是 int 切片
type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] } // 小顶堆：值小的优先
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MinHeap) Push(x interface{}) {
	*h = append(*h, x.(int))
}

func (h *MinHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

// -------------------------- MedianFinder 实现 --------------------------
// MedianFinder 维护数据流中位数的结构体
type MedianFinder struct {
	left  *MaxHeap // 左堆：大顶堆，存储较小的一半元素
	right *MinHeap // 右堆：小顶堆，存储较大的一半元素
}

// Constructor 初始化 MedianFinder 对象
func Constructor() MedianFinder {
	left := &MaxHeap{}
	right := &MinHeap{}
	heap.Init(left)
	heap.Init(right)
	return MedianFinder{
		left:  left,
		right: right,
	}
}

// AddNum 添加一个数字到数据流中
func (this *MedianFinder) AddNum(num int) {
	// 1. 先根据大小加入对应堆
	if this.left.Len() == 0 || num <= (*this.left)[0] {
		heap.Push(this.left, num) // 小于等于左堆顶，加入左堆
	} else {
		heap.Push(this.right, num) // 大于左堆顶，加入右堆
	}

	// 2. 调整堆的平衡：保证 left.Len() == right.Len() 或 left.Len() = right.Len() + 1
	if this.left.Len() > this.right.Len()+1 {
		// 左堆过大，弹出左堆顶到右堆
		val := heap.Pop(this.left).(int)
		heap.Push(this.right, val)
	} else if this.right.Len() > this.left.Len() {
		// 右堆过大，弹出右堆顶到左堆
		val := heap.Pop(this.right).(int)
		heap.Push(this.left, val)
	}
}

// FindMedian 查询当前数据流的中位数
func (this *MedianFinder) FindMedian() float64 {
	// 总元素数为奇数：左堆顶就是中位数
	if this.left.Len() > this.right.Len() {
		return float64((*this.left)[0])
	}
	// 总元素数为偶数：(左堆顶 + 右堆顶) / 2
	return float64((*this.left)[0]+(*this.right)[0]) / 2.0
}
```

### 复杂度分析
- 时间复杂度：AddNum 操作 $O (\log n)$，FindMedian 操作 $O (1)$。
- 空间复杂度：$O(n)$，最坏情况下所有元素都在一个堆中。

---

> 作者:   
> URL: https://amemiya02.github.io/posts/2026-02-09-heap/  

