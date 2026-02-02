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


## [114. 二叉树展开为链表 - Medium](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

### 题目回顾

> 给你二叉树的根节点 `root` ，请你将它展开为一个单链表：
> - 展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个节点，而 `left` 子指针始终为 `null` 。
> - 展开后的单链表应该与二叉树 **先序遍历** 顺序相同。

### 核心思路

寻找“前驱节点”
展开后的链表顺序其实就是二叉树的 先序遍历（根 -> 左 -> 右）。

为什么这个逻辑有效？
先序遍历的性质：在先序遍历中，root 的右子树一定紧跟在左子树的最后一个节点（左子树的最右节点）后面。

原地转移：

我们先找到左子树的“最右节点” pre。

把整个 curr.Right 挪动到 pre.Right。

这时，原来的左子树就可以安全地变成右子树，同时把左边清空。

循环往复：通过 curr = curr.Right 不断向下推进，直到整棵树变成一个细长的“右斜杆”。

除了上述思路外，还有递归的写法。递归的关键在于我们需要从下往上处理节点（即后序遍历的变种），这样才能确保在处理当前节点时，已经处理好了它的右子树和左子树。
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
func flatten(root *TreeNode) {
    curr := root
    for curr != nil {
        if curr.Left != nil {
            // 1. 找到左子树中最右边的节点（即左子树中序遍历的最后一个节点）
            pre := curr.Left
            for pre.Right != nil {
                pre = pre.Right
            }

            // 2. 将原先的右子树接到左子树最右节点的右边
            pre.Right = curr.Right

            // 3. 将左子树插到右边，并将左边置空
            curr.Right = curr.Left
            curr.Left = nil
        }
        // 4. 继续处理下一个右节点
        curr = curr.Right
    }
}
```

递归写法

```go
func flatten(root *TreeNode) {
    var prev *TreeNode
    var dfs func(*TreeNode)
    dfs = func(node *TreeNode) {
        if node == nil {
            return
        }
        // 按照 右 -> 左 -> 根 的顺序倒着处理
        dfs(node.Right)
        dfs(node.Left)

        node.Right = prev
        node.Left = nil
        prev = node
    }
    dfs(root)
}
```

### 复杂度分析

- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(1)$，我们只使用了常数级别的额外空间。递归写法的空间复杂度为 $O(H)$，其中 H 是二叉树的高度。

## [105. 从前序与中序遍历序列构造二叉树 - Medium](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

### 题目回顾
> 给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的前序遍历，`inorder` 是同一棵树的中序遍历，请你构造并返回这棵二叉树。

### 核心思路

分治策略
核心步骤：
确定根节点：从 preorder 数组中按顺序取出元素作为根。

划分区间：在 inorder 数组中找到该根节点的位置 mid。

[inLeft, mid-1] 构成左子树的中序序列。

[mid+1, inRight] 构成右子树的中序序列。

递归填充：

由于前序遍历的顺序是“根-左-右”，我们在递归时必须先调用 build(左区间)，再调用 build(右区间)。

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
func buildTree(preorder []int, inorder []int) *TreeNode {
    // 1. 使用 map 存储中序遍历的值与索引的映射，提高查找效率
    indexMap := make(map[int]int)
    for i, v := range inorder {
        indexMap[v] = i
    }

    // preorderIdx 用于记录当前处理到前序遍历的第几个节点
    preorderIdx := 0

    // 2. 定义递归函数
    var build func(inLeft, inRight int) *TreeNode
    build = func(inLeft, inRight int) *TreeNode {
        // 如果左边界大于右边界，说明该子树为空
        if inLeft > inRight {
            return nil
        }

        // 前序遍历的第一个节点就是当前的根节点
        rootVal := preorder[preorderIdx]
        preorderIdx++
        root := &TreeNode{Val: rootVal}

        // 在中序遍历中找到根节点的索引，以此划分左右子树
        mid := indexMap[rootVal]

        // 3. 递归构造左右子树
        // 注意：必须先构造左子树，因为前序遍历中根节点后面紧跟的是左子树
        root.Left = build(inLeft, mid-1)
        root.Right = build(mid+1, inRight)

        return root
    }

    return build(0, len(inorder)-1)
}
```
### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(N)$，用于存储中序遍历的值与索引的映射，以及递归调用栈的空间。

## [437. 路径总和 III - Medium](https://leetcode.cn/problems/path-sum-iii/)

### 题目回顾
> 给定一个二叉树的根节点 `root` ，和一个整数目标和 `targetSum` ，求该二叉树中 **和为目标和** 的路径数

### 核心思路
前缀和在树的路径中，如果“根节点到当前节点 A”的路径和为 $S_1$，
而“根节点到其祖先节点 B”的路径和为 $S_2$，那么 B 到 A 的路径和 就是 $S_1 - S_2$。
我们要找的是 $S_1 - S_2 = targetSum$，即在当前路径的祖先节点中，
有多少个节点的前缀和等于 $S_1 - targetSum$。

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
func pathSum(root *TreeNode, targetSum int) int {
	// prefixSumMap 存储从根节点开始的路径和及其出现的次数
	// key: 前缀和, value: 出现次数
	prefixSumMap := make(map[int64]int)

	// 初始化：前缀和为 0 的路径默认有 1 条（代表从根节点开始的路径）
	prefixSumMap[0] = 1

	return dfs(root, 0, int64(targetSum), prefixSumMap)
}

func dfs(node *TreeNode, currSum int64, target int64, prefixSumMap map[int64]int) int {
	if node == nil {
		return 0
	}

	// 1. 更新当前路径和
	currSum += int64(node.Val)

	// 2. 检查是否存在满足条件的前缀和
	// currSum - target = 祖先节点的前缀和
	count := prefixSumMap[currSum-target]

	// 3. 将当前前缀和加入 map，供子节点使用
	prefixSumMap[currSum]++

	// 4. 递归处理左右子树
	count += dfs(node.Left, currSum, target, prefixSumMap)
	count += dfs(node.Right, currSum, target, prefixSumMap)

	// 5. 回溯：在返回父节点前，移除当前节点的前缀和
	// 这是为了防止“左子树”的前缀和影响到“右子树”的路径计算
	prefixSumMap[currSum]--

	return count
}
```
### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(N)$，用于存储前缀和的哈希表，以及递归调用栈的空间。


## [236. 二叉树的最近公共祖先 - Medium](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

### 题目回顾

> 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

### 核心思路
三种情况的博弈我们在递归回溯的过程中，

left 和 right 的含义是：在该子树中找到的 $p$ 或 $q$（或者它们的公共祖先）。


- 左右逢源：如果 left 和 right 同时不为空，说明 $p$ 和 $q$ 分别分布在当前节点的左右子树中，那么当前节点 root 必然是 LCA。

- 一侧全包：如果一边为空，另一边不为空，说明 $p$ 和 $q$ 都在不为空的那一侧。此时我们继续向上返回那个不为空的节点。

- 空手而归：如果两边都为空，说明这棵子树里既没有 $p$ 也没有 $q$，返回 nil。为什么 root == p || root == q 时直接返回？这是一个巧妙的提前阻断。如果我们在某个节点遇到了 $p$，即使 $q$ 在 $p$ 的子树下面，根据 LCA 的定义，$p$ 本身就是它们的最近公共祖先。所以我们不需要再往下找了，直接把 $p$ 向上返回即可。


### 代码实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 * Val   int
 * Left  *TreeNode
 * Right *TreeNode
 * }
 */
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    // 1. 基准情况：如果节点为空，或者找到了 p 或 q，直接返回当前节点
    if root == nil || root == p || root == q {
        return root
    }

    // 2. 递归在左右子树中寻找 p 和 q
    left := lowestCommonAncestor(root.Left, p, q)
    right := lowestCommonAncestor(root.Right, p, q)

    // 3. 根据左右子树的返回值进行逻辑判断：

    // 如果左子树没找到，说明 p 和 q 都在右子树，返回右子树的结果
    if left == nil {
        return right
    }

    // 如果右子树没找到，说明都在左子树，返回左子树的结果
    if right == nil {
        return left
    }

    // 如果左、右子树都各找到了一个（都不为 nil），
    // 说明当前 root 就是它们分叉的地方，即最近公共祖先
    return root
}
```
### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(H)$，其中 H 是二叉树的高度。递归调用栈的最大深度为 H。

## [124. 二叉树中的最大路径和 - Hard](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

### 题目回顾
> 给你一个二叉树的根节点 `root` ，返回其 最大路径和 。
> 二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。
> 路径和 是路径中各节点值的总和。
> 给你一个二叉树的根节点 root ，返回其 最大路径和 。


### 核心思路

单边贡献 vs. 完整路径

1. 概念区分完整路径 (Current PathSum)：以当前节点为“转折点”的路径，即 leftGain + node.Val + rightGain。我们用它来更新全局的 maxSum。单边贡献 (Gain)：当前节点向上级汇报的值。由于路径不能有分叉，所以汇报给父节点时，只能选 node.Val + leftGain 或 node.Val + rightGain。

2. 负数处理（贪心）如果某个子树的路径和算出来是 $-5$，那么根节点加上它只会让结果变小。此时 max(0, gain) 的逻辑就会起作用，将其视为 $0$，相当于“斩断”了通往该子树的路径。

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
import "math"

func maxPathSum(root *TreeNode) int {
    // 初始化为最小整数，防止树中全是负数
    maxSum := math.MinInt32

    var gain func(*TreeNode) int
    gain = func(node *TreeNode) int {
        if node == nil {
            return 0
        }

        // 1. 递归计算左右子树能提供的最大贡献
        // 如果贡献是负数，我们直接取 0（表示不经过该子树）
        leftGain := max(0, gain(node.Left))
        rightGain := max(0, gain(node.Right))

        // 2. 计算经过当前节点的最大路径和（左 + 根 + 右）
        // 并尝试更新全局最大值
        currentPathSum := node.Val + leftGain + rightGain
        if currentPathSum > maxSum {
            maxSum = currentPathSum
        }

        // 3. 返回该节点能提供给父节点的最大单侧路径
        // 因为路径不能分支，所以只能选左或右其中一条
        return node.Val + max(leftGain, rightGain)
    }

    gain(root)
    return maxSum
}

// 辅助函数：返回两个整数中的较大值
func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}
```
### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(H)$，其中 H 是二叉树的高度。递归调用栈的最大深度为 H。