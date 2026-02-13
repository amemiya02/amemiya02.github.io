# [Golang] LeetCode 热题 100 - 贪心算法

# 贪心算法

## [121. 买卖股票的最佳时机 - Easy](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

### 题目回顾

> 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
> 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。
> 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。

### 核心思路

这道题的核心是找到 “最低买入价” 和 “该价格之后的最高卖出价”，暴力解法（双层循环找所有买卖组合）时间复杂度 O (n²) 会超时，最优的贪心思路：
1. 遍历价格数组时，维护两个变量：
- minPrice：记录遍历到当前位置时的最低买入价格；
- maxProfit：记录遍历到当前位置时能获得的最大利润；
2. 遍历过程中：
- 先更新 minPrice（取当前价格和 minPrice 的较小值）；
- 再计算当前价格卖出能获得的利润（当前价格 - minPrice），并更新 maxProfit（取当前利润和 maxProfit 的较大值）；
3. 遍历结束后，maxProfit 即为最大利润（若为负数则返回 0）。

### 代码实现

```go



func maxProfit(prices []int) int {
    // 边界条件：数组长度小于2，无法买卖，直接返回0
    if len(prices) < 2 {
        return 0
    }

    // 初始化最小价格为第一个元素，最大利润为0
    minPrice := prices[0]
    maxProfit := 0

    // 遍历从第二个元素开始的所有价格
    for i := 1; i < len(prices); i++ {
        // 1. 更新当前遇到的最低价格
        if prices[i] < minPrice {
            minPrice = prices[i]
        } else {
            // 2. 计算当前价格卖出的利润，更新最大利润
            currentProfit := prices[i] - minPrice
            if currentProfit > maxProfit {
                maxProfit = currentProfit
            }
        }
    }

    return maxProfit
}

```

### 复杂度分析
- 时间复杂度：$O(n)$，只需遍历一次价格数组。
- 空间复杂度：$O(1)$，只使用了常数级别的额外空间。

## [55. 跳跃游戏 - Medium](https://leetcode-cn.com/problems/jump-game/)

### 题目回顾

> 给你一个非负整数数组 nums ，你最初位于数组的 第一个下标 。数组中的每个元素代表你在该位置可以跳跃的最大长度。
> 判断你是否能够到达最后一个下标，如果可以，返回 true ；否则，返回 false 。

### 核心思路

这道题的核心是通过贪心策略维护 “当前能到达的最远位置”，暴力递归会超时，贪心是最优解：
1. 遍历数组时，维护变量 maxReach，表示当前能到达的最远下标；
2. 对于每个下标 i：
- 若 i 超过 maxReach，说明该位置无法到达，直接返回 false；
- 否则，更新 maxReach 为 max(maxReach, i + nums[i])（当前位置能跳到的最远位置）；
- 若 maxReach 已覆盖最后一个下标，可提前返回 true（优化）；
3. 遍历结束后，判断 maxReach 是否 ≥ 最后一个下标。

### 代码实现

```go

func canJump(nums []int) bool {
	n := len(nums)
	// 边界条件：数组只有一个元素，已在最后一个下标，直接返回true
	if n == 1 {
		return true
	}

	// maxReach：当前能到达的最远下标
	maxReach := 0
	for i := 0; i < n; i++ {
		// 若当前下标超过能到达的最远位置，说明无法继续前进，返回false
		if i > maxReach {
			return false
		}
		// 更新能到达的最远位置
		currentReach := i + nums[i]
		if currentReach > maxReach {
			maxReach = currentReach
		}
		// 提前终止：已能到达最后一个下标，无需继续遍历
		if maxReach >= n-1 {
			return true
		}
	}

	// 遍历结束仍未到达最后一个下标
	return false
}

```

### 复杂度分析
- 时间复杂度：$O(n)$，只需遍历一次数组。
- 空间复杂度：$O(1)$，只使用了常数级别的额外空间。

## [45. 跳跃游戏 II - Mid](https://leetcode-cn.com/problems/jump-game-ii/)

### 题目回顾

> 给定一个长度为 n 的 0 索引整数数组 nums。初始位置在下标 0。
> 每个元素 nums[i] 表示从索引 i 向后跳转的最大长度。换句话说，如果你在索引 i 处，你可以跳转到任意 (i + j) 处：
> - 0 <= j <= nums[i] 且
> - i + j < n
> 返回到达 n - 1 的最小跳跃次数。测试用例保证可以到达 n - 1。

### 核心思路

这道题的核心是 “每一步都选择能跳得最远的位置”，从而最小化跳跃次数，贪心思路拆解：
1. 维护三个核心变量：
- step：已跳跃的次数；
- curEnd：当前跳跃能到达的最远下标（当前步数的边界）；
- maxReach：遍历过程中能到达的全局最远下标；
2. 遍历数组（不包含最后一个元素，因为到达最后一个下标无需再跳）：
- 每次更新 maxReach 为 max(maxReach, i + nums[i])；
- 当遍历到 curEnd 时，说明需要进行一次新的跳跃：
  - step++（跳跃次数 + 1）；
  - curEnd = maxReach（更新当前步数的边界为新的最远可达位置）；
3. 遍历结束后，step 即为最小跳跃次数。

### 代码实现

```go

func jump(nums []int) int {
	n := len(nums)
	// 边界条件：数组长度为1，无需跳跃
	if n == 1 {
		return 0
	}

	step := 0       // 已跳跃次数
	curEnd := 0     // 当前跳跃能到达的最远下标（步数边界）
	maxReach := 0   // 全局最远可达下标

	// 遍历数组（不包含最后一个元素，到达最后一个下标无需再跳）
	for i := 0; i < n-1; i++ {
		// 更新全局最远可达下标
		currentReach := i + nums[i]
		if currentReach > maxReach {
			maxReach = currentReach
		}

		// 遍历到当前步数的边界，需要跳一次
		if i == curEnd {
			step++
			curEnd = maxReach // 更新下一步的边界

			// 提前终止：已能到达最后一个下标
			if curEnd >= n-1 {
				break
			}
		}
	}

	return step
}

```

### 复杂度分析
- 时间复杂度：$O(n)$，只需遍历一次数组。
- 空间复杂度：$O(1)$，只使用了常数级别的额外空间。

## [763. 划分字母区间 - Mid](https://leetcode-cn.com/problems/partition-labels/)

### 题目回顾

> 给你一个字符串 s 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 "ababcc" 能够被分为 ["abab", "cc"]，但类似 ["aba", "bcc"] 或 ["ab", "ab", "cc"] 的划分是非法的。
> 注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 s 。
> 返回一个表示每个字符串片段的长度的列表。

### 核心思路

这道题的核心是通过 “记录字母最后出现位置 + 贪心扩展片段边界” 来划分：
1. 预处理字母最后出现位置：遍历字符串，用数组 / 哈希表记录每个字符最后一次出现的下标；
2. 贪心划分片段：
- 维护两个变量：start（当前片段起始下标）、end（当前片段的最远边界）；
- 遍历字符串，每次更新 end 为 “当前字符最后出现位置” 和 “当前 end” 的较大值；
- 当遍历到 end 时，说明当前片段已到边界，记录片段长度（end - start + 1），并更新 start 为 end + 1；
3. 最终收集所有片段长度即为结果。

### 代码实现

```go


func partitionLabels(s string) []int {
	// 1. 预处理：记录每个字符最后出现的下标（小写字母共26个，用数组更高效）
	lastPos := [26]int{}
	for i := range s {
		// 转换字符为数组索引（a→0, b→1...z→25）
		lastPos[s[i]-'a'] = i
	}

	// 2. 贪心划分片段
	var res []int
	start := 0 // 当前片段起始下标
	end := 0   // 当前片段的最远边界

	for i := range s {
		// 更新当前片段的最远边界
		if lastPos[s[i]-'a'] > end {
			end = lastPos[s[i]-'a']
		}
		// 遍历到片段边界，记录长度并更新起始位置
		if i == end {
			res = append(res, end-start+1)
			start = end + 1
		}
	}

	return res
}

```

### 复杂度分析

- 时间复杂度：$O(n)$，其中 $n$ 是字符串长度。预处理和划分片段都需要遍历字符串一次。
- 空间复杂度：$O(1)$，因为字符集固定为小写字母，使用了常数级别的额外空间。


---

> 作者:   
> URL: http://localhost:1313/posts/2026-02-10-greedy/  

