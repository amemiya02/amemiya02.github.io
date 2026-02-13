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
- 时间复杂度：$O(n * n!)$，其中 n 是数组的长度。全排列的数量是 n!，每个排列需要 O(n) 的时间来构建和复制到结果中。
- 空间复杂度：$O(n)$，用于存储递归栈和路径。


## [78. 子集 - Medium](https://leetcode-cn.com/problems/subsets/)

### 题目回顾
> 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。

### 核心思路

子集问题可以看作是在一棵多叉树上收集所有节点，而排列/组合问题通常只收集叶子节点。

1. 为什么用 start 参数？
在全排列中我们使用 used 数组，因为顺序不同是不同的排列。但在子集中，[1, 2] 和 [2, 1] 是同一个集合。为了去重，我们规定搜索顺序：只选取当前元素之后的元素。

2. 拷贝的重要性
和全排列一样，res = append(res, temp) 这一步必须拷贝 path。Go 的切片底层共享数组，如果不拷贝，回溯操作会修改 res 中已经存储的内容。

### 代码实现

```go
func subsets(nums []int) [][]int {
    var res [][]int
    var path []int

    // 定义回溯函数，start 保证我们只往后看，避免重复
    var backtrack func(start int)
    backtrack = func(start int) {
        // 1. 每一个节点都是一个子集，直接加入结果集
        // 注意：必须进行深拷贝
        temp := make([]int, len(path))
        copy(temp, path)
        res = append(res, temp)

        // 2. 遍历候选列表
        for i := start; i < len(nums); i++ {
            // 做选择
            path = append(path, nums[i])
            // 递归：从当前元素的下一个开始，避免元素重复使用
            backtrack(i + 1)
            // 撤销选择（回溯）
            path = path[:len(path)-1]
        }
    }

    backtrack(0)
    return res
}
```

### 复杂度分析
- 时间复杂度：$O(n * 2^n)$，其中 n 是数组的长度。子集的数量是 2^n，每个子集需要 O(n) 的时间来构建和复制到结果中。
- 空间复杂度：$O(n)$，用于存储递归栈和路径。

## [17. 电话号码的字母组合 - Medium](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)

### 题目回顾

> 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

### 核心思路

1. 映射关系
我们建立了一个从数字字符（如 '2'）到字符串（如 "abc"）的映射。这决定了搜索每一层时的“分支数量”。

2. 决策树结构
树的深度：由输入 digits 的长度决定。

每一层的宽度：由对应数字包含的字母数量（3 或 4 个）决定。

3. 为什么不需要 used 数组？
在全排列中，我们需要 used 来防止同一个元素被多次选取。但在电话组合中，由于每一层递归处理的是不同的数字集合，我们只需要一个 index 记录当前处理到 digits 的第几个字符，天然地保证了不会重复使用同一个位置。


#### 代码实现

```go

func letterCombinations(digits string) []string {
    if len(digits) == 0 {
        return nil
    }

    // 1. 定义数字与字母的映射表
    phoneMap := map[byte]string{
        '2': "abc", '3': "def", '4': "ghi", '5': "jkl",
        '6': "mno", '7': "pqrs", '8': "tuv", '9': "wxyz",
    }

    var res []string
    var path []byte

    // 2. 定义回溯函数
    var backtrack func(index int)
    backtrack = func(index int) {
        // 终止条件：路径长度等于输入数字的长度
        if index == len(digits) {
            res = append(res, string(path))
            return
        }

        // 取出当前数字对应的所有字母
        digit := digits[index]
        letters := phoneMap[digit]

        // 遍历当前数字对应的每一个字母
        for i := 0; i < len(letters); i++ {
            // 做选择
            path = append(path, letters[i])
            // 递归：处理下一个数字
            backtrack(index + 1)
            // 撤销选择（回溯）
            path = path[:len(path)-1]
        }
    }

    backtrack(0)
    return res
}
```

### 复杂度分析
- 时间复杂度：$O(3^m * 4^n)$，其中 m 是输入数字中对应 3 个字母的数字个数，n 是对应 4 个字母的数字个数。每个组合需要 O(m + n) 的时间来构建和复制到结果中。
- 空间复杂度：$O(m + n)$，用于存储递归栈和路径。


## [39. 组合总和 - Medium](https://leetcode-cn.com/problems/combination-sum/)

### 题目回顾
> 给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。 candidates 中的 同一个 数字 可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两个组合是不同的。对于给定的输入，保证和为 target 的不同组合数量少于 150 个。



### 核心思路

核心要点解析
1. 如何实现“无限制重复选取”？
在 dfs(..., i) 这一步。

如果是 i + 1：代表每个元素只能选一次（如“子集”问题）。

如果是 i：代表在当前的决策树分支下，下一层依然可以从当前这个元素开始选，从而实现重复。

2. 为什么需要 start 变量？
为了去重。如果我们每一层都从索引 0 开始遍历，就会出现 [2, 2, 3] 和 [2, 3, 2]、[3, 2, 2] 这种由于顺序不同而产生的重复组合。通过 start 确保我们只选取“当前或之后”的元素，强制了结果集的顺序性。

3. 剪枝优化 (Pruning)
在循环中，如果发现 remain - candidates[i] < 0，由于数组是升序的，后面的 candidates[i+1] 肯定也会让结果小于 0。直接 break 掉当前循环，可以减少大量的递归调用。

### 代码实现

```go
import "sort"

func combinationSum(candidates []int, target int) [][]int {
    var res [][]int
    var path []int

    // 1. 排序是为了后续的剪枝优化
    sort.Ints(candidates)

    var backtrack func(remain int, start int)
    backtrack = func(remain int, start int) {
        // 终止条件：正好凑成目标金额
        if remain == 0 {
            temp := make([]int, len(path))
            copy(temp, path)
            res = append(res, temp)
            return
        }

        // 从 start 开始遍历，避免产生 [2, 3] 和 [3, 2] 这种重复组合
        for i := start; i < len(candidates); i++ {
            // 2. 剪枝：由于数组已排序，如果当前数字已大于剩余值，后续数字也一定大于
            if remain - candidates[i] < 0 {
                break
            }

            // 做选择
            path = append(path, candidates[i])

            // 3. 递归：关键点在于传递 i 而不是 i + 1，表示当前数字可以重复使用
            backtrack(remain - candidates[i], i)

            // 撤销选择（回溯）
            path = path[:len(path)-1]
        }
    }

    backtrack(target, 0)
    return res
}
```

### 复杂度分析
- 时间复杂度：$O(2^t)$，其中 t 是目标值 target。最坏情况下，每个数字都可以被多次选择，导致递归树的高度接近 t。
- 空间复杂度：$O(t)$，用于存储递归栈和路径。

## [22. 括号生成 - Medium](https://leetcode-cn.com/problems/generate-parentheses/)

### 题目回顾

> 给你一个整数 n ，请你生成所有由 n 对括号组成的有效括号组合。

### 核心思路

有效性剪枝

生成有效括号的核心其实只有两条“潜规则”：
1. 左括号优先：只要还没放满 $n$ 个，随时可以放左括号 (。

2. 右括号限制：右括号 ) 必须在有对应的左括号等待匹配时才能放。也就是说，当前已放的右括号数量必须严格小于左括号数量。

通过这两个简单的 if 限制，我们生成的每一条路径最终到达叶子节点时，都必然是一个完美的括号匹配字符串。

### 代码实现

```go
func generateParenthesis(n int) []string {
    var res []string
    var path []byte

    // left: 当前已使用的左括号数量
    // right: 当前已使用的右括号数量
    var backtrack func(left, right int)
    backtrack = func(left, right int) {
        // 终止条件：路径长度达到 2n
        if len(path) == 2*n {
            res = append(res, string(path))
            return
        }

        // 核心规则 1：只要左括号没用完，就可以放左括号
        if left < n {
            path = append(path, '(')
            backtrack(left+1, right)
            path = path[:len(path)-1] // 回溯
        }

        // 核心规则 2：只有当右括号数量小于左括号时，才能放右括号
        // 这样可以保证任意时刻右括号都不会比左括号多（有效性保证）
        if right < left {
            path = append(path, ')')
            backtrack(left, right+1)
            path = path[:len(path)-1] // 回溯
        }
    }

    backtrack(0, 0)
    return res
}
```

### 复杂度分析
- 时间复杂度：$O(\frac{4^n}{\sqrt{n}})$，这是生成所有有效括号组合的卡特兰数复杂度。
- 空间复杂度：$O(n)$，用于存储递归栈和路径。

## [79. 单词搜索 - Medium](https://leetcode-cn.com/problems/word-search/)

### 题目回顾
> 给定一个 m x n 二维字符网格 board 和一个字符串单词 word ，如果 word 存在于网格中，返回 true ；否则，返回 false 。单词必须按照字母顺序，通过 相邻的单元格 内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

### 核心思路


1. 状态重置 (The "Back" in Backtracking)当你访问 board[i][j] 后，必须暂时标记它。如果不标记，搜索路径可能会在同一个格子上打转（例如单词是 ABA，路径可能在两个相邻的 A 和 B 之间反复横跳）。在 DFS 返回后，必须将 board[i][j] 改回原值，确保 下一轮从不同起点开始的搜索 能够正常使用这个格子。

2. 通过 board[i][j] = '#' 这种原地修改法，将额外空间复杂度降到了 $O(1)$（不计递归栈空间）。这是面试中加分的优化技巧。

3. 短路逻辑 (Short-circuiting)在 Go 实现中，res := dfs(...) || dfs(...) || ... 利用了逻辑或的短路特性。一旦第一个 dfs 返回 true，后面的方向就不会再执行，这比显式判断 if found { return } 更加简洁高效。


### 代码实现

```go
func exist(board [][]byte, word string) bool {
    m, n := len(board), len(board[0])

    // 定义 DFS 闭包
    var dfs func(i, j, k int) bool
    dfs = func(i, j, k int) bool {
        // 1. 终止条件：匹配完单词所有字符
        if k == len(word) {
            return true
        }

        // 2. 越界检查、字符不匹配检查
        if i < 0 || i >= m || j < 0 || j >= n || board[i][j] != word[k] {
            return false
        }

        // 3. 标记当前单元格已访问（避免重复使用同一字母）
        // 这是一个地道的技巧：将其修改为一个非字母字符，省去 used 数组
        temp := board[i][j]
        board[i][j] = '#'

        // 4. 向四个方向递归探索
        // 只要有一个方向成功，就返回 true
        res := dfs(i+1, j, k+1) || dfs(i-1, j, k+1) ||
               dfs(i, j+1, k+1) || dfs(i, j-1, k+1)

        // 5. 回溯：恢复现场
        board[i][j] = temp

        return res
    }

    // 遍历起点
    for i := 0; i < m; i++ {
        for j := 0; j < n; j++ {
            if board[i][j] == word[0] {
                if dfs(i, j, 0) {
                    return true
                }
            }
        }
    }

    return false
}
```

### 复杂度分析
- 时间复杂度：$O(m * n * 3^l)$，其中 m 和 n 分别是网格的行数和列数，l 是单词的长度。每个单元格作为起点进行 DFS，最多有 3 个方向可选（因为不能回到来时的路）。
- 空间复杂度：$O(l)$，用于存储递归栈，最坏情况下递归深度为单词长度 l。