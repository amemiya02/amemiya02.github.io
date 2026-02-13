---
title: "[Golang] LeetCode 热题 100 - 二叉树"
date: 2026-01-31 9:00:00 +0900
categories: [算法, LeetCode]
tags: [Go, 二叉树, 题解]
---
# 二叉树

## [94. 二叉树的中序遍历 - Easy](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

### 题目回顾

> 给定一个二叉树的根节点 `root` ，返回它的 **中序** 遍历。

### 核心思路

递归或者迭代

### 代码实现

```go

/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val int
 * Left *TreeNode
 * Right *TreeNode
 * }
 */
func inorderTraversal(root *TreeNode) []int {
    res := []int{}
    stack := []*TreeNode{}
    curr := root

    for curr != nil || len(stack) > 0 {
        // 1. 一路向左，把所有左孩子入栈
        for curr != nil {
            stack = append(stack, curr)
            curr = curr.Left
        }

        // 2. 弹出栈顶（当前最左的节点）
        curr = stack[len(stack)-1]
        stack = stack[:len(stack)-1]

        // 3. 记录结果
        res = append(res, curr.Val)

        // 4. 转向右子树
        curr = curr.Right
    }

    return res
}

```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(H)$，其中 H 是二叉树的高度。


## [104. 二叉树的最大深度 - Easy](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

### 题目回顾
> 给定一个二叉树，找出其最大深度。


### 核心思路
递归求解

递归过程详解
触底：递归会一直深入到叶子节点的左右孩子（即 nil），此时返回 0。

回溯：

叶子节点的深度：max(0, 0) + 1 = 1。

父节点的深度：max(左子树深度, 右子树深度) + 1。

总结：每一层都将结果向上汇报，直到根节点。

虽然递归（DFS）最简洁，但在面试中，面试官有时会问：“如果这棵树非常深，导致栈溢出怎么办？” 这时可以使用 BFS（广度优先搜索），通过队列按层统计。

### 代码实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val int
 * Left *TreeNode
 * Right *TreeNode
 * }
 */
func maxDepth(root *TreeNode) int {
    // 基准情况：如果节点为空，深度为 0
    if root == nil {
        return 0
    }

    // 递归计算左子树深度
    leftHeight := maxDepth(root.Left)
    // 递归计算右子树深度
    rightHeight := maxDepth(root.Right)

    // 返回左右子树中的最大值 + 1（当前层）
    if leftHeight > rightHeight {
        return leftHeight + 1
    }
    return rightHeight + 1
}
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(H)$，其中 H 是二叉树的高度。递归调用栈的最大深度为 H。

## [226. 翻转二叉树 - Easy](https://leetcode.cn/problems/invert-binary-tree/)

### 题目回顾
> 给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。

### 核心思路
递归交换每个节点的左右子节点

翻转二叉树的本质是：遍历每一个节点，并交换其左右孩子。

为什么这个解法有效？
递归分解：我们要翻转以 root 为根的树，其实就是先把它的左右子树分别翻转好，然后再把翻转后的左子树接到右边，翻转后的右子树接到左边。

多重赋值：Go 的 a, b = b, a 特性在这里非常强大。它会先计算等号右边的两个递归调用（即先处理好子问题），然后再一次性赋值给左边的 root.Left 和 root.Right。
### 代码实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val int
 * Left *TreeNode
 * Right *TreeNode
 * }
 */
func invertTree(root *TreeNode) *TreeNode {
    // 基准情况：如果是空节点，直接返回
    if root == nil {
        return nil
    }

    // 递归地翻转左右子树
    // 在 Go 中，我们可以直接在一行内交换两个指针
    root.Left, root.Right = invertTree(root.Right), invertTree(root.Left)

    return root
}
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(H)$，其中 H 是二叉树的高度。递归调用栈的最大深度为 H。

## [101. 对称二叉树 - Easy](https://leetcode.cn/problems/symmetric-tree/)

### 题目回顾
> 给你一个二叉树的根节点 `root` ， 检查它是否是镜像对称的。
### 核心思路
判断对称并不是简单地看左右节点是否相等，而是要像“照镜子”一样进行外侧与外侧、内侧与内侧的比较。

递归判断的三个条件：
节点状态：左节点和右节点必须同时存在或同时为空。

数值相等：如果都存在，它们的值必须相等。

镜像递归：

Left.Left 对比 Right.Right

Left.Right 对比 Right.Left

### 代码实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val int
 * Left *TreeNode
 * Right *TreeNode
 * }
 */
func isSymmetric(root *TreeNode) bool {
    // 根节点为空是对称的
    if root == nil {
        return true
    }
    // 检查左子树和右子树是否镜像对称
    return check(root.Left, root.Right)
}

func check(p, q *TreeNode) bool {
    // 1. 如果都为空，是对称的
    if p == nil && q == nil {
        return true
    }
    // 2. 如果只有一个为空，或者值不相等，则不对称
    if p == nil || q == nil || p.Val != q.Val {
        return false
    }
    // 3. 递归比较：
    // p 的左子树 必须等于 q 的右子树 (外侧比较)
    // p 的右子树 必须等于 q 的左子树 (内侧比较)
    return check(p.Left, q.Right) && check(p.Right, q.Left)
}
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(H)$，其中 H 是二叉树的高度。递归调用栈的最大深度为 H。

## [543. 二叉树的直径 - Easy](https://leetcode.cn/problems/diameter-of-binary-tree/)

### 题目回顾
> 给定一棵二叉树的根节点 `root` ，返回该树的 直径 。
> 二叉树的 直径 是指任意两个节点
> 之间路径长度中的最大值。这条路径可能穿过也可能不穿过根节点。


### 核心思路
我们可以通过计算每个节点的左右子树深度之和来更新最大直径。

1. 深度与直径的关系深度 (Depth)：从当前节点到最远叶子节点的节点数（或边数）。在上面的代码中，我们定义 nil 为 0，叶子节点深度为1。直径 (Diameter)：对于节点 u，经过它的最长路径长度等于 height(u.left) + height(u.right)。

2. 为什么在计算深度的同时更新？如果我们先求深度再算直径，时间复杂度会变成 $O(n^2)$。通过在递归后序遍历（Bottom-up）时顺便记录 left + right，我们只需要 一次遍历 就能得到结果。

### 代码实现
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val int
 * Left *TreeNode
 * Right *TreeNode
 * }
 */
func diameterOfBinaryTree(root *TreeNode) int {
    ans := 0

    // 定义辅助函数计算深度
    var depth func(*TreeNode) int
    depth = func(node *TreeNode) int {
        if node == nil {
            return 0
        }

        // 递归计算左右子树的深度
        left := depth(node.Left)
        right := depth(node.Right)

        // 更新全局最大直径：左子树深度 + 右子树深度
        if left + right > ans {
            ans = left + right
        }

        // 返回该节点的深度，供父节点使用
        if left > right {
            return left + 1
        }
        return right + 1
    }

    depth(root)
    return ans
}
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(H)$，其中 H 是二叉树的高度。递归调用栈的最大深度为 H。

## [102. 二叉树的层序遍历 - Medium](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

### 题目回顾
> 给你二叉树的根节点 `root` ，返回其节点值的 **层序遍历** 。 （即逐层地，从左到右访问所有节点）。
### 核心思路

队列驱动的 BFS

层序遍历的核心在于先进先出 (FIFO)。我们使用队列来保证每一层都被顺序处理。

为什么用 levelSize？
在进入内层 for 循环之前，队列中正好包含了且仅包含了当前层的所有节点。通过固定 levelSize := len(queue)，我们可以确保只处理属于该层的节点，而新加入队列的孩子节点（属于下一层）则会在下一次外层循环中被处理。

### 代码实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val int
 * Left *TreeNode
 * Right *TreeNode
 * }
 */
func levelOrder(root *TreeNode) [][]int {
    var res [][]int
    if root == nil {
        return res
    }

    // 使用切片模拟队列
    queue := []*TreeNode{root}

    for len(queue) > 0 {
        // 关键点：获取当前层的节点数量
        levelSize := len(queue)
        // 用于存储当前层节点值的切片
        currentLevel := make([]int, 0, levelSize)

        // 遍历当前层的所有节点
        for i := 0; i < levelSize; i++ {
            // 出队：取出第一个元素
            node := queue[0]
            queue = queue[1:]

            // 记录当前节点的值
            currentLevel = append(currentLevel, node.Val)

            // 将下一层的节点加入队列
            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
        }

        // 将当前层的结果加入最终结果集
        res = append(res, currentLevel)
    }

    return res
}
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数
- 空间复杂度：$O(N)$，最坏情况下队列中会存储整棵树的一层节点（例如完全二叉树的最后一层）。


## [108. 将有序数组转换为二叉搜索树 - Easy](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

### 题目回顾

> 给你一个整数数组 `nums` ，其中元素已经按 **升序** 排列，请你将其转换为一棵 **高度平衡** 二叉搜索树。



### 核心思路
为什么选择中间节点？
平衡性：BST 的特性是 左子树 < 根 < 右子树。在有序数组中，中间节点的左侧刚好是所有比它小的数，右侧是所有比它大的数。

高度控制：每次从中间切分，左右子树的节点数差值不会超过 1，这完美符合“高度平衡二叉树”的定义。

### 代码实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val int
 * Left *TreeNode
 * Right *TreeNode
 * }
 */
func sortedArrayToBST(nums []int) *TreeNode {
	// 直接调用递归辅助函数
	return build(nums, 0, len(nums)-1)
}

func build(nums []int, left int, right int) *TreeNode {
	// 基准情况：如果左边界大于右边界，说明当前区间没有元素，返回 nil
	if left > right {
		return nil
	}

	// 选择中间位置的数字作为根节点
	// 使用 left + (right-left)/2 是为了防止整数溢出（虽然在数组索引中较少见）
	mid := left + (right-left)/2

	// 创建根节点
	root := &TreeNode{Val: nums[mid]}

	// 递归构造左子树：使用中间节点左侧的区间
	root.Left = build(nums, left, mid-1)

	// 递归构造右子树：使用中间节点右侧的区间
	root.Right = build(nums, mid+1, right)

	return root
}
```

简单写法

```go
func sortedArrayToBST(nums []int) *TreeNode {
    if len(nums) == 0 { return nil }
    mid := len(nums) / 2
    return &TreeNode{
        Val:   nums[mid],
        Left:  sortedArrayToBST(nums[:mid]),   // 利用切片截取
        Right: sortedArrayToBST(nums[mid+1:]),
    }
}
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是数组的长度。
- 空间复杂度：$O(\log N)$，递归调用栈的最大深度为 $\log N$。

## [98. 验证二叉搜索树 - Medium](https://leetcode.cn/problems/validate-binary-search-tree/)

### 题目回顾
> 给你一个二叉树的根节点 `root` ，判断其是否是一个有效的二叉搜索树。

### 核心思路

二叉搜索树的一个核心特性是：它的中序遍历序列一定是严格递增的。 我们只需要在遍历时记录前一个节点的值，与当前节点比较即可。

### 代码实现

```go
func isValidBST(root *TreeNode) bool {
    var prev *int // 使用指针记录前一个节点的值，方便处理初始化

    var inorder func(*TreeNode) bool
    inorder = func(node *TreeNode) bool {
        if node == nil {
            return true
        }

        // 1. 遍历左子树
        if !inorder(node.Left) {
            return false
        }

        // 2. 检查当前节点：必须大于前一个节点
        if prev != nil && node.Val <= *prev {
            return false
        }
        val := node.Val
        prev = &val // 更新前一个节点的值

        // 3. 遍历右子树
        return inorder(node.Right)
    }

    return inorder(root)
}
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(H)$，其中 H 是二叉树的高度。递归调用栈的最大深度为 H。

## [230. 二叉搜索树中第 K 小的元素 - Medium](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)

### 题目回顾
> 给定一个二叉搜索树的根节点 `root` ，和一个整数 `k` ，请你设计一个算法查找其中第 k 个最小的元素（从 1 开始计数）。

### 核心思路

为什么选择中序遍历？

BST 的定义：左子树 < 根节点 < 右子树。

中序遍历顺序：左 -> 根 -> 右。

结果：按照中序遍历访问 BST 节点的顺序，正好就是数值从小到大的顺序。

优化点：

- 空间优化：原方案空间复杂度 $O(n)$ 用于存储数组，优化后为 $O(h)$（递归栈深度），其中 $h$ 是树高。

- 时间优化：一旦计数器 count == k，我们就不再处理后续节点，在 $k$ 很小时效率提升显著。


### 代码实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val int
 * Left *TreeNode
 * Right *TreeNode
 * }
 */
func kthSmallest(root *TreeNode, k int) int {
    var res int
    count := 0

    // 定义闭包递归函数
    var inorder func(*TreeNode)
    inorder = func(node *TreeNode) {
        // 如果已经找到结果或节点为空，直接返回
        if node == nil || count >= k {
            return
        }

        // 1. 递归左子树
        inorder(node.Left)

        // 2. 处理当前节点
        count++
        if count == k {
            res = node.Val
            return
        }

        // 3. 递归右子树
        inorder(node.Right)
    }

    inorder(root)
    return res
}
```

### 复杂度分析
- 时间复杂度：$O(H + k)$，其中 H 是树的高度。在最坏情况下，我们可能需要遍历到树的最深处（高度 H），然后再访问 k 个节点。
- 空间复杂度：$O(H)$，递归调用栈的最大深度为 H。

## [199. 二叉树的右视图 - Medium](https://leetcode.cn/problems/binary-tree-right-side-view/)


### 题目回顾
> 给定一个二叉树的根节点 `root` ，想象自己站在它的右侧，返回从顶部到底部所能看到的节点值。

### 核心思路

BFS 逻辑
想象你站在二叉树的右侧。每一层中，物理位置最靠右的那个节点会挡住同一层左边的所有节点。因此，只要我们按层遍历，并记录下每一层的最后一个元素，就能得到右视图。

除了 BFS，其实用 深度优先搜索（DFS） 也能解，而且代码更短。思路是：按照 “根 -> 右 -> 左” 的顺序访问节点，并记录当前深度。如果我们第一次到达某个深度，那么当前节点一定是该深度的最右节点。

### 代码实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val int
 * Left *TreeNode
 * Right *TreeNode
 * }
 */
func rightSideView(root *TreeNode) []int {
    var ans []int
    if root == nil {
        return ans
    }

    // 使用切片模拟队列
    queue := []*TreeNode{root}

    for len(queue) > 0 {
        // 当前层的节点个数
        levelSize := len(queue)

        for i := 0; i < levelSize; i++ {
            // 出队
            node := queue[0]
            queue = queue[1:]

            // 如果是当前层的最后一个节点，它就是从右侧看到的节点
            if i == levelSize-1 {
                ans = append(ans, node.Val)
            }

            // 将子节点加入队列（注意：先左后右，保证 i == levelSize-1 是最右边的）
            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
        }
    }

    return ans
}
```

DFS解法

```go
func rightSideView(root *TreeNode) []int {
    var ans []int
    var dfs func(*TreeNode, int)

    dfs = func(node *TreeNode, depth int) {
        if node == nil {
            return
        }
        // 如果当前深度等于结果集的长度，说明该深度还没记录过节点
        // 因为我们先递归右子树，所以第一个进来的肯定是该层最右边的
        if depth == len(ans) {
            ans = append(ans, node.Val)
        }

        dfs(node.Right, depth+1) // 优先访问右子树
        dfs(node.Left, depth+1)
    }

    dfs(root, 0)
    return ans
}
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(M)$，其中 M 是二叉树的最大宽度（即某一层节点的最大数量）。在最坏情况下，队列中会存储整棵树的一层节点（例如完全二叉树的最后一层）。