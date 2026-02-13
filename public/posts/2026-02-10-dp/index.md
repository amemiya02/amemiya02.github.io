# [Golang] LeetCode 热题 100 - 动态规划

# 动态规划


## [70. 爬楼梯 - Easy](https://leetcode-cn.com/problems/climbing-stairs/)

### 题目回顾

> 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
> 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
> 注意：给定 n 是一个正整数。

### 核心思路

1. 递推公式：
- 爬到第 n 阶的方法数 = 爬到第 n-1 阶的方法数（最后一步爬 1 阶） + 爬到第 n-2 阶的方法数（最后一步爬 2 阶）；
- 即 dp[n] = dp[n-1] + dp[n-2]；
2. 初始条件：
- dp[1] = 1（1 阶只有 1 种方法：爬 1 阶）；
- dp[2] = 2（2 阶有 2 种方法：1+1 或 2）；
3. 空间优化：无需维护完整的 dp 数组，只需用两个变量记录 dp[n-1] 和 dp[n-2]，空间复杂度从 O (n) 降到 O (1)。

### 代码实现

```go

func climbStairs(n int) int {
    // 边界条件：n=1 或 n=2 直接返回结果
    if n == 1 {
        return 1
    }
    if n == 2 {
        return 2
    }

    // 用两个变量代替dp数组，节省空间
    prevPrev := 1 // 对应dp[n-2]，初始为dp[1]
    prev := 2     // 对应dp[n-1]，初始为dp[2]
    current := 0  // 对应dp[n]

    // 从3阶开始递推到n阶
    for i := 3; i <= n; i++ {
        current = prevPrev + prev // dp[i] = dp[i-2] + dp[i-1]
        // 更新变量，为下一次循环准备
        prevPrev = prev
        prev = current
    }

    return current
}
```

### 复杂度分析

- 时间复杂度：$O (n)$，需要计算从 3 到 n 的每一阶的方法数；
- 空间复杂度：$O (1)$，只使用了常数个变量来存储状态。

## [118. 杨辉三角 - Easy](https://leetcode-cn.com/problems/pascals-triangle/)

### 题目回顾

> 给定一个非负整数 numRows，生成杨辉三角的前 numRows 行。
> 在杨辉三角中，每个数是它左上方和右上方的数的和。

### 核心思路

杨辉三角的核心规律：
1. 第 i 行（从 0 开始）有 i+1 个元素；
- 每行的第一个和最后一个元素都是 1；
- 中间元素 row[j] = 上一行[j-1] + 上一行[j]（0 < j < len(row)-1）。
2. 解题步骤：
- 初始化结果二维数组；
- 逐行生成：
- 第 0 行直接是 [1]；
- 从第 1 行开始，先初始化当前行为长度等于行号 + 1 的切片，首尾设为 1；
- 遍历中间位置，通过上一行的元素计算当前值；
- 将每行添加到结果数组中，最终返回。

### 代码实现

```go


func generate(numRows int) [][]int {
    // 初始化结果数组
    res := make([][]int, numRows)
    if numRows == 0 {
        return res
    }

    // 生成第一行（索引0）
    res[0] = []int{1}

    // 从第二行开始逐行生成（索引从1到numRows-1）
    for i := 1; i < numRows; i++ {
        // 当前行的长度为 i+1
        row := make([]int, i+1)
        // 首尾元素设为1
        row[0], row[i] = 1, 1

        // 计算中间元素：row[j] = 上一行[j-1] + 上一行[j]
        for j := 1; j < i; j++ {
            row[j] = res[i-1][j-1] + res[i-1][j]
        }

        // 将当前行加入结果数组
        res[i] = row
    }

    return res
}
```

### 复杂度分析
- 时间复杂度：$O (numRows^2)$，需要生成 numRows 行，每行最多有 numRows 个元素；
- 空间复杂度：$O (numRows^2)$，结果数组存储了 numRows 行，每行最多 numRows 个元素。

## [198. 打家劫舍 - Mid](https://leetcode-cn.com/problems/house-robber/)


### 题目回顾

> 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
> 给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。

### 核心思路

1. 状态定义：dp[i] 表示前 i 间房屋能偷窃到的最高金额；
2. 递推公式：
- 对于第 i 间房屋，有两种选择：
  - 不偷：最高金额 = dp[i-1]（前 i-1 间的最高金额）；
  - 偷：最高金额 = dp[i-2] + nums[i]（前 i-2 间的最高金额 + 当前房屋金额）；
- 因此 dp[i] = max(dp[i-1], dp[i-2] + nums[i])；
3. 空间优化：无需维护完整的 dp 数组，只需用两个变量记录 dp[i-1] 和 dp[i-2]，空间复杂度从 O (n) 降至 O (1)。


### 代码实现

```go

package main

func rob(nums []int) int {
	n := len(nums)
	// 边界条件：空数组返回0
	if n == 0 {
		return 0
	}
	// 边界条件：只有1间房屋，直接返回该房屋金额
	if n == 1 {
		return nums[0]
	}

	// 用两个变量替代dp数组，节省空间
	prevPrev := nums[0]                          // 对应dp[i-2]，初始为dp[0]
	prev := max(nums[0], nums[1])                // 对应dp[i-1]，初始为dp[1]
	current := prev                              // 初始化当前最大值

	// 从第3间房屋开始递推（索引2）
	for i := 2; i < n; i++ {
		// 递推公式：max(不偷当前房, 偷当前房)
		current = max(prev, prevPrev + nums[i])
		// 更新变量，为下一次循环准备
		prevPrev = prev
		prev = current
	}

	return current
}

// 辅助函数：返回两个整数的最大值（Go标准库无直接的int max函数）
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

```

### 复杂度分析
- 时间复杂度：$O (n)$，需要遍历一次数组；
- 空间复杂度：$O (1)$，只使用了常数个变量来存储状态。

## [279. 完全平方数 - Mid](https://leetcode-cn.com/problems/perfect-squares/)

### 题目回顾

> 给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。
> 完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。

### 核心思路

1. 状态定义：dp[i] 表示和为 i 的完全平方数的最少数量；
2. 初始条件：
- dp[0] = 0（和为 0 无需任何数）；
- 其余 dp[i] 初始化为一个较大值（如 i，因为最坏情况是用 i 个 1 相加）；
3. 递推公式：
- 对于每个 i，遍历所有小于等于 i 的完全平方数 j²，则 dp[i] = min(dp[i], dp[i-j²] + 1)；
- 含义：和为 i 的最少数量 = 「和为 i-j² 的最少数量 + 1 个 j²」的最小值。

### 代码实现

```go


func numSquares(n int) int {
    // 初始化dp数组，dp[i]表示和为i的完全平方数的最少数量
    dp := make([]int, n+1)
    // 初始化：最坏情况是用i个1相加，所以dp[i] = i
    for i := 1; i <= n; i++ {
        dp[i] = i
    }

    // 动态规划递推
    for i := 2; i <= n; i++ {
        // 遍历所有小于等于i的完全平方数j²
        for j := 1; j*j <= i; j++ {
            square := j * j
            // 状态转移：dp[i] = min(当前值, dp[i-square]+1)
            if dp[i] > dp[i-square]+1 {
                dp[i] = dp[i-square] + 1
            }
        }
    }

    return dp[n]
}
```

### 复杂度分析

- 时间复杂度：$O (n \sqrt{n})$；
- 空间复杂度：$O (n)$，dp 数组存储了从 0 到 n 的结果。

## [322. 零钱兑换 - Mid](https://leetcode-cn.com/problems/coin-change/)

### 题目回顾

> 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
> 计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
> 你可以认为每种硬币的数量是无限的。

### 核心思路

1. 状态定义：dp[i] 表示凑成金额 i 所需的最少硬币个数；
2. 初始条件：
- dp[0] = 0（凑成金额 0 无需任何硬币）；
- 其余 dp[i] 初始化为一个 “无穷大” 值（比如 amount+1，因为最多需要 amount 个 1 元硬币，超过这个值即表示无法凑出）；
3. 递推公式：
- 对于每个金额 i，遍历所有硬币面额 coin，若 coin ≤ i，则 dp[i] = min(dp[i], dp[i-coin] + 1)；
- 含义：凑成 i 的最少硬币数 = 「凑成 i-coin 的最少硬币数 + 1 枚 coin 硬币」的最小值；
4. 结果判断：若最终 dp[amount] > amount，说明无法凑出，返回 -1；否则返回 dp[amount]。

### 代码实现

```go


func coinChange(coins []int, amount int) int {
    // 初始化dp数组，dp[i]表示凑成金额i的最少硬币数
    // 初始值设为amount+1（表示"无穷大"，因为最多需要amount个1元硬币）
    dp := make([]int, amount+1)
    for i := 1; i <= amount; i++ {
        dp[i] = amount + 1
    }
    dp[0] = 0 // 金额0需要0个硬币

    // 遍历每个金额，从1到amount
    for i := 1; i <= amount; i++ {
        // 遍历所有硬币面额
        for _, coin := range coins {
            // 只有当前硬币面额≤当前金额时，才有可能用来凑数
            if coin <= i {
                // 状态转移：取"当前值"和"dp[i-coin]+1"的最小值
                if dp[i] > dp[i-coin]+1 {
                    dp[i] = dp[i-coin] + 1
                }
            }
        }
    }

    // 若dp[amount]仍大于amount，说明无法凑出，返回-1；否则返回dp[amount]
    if dp[amount] > amount {
        return -1
    }
    return dp[amount]
}

```

### 复杂度分析
- 时间复杂度：$O (amount \times m)$，其中 m 是 coins 数组的长度；
- 空间复杂度：$O (amount)$，dp 数组存储了从 0 到 amount 的结果。

## [139. 单词拆分 - Mid](https://leetcode-cn.com/problems/word-break/)

### 题目回顾

> 给你一个字符串 s 和一个字符串列表 wordDict 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 s 则返回 true。
> 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。

### 核心思路

1. 状态定义：dp[i] 表示字符串 s 的前 i 个字符（即 s[0:i]）能否被字典中的单词拼接而成；
2. 初始条件：dp[0] = true（空字符串可以被拼接，作为递推的基础）；
3. 递推逻辑：
- 遍历每个位置 i（表示前 i 个字符），再遍历每个分割点 j（0 ≤ j < i）；
- 若 dp[j] = true（前 j 个字符可拼接）且 s[j:i] 存在于字典中，则 dp[i] = true；
4. 优化：将 wordDict 转为哈希集合，使 s[j:i] 的查询时间从 O (m)（m 为字典长度）降至 O (1)。


### 代码实现

```go


func wordBreak(s string, wordDict []string) bool {
    n := len(s)
    // 1. 将字典转为哈希集合，优化查询效率
    wordSet := make(map[string]bool)
    for _, word := range wordDict {
        wordSet[word] = true
    }

    // 2. 初始化dp数组：dp[i]表示s[0:i]能否被拼接
    dp := make([]bool, n+1)
    dp[0] = true // 空字符串可拼接

    // 3. 动态规划递推
    for i := 1; i <= n; i++ {
        // 遍历所有可能的分割点j
        for j := 0; j < i; j++ {
            // 若前j个字符可拼接，且s[j:i]在字典中 → 前i个字符可拼接
            if dp[j] && wordSet[s[j:i]] {
                dp[i] = true
                break // 找到一个分割方式即可，无需继续遍历
            }
        }
    }

    return dp[n]
}
```

### 复杂度分析
- 时间复杂度：$O (n^2)$，外层循环 $O (n)$，内层循环 $O (n)$，字典查询 $O (1)$；
- 空间复杂度：$O (n + m)$，dp 数组占 $O (n)$，字典集合占 $O (m)$。

## [300. 最长递增子序列 - Mid](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

> 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
> 子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。

### 核心思路

1. 基础动态规划思路（入门首选）
- 状态定义：dp[i] 表示以 nums[i] 为结尾的最长严格递增子序列的长度；
- 初始条件：所有 dp[i] = 1（每个元素自身是长度为 1 的子序列）；
- 递推公式：对于每个 i，遍历 j < i，若 nums[j] < nums[i]，则 dp[i] = max(dp[i], dp[j]+1)；
- 结果：遍历 dp 数组取最大值。
2. 贪心 + 二分优化思路（最优解法）
- 核心思想：维护一个 “最小末尾数组”tails，tails[k] 表示长度为 k+1 的严格递增子序列的最小末尾值；
- 贪心：要让子序列尽可能长，需让末尾值尽可能小，这样后续更容易接更大的数；
- 二分：遍历每个数，用二分查找确定其在 tails 中的位置，更新 tails；
- 结果：tails 数组的长度即为最长严格递增子序列的长度。

### 代码实现

```go

func lengthOfLIS(nums []int) int {
    n := len(nums)
    if n == 0 {
        return 0
    }
    // dp[i] 表示以nums[i]结尾的最长严格递增子序列长度
    dp := make([]int, n)
    // 初始化：每个元素自身是长度为1的子序列
    for i := range dp {
        dp[i] = 1
    }
    maxLen := 1 // 至少有一个元素，初始为1

    // 递推计算dp数组
    for i := 1; i < n; i++ {
        for j := 0; j < i; j++ {
            // 严格递增，nums[j] < nums[i]
            if nums[j] < nums[i] {
                if dp[j]+1 > dp[i] {
                    dp[i] = dp[j] + 1
                }
            }
        }
        // 更新最大长度
        if dp[i] > maxLen {
            maxLen = dp[i]
        }
    }

    return maxLen
}
```

优化版


```go


func lengthOfLIS(nums []int) int {
    n := len(nums)
    if n == 0 {
        return 0
    }
    // tails：长度为k+1的严格递增子序列的最小末尾值
    tails := make([]int, 0, n)
    tails = append(tails, nums[0])

    for i := 1; i < n; i++ {
        num := nums[i]
        // 情况1：当前数大于tails最后一个元素，直接追加（子序列长度+1）
        if num > tails[len(tails)-1] {
            tails = append(tails, num)
        } else {
            // 情况2：二分查找找到第一个≥num的位置，替换为num（保持tails最小末尾特性）
            left, right := 0, len(tails)-1
            for left < right {
                mid := left + (right-left)/2
                if tails[mid] < num {
                    left = mid + 1
                } else {
                    right = mid
                }
            }
            tails[left] = num
        }
    }

    // tails的长度即为最长严格递增子序列的长度
    return len(tails)
}
```

### 复杂度分析

- 基础动态规划解法：
  - 时间复杂度：$O (n^2)$，双重循环；
  - 空间复杂度：$O (n)$，dp 数组存储了每个位置的结果。
- 贪心 + 二分优化解法：
  - 时间复杂度：$O (n \log n)$，外层循环 $O (n)$，内层二分查找 $O (\log n)$；
  - 空间复杂度：$O (n)$，tails 数组在最坏情况下可能存储所有元素。

## [152. 乘积最大子数组 - Mid](https://leetcode-cn.com/problems/maximum-product-subarray/)

### 题目回顾

> 给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。
> 测试用例的答案是一个 32-位 整数。
> 请注意，一个只包含一个元素的数组的乘积是这个元素的值。

### 核心思路

这道题的核心难点是负数的存在：负数相乘会让小值变最大值、大值变最小值，因此不能只维护 “最大乘积”，还需维护 “最小乘积”：
1. 状态定义：
- curMax：以当前元素结尾的连续子数组的最大乘积；
- curMin：以当前元素结尾的连续子数组的最小乘积；
2. 递推逻辑：
- 遍历每个元素时，先临时保存当前 curMax（避免更新后被覆盖）；
- 新的 curMax = max (当前元素，原 curMax× 当前元素，原 curMin× 当前元素)；
- 新的 curMin = min (当前元素，原 curMax× 当前元素，原 curMin× 当前元素)；
- 同时维护全局 maxProduct，记录遍历过程中的最大乘积；
3. 初始条件：curMax、curMin、maxProduct 均初始化为数组第一个元素。

### 代码实现

```go


func maxProduct(nums []int) int {
    n := len(nums)
    if n == 0 {
        return 0
    }

    // 初始化：当前最大/最小乘积、全局最大乘积均为第一个元素
    curMax := nums[0]
    curMin := nums[0]
    maxProduct := nums[0]

    // 从第二个元素开始遍历
    for i := 1; i < n; i++ {
        num := nums[i]
        // 临时保存当前curMax，避免更新curMax后影响curMin的计算
        tempMax := curMax

        // 更新当前最大乘积：三种选择→仅当前元素、当前元素×之前最大、当前元素×之前最小
        curMax = max(num, max(tempMax*num, curMin*num))
        // 更新当前最小乘积：三种选择→仅当前元素、当前元素×之前最大、当前元素×之前最小
        curMin = min(num, min(tempMax*num, curMin*num))

        // 更新全局最大乘积
        if curMax > maxProduct {
            maxProduct = curMax
        }
    }

    return maxProduct
}

// 辅助函数：返回两个整数的最大值
func max(a, b int) int {
    if a > b {
        return a
    }
    return b
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

- 时间复杂度：$O (n)$，只需遍历一次数组；
- 空间复杂度：$O (1)$，只使用了常数个变量来存储状态。

## [416. 分割等和子集 - Mid](https://leetcode-cn.com/problems/partition-equal-subset-sum/)

### 题目回顾

> 给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

### 核心思路

这道题可转化为0-1 背包问题：
1. 问题转化：
- 首先计算数组总和 sum，若 sum 为奇数，直接返回 false（无法拆分为两个和相等的子集）；
- 若 sum 为偶数，目标变为 “是否能从数组中选出若干元素，使其和等于 sum/2”（即背包容量为 target = sum/2，每个元素只能选一次）。
2. 动态规划思路：
- 状态定义：dp[j] 表示能否凑出和为 j 的子集（dp[j] = true 表示可以）；
- 初始条件：dp[0] = true（和为 0 无需选任何元素，一定可以）；
- 递推逻辑：遍历每个元素 num，从后往前遍历背包容量 j（避免重复选元素），若 j ≥ num，则 dp[j] = dp[j] || dp[j-num]（不选当前元素 或 选当前元素）；
- 结果：最终判断 dp[target] 是否为 true。

### 代码实现

```go


func canPartition(nums []int) bool {
    // 1. 计算数组总和
    sum := 0
    for _, num := range nums {
        sum += num
    }
    // 总和为奇数，无法分割为两个和相等的子集
    if sum%2 != 0 {
        return false
    }
    target := sum / 2 // 目标子集和

    // 2. 初始化dp数组：dp[j]表示能否凑出和为j的子集
    dp := make([]bool, target+1)
    dp[0] = true // 和为0一定可以凑出

    // 3. 0-1背包：遍历每个元素，从后往前更新dp
    for _, num := range nums {
        // 逆序遍历：避免同一元素被重复选取
        for j := target; j >= num; j-- {
            dp[j] = dp[j] || dp[j-num]
        }
        // 提前终止：已找到符合条件的子集，无需继续遍历
        if dp[target] {
            return true
        }
    }

    return dp[target]
}
```

### 复杂度分析

- 时间复杂度：$O (n \times target)$，其中 n 是数组长度，target 是 sum/2；
- 空间复杂度：$O (target)$，dp 数组存储了从 0 到 target 的结果。

## [32. 最长有效括号 - Hard](https://leetcode-cn.com/problems/longest-valid-parentheses/)

### 题目回顾

> 给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号 子串 的长度。
> 左右括号匹配，即每个左括号都有对应的右括号将其闭合的字符串是格式正确的，比如 "(()())"。

### 核心思路

有效括号的核心是 “匹配”，且要求子串连续，因此需要跟踪有效子串的起始位置：
1. 栈解法（入门首选）
- 核心思路：用栈记录 “未匹配括号的下标”，初始时压入 -1 作为有效子串的 “虚拟起始前一位”；
- 遍历逻辑：
  - 遇到 (：压入当前下标；
  - 遇到 )：弹出栈顶，若栈空则压入当前下标（更新虚拟起始位），否则计算当前有效长度（当前下标 - 栈顶值），更新最大值。
2. 动态规划解法（最优）
- 状态定义：dp[i] 表示以 s[i] 结尾的最长有效括号子串长度；
- 递推逻辑：
  - 仅当 s[i] = ')' 时才可能有有效子串；
  - 若 s[i-1] = '('：dp[i] = dp[i-2] + 2（直接匹配前一个左括号）；
  - 若 s[i-1] = ')' 且 s[i - dp[i-1] - 1] = '('：dp[i] = dp[i-1] + 2 + dp[i - dp[i-1] - 2]（匹配更前面的左括号，且拼接前面的有效子串）；
- 初始条件：dp 数组全初始化为 0。
### 代码实现

```go


func longestValidParentheses(s string) int {
    maxLen := 0
    // 栈：存储未匹配括号的下标，初始压入-1作为有效子串的起始前一位
    stack := []int{-1}

    for i := range s {
        if s[i] == '(' {
            // 左括号：压入当前下标
            stack = append(stack, i)
        } else {
            // 右括号：弹出栈顶（尝试匹配）
            stack = stack[:len(stack)-1]
            if len(stack) == 0 {
                // 栈空：当前右括号无匹配，压入当前下标作为新的起始前一位
                stack = append(stack, i)
            } else {
                // 计算当前有效长度，更新最大值
                currentLen := i - stack[len(stack)-1]
                if currentLen > maxLen {
                    maxLen = currentLen
                }
            }
        }
    }

    return maxLen
}
```

优化版

```go

func longestValidParentheses(s string) int {
    n := len(s)
    if n < 2 {
        return 0
    }
    maxLen := 0
    // dp[i]：以s[i]结尾的最长有效括号长度
    dp := make([]int, n)

    for i := 1; i < n; i++ {
        // 仅当当前字符是')'时，才可能有有效子串
        if s[i] == ')' {
            // 情况1：前一个字符是'('，直接匹配
            if s[i-1] == '(' {
                dp[i] = 2
                // 拼接前面的有效子串（i-2 >=0 时）
                if i-2 >= 0 {
                    dp[i] += dp[i-2]
                }
            } else if dp[i-1] > 0 {
                // 情况2：前一个字符是')'，且前一个位置有有效子串
                // 找到当前')'对应的'('的位置：i - dp[i-1] - 1
                matchIdx := i - dp[i-1] - 1
                if matchIdx >= 0 && s[matchIdx] == '(' {
                    dp[i] = dp[i-1] + 2
                    // 拼接matchIdx前面的有效子串
                    if matchIdx-1 >= 0 {
                        dp[i] += dp[matchIdx-1]
                    }
                }
            }
            // 更新最大长度
            if dp[i] > maxLen {
                maxLen = dp[i]
            }
        }
    }

    return maxLen
}
```

### 复杂度分析

- 时间复杂度：$O (n)$，只需遍历一次字符串；
- 空间复杂度：$O (n)$，栈或 dp 数组在最坏情况下可能存储所有元素。

---

> 作者:   
> URL: http://localhost:1313/posts/2026-02-10-dp/  

