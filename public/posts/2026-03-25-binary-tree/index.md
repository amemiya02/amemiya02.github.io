# [Python] LeetCode 热题 100 - 二叉树


# 二叉树


### 节点定义
在 Python 中，二叉树节点的标准定义如下：
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

---

## [94. 二叉树的中序遍历 - Easy](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

### 核心思路
**迭代法（栈）：** 中序遍历的顺序是“左-根-右”。我们利用 Python 的 `list` 作为栈，一路向左压入节点，再弹出处理。

### 代码实现
```python
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        res, stack = [], []
        curr = root
        while curr or stack:
            # 1. 一路向左，将所有左孩子入栈
            while curr:
                stack.append(curr)
                curr = curr.left
            # 2. 弹出栈顶（当前最左节点）
            curr = stack.pop()
            # 3. 记录结果
            res.append(curr.val)
            # 4. 转向右子树
            curr = curr.right
        return res
```

### 复杂度分析
- **时间复杂度**：$O(N)$
- **空间复杂度**：$O(H)$，其中 $H$ 是树高。

---

## [104. 二叉树的最大深度 - Easy](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

### 核心思路
**分治递归：** 树的最大深度 = $max(左子树深度, 右子树深度) + 1$。

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return max(self.maxDepth(root.left), self.maxDepth(root.right)) + 1
```

> **教练笔记：** Python 的递归深度默认是 1000。如果树特别深（如退化成链表），面试官可能会问及栈溢出问题。此时可以改用 BFS。

---

## [226. 翻转二叉树 - Easy](https://leetcode.cn/problems/invert-binary-tree/)

### 核心思路
利用 Python 的 **元组拆包 (Tuple Unpacking)** 特性，一行代码即可交换左右子树。



### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None

        # Pythonic 交换：递归翻转的同时进行赋值
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)

        return root
```

---

## [101. 对称二叉树 - Easy](https://leetcode.cn/problems/symmetric-tree/)

### 核心思路
镜像对称的本质：左子树的左边 == 右子树的右边，且左子树的右边 == 右子树的左边。

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        if not root:
            return True

        def check(p, q):
            if not p and not q: return True
            if not p or not q or p.val != q.val: return False
            return check(p.left, q.right) and check(p.right, q.left)

        return check(root.left, root.right)
```

---

## [543. 二叉树的直径 - Easy](https://leetcode.cn/problems/diameter-of-binary-tree/)

### 核心思路
直径 = 某个节点左子树深度 + 右子树深度。我们需要在计算深度的过程中，顺便维护一个全局最大值。

### 代码实现
```python
def diameterOfBinaryTree(root: TreeNode) -> int:
    self_ans = 0

    def depth(node):
        nonlocal self_ans # 使用 nonlocal 修改外部作用域变量
        if not node:
            return 0

        left = depth(node.left)
        right = depth(node.right)

        # 更新直径：左深度 + 右深度
        self_ans = max(self_ans, left + right)

        # 返回当前节点为根的子树高度
        return max(left, right) + 1

    depth(root)
    return self_ans
```

---

## [102. 二叉树的层序遍历 - Medium](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

### 核心思路
使用 `collections.deque` 实现 BFS。每一轮循环处理一整层节点。

### 代码实现
```python
from collections import deque

def levelOrder(root: TreeNode) -> list[list[int]]:
    if not root:
        return []

    res = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        current_level = []

        for _ in range(level_size):
            node = queue.popleft() # O(1) 操作
            current_level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)

        res.append(current_level)
    return res
```

---

## [98. 验证二叉搜索树 - Medium](https://leetcode.cn/problems/validate-binary-search-tree/)

### 核心思路
**中序遍历有序性：** BST 的中序遍历必须是严格单调递增的。

### 代码实现
```python
def isValidBST(root: TreeNode) -> bool:
    prev = float('-inf') # 初始化为负无穷

    def inorder(node):
        nonlocal prev
        if not node:
            return True

        # 1. 递归左子树
        if not inorder(node.left):
            return False

        # 2. 检查当前值
        if node.val <= prev:
            return False
        prev = node.val

        # 3. 递归右子树
        return inorder(node.right)

    return inorder(root)
```

---

## [114. 二叉树展开为链表 - Medium](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

### 核心思路
**寻找前驱节点（Morris 遍历思想）：** 将原右子树接到左子树的最右节点上，然后将左子树移到右边。

### 代码实现
```python
def flatten(root: TreeNode) -> None:
    curr = root
    while curr:
        if curr.left:
            # 找到左子树的最右节点
            pre = curr.left
            while pre.right:
                pre = pre.right

            # 将原右子树接过去
            pre.right = curr.right
            # 左子树变右子树
            curr.right = curr.left
            curr.left = None

        # 继续处理下一个
        curr = curr.right
```

---

## [437. 路径总和 III - Medium](https://leetcode.cn/problems/path-sum-iii/)

### 核心思路
**前缀和 + 回溯：** 类似一维数组寻找和为 K 的连续子数组。

### 代码实现
```python
from collections import defaultdict

def pathSum(root: TreeNode, targetSum: int) -> int:
    # 记录前缀和出现的次数
    prefix_map = defaultdict(int)
    prefix_map[0] = 1 # 基础情况

    def dfs(node, curr_sum):
        if not node:
            return 0

        curr_sum += node.val
        # 核心逻辑：找到满足 (curr_sum - targetSum) 的前缀和数量
        count = prefix_map[curr_sum - targetSum]

        # 更新 map 供子节点使用
        prefix_map[curr_sum] += 1

        # 递归左右
        count += dfs(node.left, curr_sum)
        count += dfs(node.right, curr_sum)

        # 回溯：防止左子树的前缀和影响到右子树
        prefix_map[curr_sum] -= 1

        return count

    return dfs(root, 0)
```

---

## [124. 二叉树中的最大路径和 - Hard](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

### 核心思路
每个节点计算两个值：
1. **最大贡献 (Gain)**：向上级汇报，只能选 $node.val + max(左贡献, 右贡献, 0)$。
2. **当前路径和**：$node.val + 左贡献 + 右贡献$（更新全局最大值）。

### 代码实现
```python
def maxPathSum(root: TreeNode) -> int:
    max_sum = float('-inf')

    def get_gain(node):
        nonlocal max_sum
        if not node:
            return 0

        # 贪心：如果贡献是负数，则舍弃（取 0）
        left_gain = max(get_gain(node.left), 0)
        right_gain = max(get_gain(node.right), 0)

        # 更新全局最大路径和
        max_sum = max(max_sum, node.val + left_gain + right_gain)

        # 返回该节点能提供给父节点的最大单侧增益
        return node.val + max(left_gain, right_gain)

    get_gain(root)
    return max_sum
```


---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-binary-tree/  

