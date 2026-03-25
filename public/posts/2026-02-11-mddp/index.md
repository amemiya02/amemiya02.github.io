# [Golang] LeetCode 热题 100 - 多维动态规划

# 多维动态规划

## [62. 不同路径 - Mid](https://leetcode.cn/problems/unique-paths/)


### 题目回顾

> 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
> 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
> 问总共有多少条不同的路径？

### 核心思路

机器人只能向下 / 向右移动，因此到达网格中 (i,j) 位置的路径数 = 到达上方 (i-1,j) 的路径数 + 到达左方 (i,j-1) 的路径数（核心递推关系）：
1. 基础动态规划思路：
- 状态定义：dp[i][j] 表示到达 (i,j) 位置的不同路径数；
- 初始条件：第一行所有位置 dp[0][j] = 1（只能从左向右走），第一列所有位置 dp[i][0] = 1（只能从上向下走）；
- 递推公式：dp[i][j] = dp[i-1][j] + dp[i][j-1]（从上方或左方到达当前位置）。
2. 空间优化思路：
- 观察到 dp[i][j] 仅依赖「上一行的 dp[i-1][j]」和「当前行的 dp[i][j-1]」，因此无需维护二维数组，只需用一维数组 dp[j] 替代；
- 初始：dp[j] = 1（对应第一行）；
- 递推：遍历每行时，dp[j] = dp[j]（上一行的 j 位置） + dp[j-1]（当前行的 j-1 位置）。

### 代码实现

```go


func uniquePaths(m int, n int) int {
    // 初始化二维dp数组：dp[i][j]表示到达(i,j)的路径数
    dp := make([][]int, m)
    for i := range dp {
        dp[i] = make([]int, n)
        dp[i][0] = 1 // 第一列所有位置路径数为1
    }
    // 第一行所有位置路径数为1
    for j := 0; j < n; j++ {
        dp[0][j] = 1
    }

    // 递推计算其余位置
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
        }
    }

    return dp[m-1][n-1]
}
```

### 复杂度分析
- 时间复杂度：$O(m*n)$，需要填充整个 dp 数组。
- 空间复杂度：$O(m*n)$，需要一个二维数组存储路径数。


## [64. 最小路径和 - Mid](https://leetcode.cn/problems/minimum-path-sum/)

### 题目回顾

> 给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
> 说明：每次只能向下或者向右移动一步。
### 核心思路

与 “不同路径” 问题核心逻辑一致（仅能向下 / 向右移动），但目标从 “统计路径数” 变为 “找最小路径和”，递推关系调整为 “取上方 / 左方的最小路径和 + 当前格子值”：
1. 基础二维动态规划思路：
- 状态定义：dp[i][j] 表示到达 (i,j) 位置的最小路径和；
- 初始条件：
  - 第一行：dp[0][j] = dp[0][j-1] + grid[0][j]（只能从左向右走，累加前一个位置的最小和）；
  - 第一列：dp[i][0] = dp[i-1][0] + grid[i][0]（只能从上向下走，累加前一个位置的最小和）；
- 递推公式：dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]（选上方 / 左方更小的路径和，加上当前格子值）。
2. 空间优化思路：
- 观察到 dp[i][j] 仅依赖「上一行的 dp[i-1][j]」和「当前行的 dp[i][j-1]」，无需维护二维数组，仅用一维数组 dp[j] 即可；
- 初始：dp[j] 累加第一行的和（对应第一行的最小路径和）；
- 递推：遍历每行时，dp[j] = min(dp[j]（上一行 j 位置）, dp[j-1]（当前行 j-1 位置）) + grid[i][j]。


### 代码实现

```go


func minPathSum(grid [][]int) int {
    m := len(grid)
    if m == 0 {
        return 0
    }
    n := len(grid[0])
    if n == 0 {
        return 0
    }

    // 初始化二维dp数组：dp[i][j]表示到达(i,j)的最小路径和
    dp := make([][]int, m)
    for i := range dp {
        dp[i] = make([]int, n)
    }

    // 初始化起点
    dp[0][0] = grid[0][0]

    // 初始化第一列（只能从上向下走）
    for i := 1; i < m; i++ {
        dp[i][0] = dp[i-1][0] + grid[i][0]
    }

    // 初始化第一行（只能从左向右走）
    for j := 1; j < n; j++ {
        dp[0][j] = dp[0][j-1] + grid[0][j]
    }

    // 递推计算其余位置的最小路径和
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            // 选上方或左方中更小的路径和，加上当前格子值
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
        }
    }

    return dp[m-1][n-1]
}

// 辅助函数：返回两个整数的最小值
func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}
```

### 复杂度分析
- 时间复杂度：$O(m*n)$，需要填充整个 dp 数组。
- 空间复杂度：$O(m*n)$，需要一个二维数组存储最小路径和。

## [5. 最长回文子串 - Mid](https://leetcode.cn/problems/longest-palindromic-substring/)

### 题目回顾
> 给你一个字符串 s，找到 s 中最长的回文子串。

### 核心思路

1. 状态定义：dp[i][j] 表示字符串 s 中从下标 i 到 j 的子串是否为回文；
2. 初始条件：
- dp[i][i] = true（单个字符一定是回文）；
- dp[i][i+1] = (s[i] == s[i+1])（两个字符需相等才是回文）；
3. 递推公式：dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1]（首尾字符相等，且中间子串也是回文）；
4. 遍历顺序：按子串长度从短到长遍历（长回文依赖短回文的结果）。

### 代码实现

```go

func longestPalindrome(s string) string {
    n := len(s)
    if n < 2 {
        return s
    }

    // dp[i][j]：s[i..j]是否为回文子串
    dp := make([][]bool, n)
    for i := range dp {
        dp[i] = make([]bool, n)
        dp[i][i] = true // 单个字符是回文
    }

    start, maxLen := 0, 1 // 初始最长回文是第一个字符

    // 按子串长度遍历（从2到n）
    for length := 2; length <= n; length++ {
        // 遍历所有起始下标i
        for i := 0; i + length <= n; i++ {
            j := i + length - 1 // 子串结束下标
            if s[i] != s[j] {
                dp[i][j] = false
            } else {
                // 子串长度为2时，无需检查中间（没有中间字符）
                if length == 2 {
                    dp[i][j] = true
                } else {
                    dp[i][j] = dp[i+1][j-1]
                }
            }

            // 更新最长回文信息
            if dp[i][j] && length > maxLen {
                maxLen = length
                start = i
            }
        }
    }

    return s[start : start+maxLen]
}
```

### 复杂度分析
- 时间复杂度：$O(n^2)$，需要填充整个 dp 数组。
- 空间复杂度：$O(n^2)$，需要一个二维数组存储回文状态。

## [1143. 最长公共子序列 - Mid](https://leetcode.cn/problems/longest-common-subsequence/)

### 题目回顾

> 给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。
> 一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
> 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。

### 核心思路

最长公共子序列（LCS）是经典动态规划问题，核心逻辑是 “字符匹配则累加长度，不匹配则取两种删除方式的最大值”：
1. 基础二维动态规划思路：
- 状态定义：dp[i][j] 表示 text1 前 i 个字符（text1[0:i-1]）和 text2 前 j 个字符（text2[0:j-1]）的最长公共子序列长度；
- 初始条件：dp[0][j] = 0（text1 为空）、dp[i][0] = 0（text2 为空），空字符串与任何字符串的公共子序列长度为 0；
- 递推公式：
  - 若 text1[i-1] == text2[j-1]（当前字符匹配）：dp[i][j] = dp[i-1][j-1] + 1；
  - 若不匹配：dp[i][j] = max(dp[i-1][j], dp[i][j-1])（取 “删 text1 第 i 个字符” 或 “删 text2 第 j 个字符” 的最大 LCS 长度）。
2. 空间优化思路：
- 观察到 dp[i][j] 仅依赖 dp[i-1][j-1]、dp[i-1][j]、dp[i][j-1]，无需维护二维数组，仅用一维数组 dp[j] 即可；
- 遍历 text1 时，从后往前遍历 text2（避免覆盖未计算的 dp[j-1]），并用临时变量保存 dp[i-1][j-1]。

### 代码实现

```go

func longestCommonSubsequence(text1 string, text2 string) int {
    m, n := len(text1), len(text2)
    // dp[i][j]：text1前i个字符 & text2前j个字符的LCS长度
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
    }

    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            // 当前字符匹配，LCS长度+1
            if text1[i-1] == text2[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1
            } else {
                // 不匹配，取“删text1第i个”或“删text2第j个”的最大值
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            }
        }
    }

    return dp[m][n]
}

// 辅助函数：返回两个整数的最大值
func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}
```

### 复杂度分析
- 时间复杂度：$O(m*n)$，需要填充整个 dp 数组。
- 空间复杂度：$O(m*n)$，需要一个二维数组存储 LCS 长度。

## [72. 编辑距离 - Mid](https://leetcode.cn/problems/edit-distance/)

### 题目回顾

> 给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数  。
>
> 你可以对一个单词进行如下三种操作：
>
> 插入一个字符
> 删除一个字符
> 替换一个字符

### 核心思路

编辑距离是经典动态规划问题，核心逻辑是 “字符匹配则无需操作，不匹配则取插入 / 删除 / 替换的最小操作数 + 1”：
1. 状态定义：
- dp[i][j] 表示将 word1 前 i 个字符（word1[0:i-1]）转换为 word2 前 j 个字符（word2[0:j-1]）的最少操作数；
2. 初始条件：
- dp[i][0] = i：将 word1 前 i 个字符转为空串，需要删除 i 次；
- dp[0][j] = j：将空串转为 word2 前 j 个字符，需要插入 j 次；
3. 递推公式：
- 若 word1[i-1] == word2[j-1]（当前字符匹配）：dp[i][j] = dp[i-1][j-1]（无需任何操作）；
- 若不匹配：dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1，其中：
  - dp[i-1][j]：删除 word1 的第 i 个字符；
  - dp[i][j-1]：向 word1 插入一个字符（匹配 word2 的第 j 个字符）；
  - dp[i-1][j-1]：将 word1 的第 i 个字符替换为 word2 的第 j 个字符。

### 代码实现

```go


func minDistance(word1 string, word2 string) int {
    m, n := len(word1), len(word2)
    // dp[i][j]：word1前i个字符 → word2前j个字符的最少操作数
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
        dp[i][0] = i // 初始条件：转空串需要删除i次
    }
    // 初始条件：空串转word2前j个字符需要插入j次
    for j := 0; j <= n; j++ {
        dp[0][j] = j
    }

    // 递推计算所有dp[i][j]
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if word1[i-1] == word2[j-1] {
                // 字符匹配，无需操作，继承上一个状态
                dp[i][j] = dp[i-1][j-1]
            } else {
                // 不匹配，取插入/删除/替换的最小值+1
                dp[i][j] = minThree(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
            }
        }
    }

    return dp[m][n]
}

// 辅助函数：返回三个整数的最小值
func minThree(a, b, c int) int {
    return min(min(a, b), c)
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}
```

### 复杂度分析
- 时间复杂度：$O(m*n)$，需要填充整个 dp 数组。
- 空间复杂度：$O(m*n)$，需要一个二维数组存储最少操作数。


---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-02-11-mddp/  

