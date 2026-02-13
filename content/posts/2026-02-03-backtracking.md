---
title: "[Golang] LeetCode 热题 100 - 回溯"
date: 2026-02-03 9:01:00 +0900
categories: [算法, LeetCode]
tags: [Go, 回溯, 题解]
---
# 回溯

## [46. 全排列 - Medium](https://leetcode-cn.com/problems/permutations/)

### 题目回顾
> 给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

### 核心思路

回溯算法可以抽象为一个决策树的遍历过程：

1. 路径与选择列表
路径 (Path)：已经做出的选择（代码中的 path）。

选择列表 (Used)：当前还可以做的选择（代码中的 !used[i]）。

2. 终止条件
当到达叶子节点（len(path) == len(nums)），说明找到了一组完整的排列。

3. 撤销选择 (Backtrack)
这是最关键的一步。在递归返回后，我们需要把最后加入 path 的元素弹出，并将 used 标记改回 false。这就像是在走迷宫时，发现死胡同后退回到上一个分叉口。


### 代码实现

```go
func permute(nums []int) [][]int {
    var res [][]int
    path := []int{}
    used := make([]bool, len(nums))

    var backtrack func()
    backtrack = func() {
        // 终止条件：路径长度等于数组长度
        if len(path) == len(nums) {
            // 注意：Go 中切片是引用传递，必须进行拷贝
            temp := make([]int, len(path))
            copy(temp, path)
            res = append(res, temp)
            return
        }

        for i := 0; i < len(nums); i++ {
            // 如果该数字已经用过，跳过
            if used[i] {
                continue
            }

            // 1. 做选择
            used[i] = true
            path = append(path, nums[i])

            // 2. 递归进入下一层
            backtrack()

            // 3. 撤销选择（回溯）
            path = path[:len(path)-1]
            used[i] = false
        }
    }

    backtrack()
    return res
}
```

### 复杂度分析
- 时间复杂度：O(n * n!)，其中 n 是数组的长度。全排列的数量是 n!，每个排列需要 O(n) 的时间来构建和复制到结果中。
- 空间复杂度：O(n)，用于存储递归栈和路径。