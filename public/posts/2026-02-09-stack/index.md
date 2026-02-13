# [Golang] LeetCode 热题 100 - 栈

# 栈

## [20. 有效的括号 - Easy](https://leetcode-cn.com/problems/valid-parentheses/)

### 题目回顾

> 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
> 有效字符串需满足：
> 左括号必须用相同类型的右括号闭合。
> 左括号必须以正确的顺序闭合。
> 每个右括号都有一个对应的相同类型的左括号。

### 核心思路

这道题的核心是利用栈的 “后进先出” 特性验证括号的匹配性：
1. 遍历字符串，遇到左括号（(/{/[）时入栈；
2. 遇到右括号（)/}/]）时，检查栈是否为空（为空则无匹配的左括号，直接返回 false），再弹出栈顶元素，判断是否与当前右括号匹配；
3. 若不匹配则返回 false，遍历结束后检查栈是否为空（不为空说明有未匹配的左括号）。

### 代码实现

```go


func isValid(s string) bool {
    // 用切片模拟栈，存储左括号（rune 兼容 Unicode，等价于 char）
    stack := []rune{}

    // 遍历字符串中的每个字符
    for _, c := range s {
        switch c {
        // 左括号：入栈
        case '(', '{', '[':
            stack = append(stack, c)
        // 右括号：匹配检查
        case ')':
            // 栈为空 或 栈顶不是对应的左括号，返回false
            if len(stack) == 0 || stack[len(stack)-1] != '(' {
                return false
            }
            // 匹配成功，弹出栈顶（切片截断）
            stack = stack[:len(stack)-1]
        case ']':
            if len(stack) == 0 || stack[len(stack)-1] != '[' {
                return false
            }
            stack = stack[:len(stack)-1]
        case '}':
            if len(stack) == 0 || stack[len(stack)-1] != '{' {
                return false
            }
            stack = stack[:len(stack)-1]
        }
    }

    // 遍历结束后栈必须为空（无剩余左括号）
    return len(stack) == 0
}
```

### 复杂度分析
- 时间复杂度：$O(n)$，其中 $n$ 是字符串的长度。每个字符被访问一次，入栈和出栈操作都是 $O(1)$。
- 空间复杂度：$O(n)$，在最坏情况下（例如所有都是左括号）栈中会存储所有字符。

## [155. 最小栈 - Easy](https://leetcode-cn.com/problems/min-stack/)

> 这道题要求实现一个能在常数时间 O(1) 内获取最小值的栈，核心思路是双栈法：
- 主栈：存储所有入栈的元素，实现常规的 push/pop/top 操作；
- 辅助栈：存储当前主栈中的最小值，遵循以下规则：
- push 时：若辅助栈为空，或新元素 ≤ 辅助栈栈顶，新元素入辅助栈；
- pop 时：若弹出的元素等于辅助栈栈顶，辅助栈也弹出栈顶；
- getMin 时：直接返回辅助栈栈顶元素（即当前最小值）。

### 代码实现

```go

// MinStack 定义最小栈结构体
type MinStack struct {
    stack  []int // 主栈：存储所有元素
    helper []int // 辅助栈：存储当前最小值
}

// Constructor 初始化最小栈（LeetCode 会调用此方法）
func Constructor() MinStack {
    return MinStack{
        stack:  make([]int, 0),
        helper: make([]int, 0),
    }
}

// Push 入栈操作
func (this *MinStack) Push(val int) {
    // 主栈始终入栈
    this.stack = append(this.stack, val)
    // 辅助栈：为空 或 新值≤栈顶，才入栈
    if len(this.helper) == 0 || val <= this.helper[len(this.helper)-1] {
        this.helper = append(this.helper, val)
    }
}

// Pop 出栈操作
func (this *MinStack) Pop() {
    // 主栈为空时直接返回（防御性编程）
    if len(this.stack) == 0 {
        return
    }
    // 弹出主栈栈顶元素
    top := this.stack[len(this.stack)-1]
    this.stack = this.stack[:len(this.stack)-1]
    // 若弹出的是当前最小值，辅助栈也弹出
    if top == this.helper[len(this.helper)-1] {
        this.helper = this.helper[:len(this.helper)-1]
    }
}

// Top 获取栈顶元素
func (this *MinStack) Top() int {
    // 题目保证调用 Top 时栈非空，此处可省略判空
    return this.stack[len(this.stack)-1]
}

// GetMin 获取当前栈中的最小值
func (this *MinStack) GetMin() int {
    // 题目保证调用 GetMin 时栈非空，此处可省略判空
    return this.helper[len(this.helper)-1]
}

```

### 复杂度分析
- 时间复杂度：所有操作（Push、Pop、Top、GetMin）均为 $O(1)$。
- 空间复杂度：$O(n)$，其中 $n$ 是主栈中的元素数量。在最坏情况下（例如所有元素都相同且是最小值）辅助栈也会存储所有元素。


## [394. 字符串解码 - Medium](https://leetcode-cn.com/problems/decode-string/)

### 题目回顾

> 给定一个经过编码的字符串，返回它解码后的字符串。
> 编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。
> 你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。
> 此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。
> 测试用例保证输出的长度不会超过 105。

### 核心思路

编码字符串的核心特点是嵌套结构（比如 3[a2[bc]]），因此需要用栈来处理层级关系：
1. 数字栈：存储当前层级的重复次数 k；
2. 字符串栈：存储当前层级未处理的前缀字符串；
3. 遍历字符串时分三种情况处理：
- 遇到数字：拼接完整数字（处理多位数，如 123 [abc]）；
- 遇到左括号 [：将当前数字和前缀字符串分别入栈，然后重置临时变量；
- 遇到右括号 ]：弹出数字栈的重复次数 k 和字符串栈的前缀，将当前字符串重复 k 次后拼接到前缀后；
- 遇到普通字符：直接拼接到当前临时字符串。

### 代码实现

```go

import (
	"strconv"
	"strings"
)

func decodeString(s string) string {
	// 数字栈：存储每一层的重复次数
	numStack := []int{}
	// 字符串栈：存储每一层的前缀字符串
	strStack := []string{}
	// 当前拼接的数字（处理多位数，如 123）
	curNum := 0
	// 当前拼接的字符串
	curStr := ""

	// 遍历每个字符
	for _, c := range s {
		switch {
		// 情况1：遇到数字，拼接完整数字
		case c >= '0' && c <= '9':
			// 转换为整数，处理多位数（如 "123" → 1*100 + 2*10 + 3）
			num, _ := strconv.Atoi(string(c))
			curNum = curNum*10 + num

		// 情况2：遇到左括号，入栈并重置临时变量
		case c == '[':
			numStack = append(numStack, curNum)
			strStack = append(strStack, curStr)
			curNum = 0 // 重置数字
			curStr = "" // 重置字符串

		// 情况3：遇到右括号，拼接重复字符串
		case c == ']':
			// 弹出当前层的重复次数和前缀字符串
			repeat := numStack[len(numStack)-1]
			numStack = numStack[:len(numStack)-1]
			prevStr := strStack[len(strStack)-1]
			strStack = strStack[:len(strStack)-1]

			// 将当前字符串重复 repeat 次，拼接到前缀后
			curStr = prevStr + strings.Repeat(curStr, repeat)

		// 情况4：普通字符，直接拼接
		default:
			curStr += string(c)
		}
	}

	return curStr
}
```

### 复杂度分析
- 时间复杂度：$O(n \cdot k)$，其中 $n$ 是输入字符串的长度，$k$ 是重复次数的平均值。最坏情况下（例如 "100[a]"）需要重复字符串 100 次。
- 空间复杂度：$O(n)$，主要用于栈的存储和最终解码字符串的空间。

## [739. 每日温度 - Medium](https://leetcode-cn.com/problems/daily-temperatures/)

### 题目回顾

> 给定一个整数数组 temperatures，表示每天的温度，返回一个数组 answer，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。

### 核心思路

这道题的核心是找到每个元素右侧第一个更大的元素的索引差，暴力解法（双层循环）时间复杂度 O (n²) 会超时，最优解法是单调栈：
1. 单调栈：存储数组索引，保证栈内索引对应的温度单调递减；
2. 遍历温度数组时，对于当前索引 i：
- 若栈不为空且当前温度 > 栈顶索引对应的温度：弹出栈顶索引 top，计算 i - top 即为 top 位置的答案；
- 重复上述步骤直到栈为空或当前温度 ≤ 栈顶温度；
- 将当前索引 i 入栈；
3. 遍历结束后，栈内剩余索引的答案均为 0（无更高温度）。


### 代码实现

```go


func dailyTemperatures(temperatures []int) []int {
	n := len(temperatures)
	// 初始化答案数组，默认值为0
	answer := make([]int, n)
	// 单调栈：存储温度数组的索引，保证栈内索引对应温度单调递减
	stack := []int{}

	// 遍历每个温度
	for i := 0; i < n; i++ {
		// 栈不为空 且 当前温度 > 栈顶索引对应的温度 → 找到更高温度
		for len(stack) > 0 && temperatures[i] > temperatures[stack[len(stack)-1]] {
			// 弹出栈顶索引
			top := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			// 计算天数差
			answer[top] = i - top
		}
		// 当前索引入栈
		stack = append(stack, i)
	}

	return answer
}
```

### 复杂度分析
- 时间复杂度：$O(n)$，每个元素最多被入栈和出栈一次。
- 空间复杂度：$O(n)$，最坏情况下（例如单调递减的温度数组）栈中会存储所有索引。


## [84. 柱状图中最大的矩形 - Hard](https://leetcode-cn.com/problems/largest-rectangle-in-histogram/)

### 题目回顾

> 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。
> 求在该柱状图中，能够勾勒出来的矩形的最大面积。

### 核心思路

这道题的核心是找到每个柱子作为高度时，能向左右延伸的最大宽度（即左右第一个比它矮的柱子的位置），面积 = 高度 × 宽度。暴力解法（遍历每个柱子找左右边界）时间复杂度 O (n²) 会超时，单调栈是最优解：
1. 单调递增栈：存储柱子索引，保证栈内索引对应的高度单调递增；
2. 遍历每个柱子时，若当前高度 < 栈顶高度，说明找到了栈顶柱子的右边界（当前索引），左边界是新的栈顶索引（栈空则为 -1）；
3. 计算栈顶柱子的面积，弹出栈顶，重复此过程直到栈空或当前高度 ≥ 栈顶高度；
4. 遍历结束后，处理栈中剩余元素（右边界为数组长度）；
5. 为简化边界处理，可在原数组末尾添加一个高度为 0 的 “哨兵” 柱子，确保所有元素都能被处理。

### 代码实现

```go


func largestRectangleArea(heights []int) int {
	// 1. 复制原数组并添加哨兵（高度0），简化边界处理
	newHeights := make([]int, len(heights)+1)
	copy(newHeights, heights)
	newHeights[len(heights)] = 0 // 哨兵

	// 2. 初始化单调栈（存储索引）和最大面积
	stack := []int{}
	maxArea := 0

	// 3. 遍历所有柱子（含哨兵）
	for i := 0; i < len(newHeights); i++ {
		// 栈不为空 且 当前高度 < 栈顶索引的高度 → 计算栈顶柱子的面积
		for len(stack) > 0 && newHeights[i] < newHeights[stack[len(stack)-1]] {
			// 弹出栈顶索引（当前要计算的柱子）
			top := stack[len(stack)-1]
			stack = stack[:len(stack)-1]

			// 计算宽度：左边界是新栈顶（栈空则为-1），右边界是当前索引i
			width := i
			if len(stack) > 0 {
				width = i - stack[len(stack)-1] - 1
			}

			// 计算面积并更新最大面积
			area := newHeights[top] * width
			if area > maxArea {
				maxArea = area
			}
		}
		// 当前索引入栈（保持栈单调递增）
		stack = append(stack, i)
	}

	return maxArea
}
```

### 复杂度分析
- 时间复杂度：$O(n)$，每个元素最多被入栈和出栈一次。
- 空间复杂度：$O(n)$，最坏情况下（例如单调递增的柱子数组）栈中会存储所有索引。



---

> 作者:   
> URL: https://amemiya02.github.io/posts/2026-02-09-stack/  

