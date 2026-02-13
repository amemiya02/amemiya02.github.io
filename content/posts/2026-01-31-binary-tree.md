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