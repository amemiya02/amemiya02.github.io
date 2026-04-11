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

### 题目回顾
> 给定一个二叉树的根节点 `root` ，返回它的 **中序** 遍历。

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

### 题目回顾
> 给定一个二叉树，找出其最大深度。

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

### 题目回顾
> 给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。

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

### 题目回顾
> 给你一个二叉树的根节点 `root` ，检查它是否是镜像对称的。

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

### 题目回顾
> 给定一棵二叉树的根节点 `root` ，返回该树的 **直径** 。
> 二叉树的 **直径** 是指任意两个节点之间路径长度中的最大值。这条路径可能穿过也可能不穿过根节点。

### 核心思路
直径 = 某个节点左子树深度 + 右子树深度。我们需要在计算深度的过程中，顺便维护一个全局最大值。

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
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

### 题目回顾
> 给你二叉树的根节点 `root` ，返回其节点值的 **层序遍历** 。（即逐层地，从左到右访问所有节点）。

### 核心思路
使用 `collections.deque` 实现 BFS。每一轮循环处理一整层节点。

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
from collections import deque

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
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

## [108. 将有序数组转换为二叉搜索树 - Easy](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

### 题目回顾

> 给你一个整数数组 `nums` ，其中元素已经按 **升序** 排列，请你将其转换为一棵 **高度平衡** 二叉搜索树。

### 核心思路
为什么选择中间节点？
平衡性：BST 的特性是 左子树 < 根 < 右子树。在有序数组中，中间节点的左侧刚好是所有比它小的数，右侧是所有比它大的数。

高度控制：每次从中间切分，左右子树的节点数差值不会超过 1，这完美符合“高度平衡二叉树”的定义。

### 代码实现

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        # 调用递归辅助函数，传入初始左右边界
        return self.build(nums, 0, len(nums) - 1)

    def build(self, nums: List[int], left: int, right: int) -> Optional[TreeNode]:
        # 基准情况：如果左边界大于右边界，说明当前区间没有元素，返回 None
        if left > right:
            return None

        # 选择中间位置的数字作为根节点
        # Python 3 的 // 是地板除（取整除）
        mid = left + (right - left) // 2

        # 创建根节点
        root = TreeNode(val=nums[mid])

        # 递归构造左子树：使用中间节点左侧的区间 [left, mid - 1]
        root.left = self.build(nums, left, mid - 1)

        # 递归构造右子树：使用中间节点右侧的区间 [mid + 1, right]
        root.right = self.build(nums, mid + 1, right)

        return root
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是数组的长度。
- 空间复杂度：$O(\log N)$，递归调用栈的最大深度为 $\log N$。

---

## [98. 验证二叉搜索树 - Medium](https://leetcode.cn/problems/validate-binary-search-tree/)

### 题目回顾
> 给你一个二叉树的根节点 `root` ，判断其是否是一个有效的二叉搜索树。

### 核心思路
**中序遍历有序性：** BST 的中序遍历必须是严格单调递增的。

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
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

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        res = 0
        count = 0

        def inorder(node):
            # 声明使用外部作用域的变量
            nonlocal res, count
            
            # 如果节点为空，或者已经找到了第 k 个元素，则停止递归
            if not node or count >= k:
                return

            # 1. 遍历左子树
            inorder(node.left)

            # 2. 处理当前节点
            count += 1
            if count == k:
                res = node.val
                return

            # 3. 遍历右子树
            inorder(node.right)

        inorder(root)
        return res
```

### 复杂度分析
- 时间复杂度：$O(H + k)$，其中 H 是树的高度。在最坏情况下，我们可能需要遍历到树的最深处（高度 H），然后再访问 k 个节点。
- 空间复杂度：$O(H)$，递归调用栈的最大深度为 H。
---
## [105. 从前序与中序遍历序列构造二叉树 - Medium](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

### 题目回顾
> 给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的前序遍历，`inorder` 是同一棵树的中序遍历，请你构造并返回这棵二叉树。

### 核心思路
**分治策略**

核心步骤：
1. 确定根节点：从 preorder 数组中按顺序取出元素作为根。
2. 划分区间：在 inorder 数组中找到该根节点的位置 mid。
   - `[inLeft, mid-1]` 构成左子树的中序序列。
   - `[mid+1, inRight]` 构成右子树的中序序列。
3. 递归填充：由于前序遍历的顺序是"根-左-右"，我们在递归时必须先调用 build(左区间)，再调用 build(右区间)。

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        # 使用字典存储中序遍历的值与索引的映射，提高查找效率
        index_map = {val: i for i, val in enumerate(inorder)}
        
        # preorderIdx 用于记录当前处理到前序遍历的第几个节点
        self.preorderIdx = 0

        def build(inLeft: int, inRight: int) -> Optional[TreeNode]:
            # 如果左边界大于右边界，说明该子树为空
            if inLeft > inRight:
                return None

            # 前序遍历的第一个节点就是当前的根节点
            root_val = preorder[self.preorderIdx]
            self.preorderIdx += 1
            root = TreeNode(val=root_val)

            # 在中序遍历中找到根节点的索引，以此划分左右子树
            mid = index_map[root_val]

            # 递归构造左右子树
            # 注意：必须先构造左子树，因为前序遍历中根节点后面紧跟的是左子树
            root.left = build(inLeft, mid - 1)
            root.right = build(mid + 1, inRight)

            return root

        return build(0, len(inorder) - 1)
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(N)$，用于存储中序遍历的值与索引的映射，以及递归调用栈的空间。

---

## [199. 二叉树的右视图 - Medium](https://leetcode.cn/problems/binary-tree-right-side-view/)


### 题目回顾
> 给定一个二叉树的根节点 `root` ，想象自己站在它的右侧，返回从顶部到底部所能看到的节点值。

### 核心思路

BFS 逻辑
想象你站在二叉树的右侧。每一层中，物理位置最靠右的那个节点会挡住同一层左边的所有节点。因此，只要我们按层遍历，并记录下每一层的最后一个元素，就能得到右视图。

除了 BFS，其实用 深度优先搜索（DFS） 也能解，而且代码更短。思路是：按照 “根 -> 右 -> 左” 的顺序访问节点，并记录当前深度。如果我们第一次到达某个深度，那么当前节点一定是该深度的最右节点。

### 代码实现

BFS解法

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
from collections import deque

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        
        ans = []
        queue = deque([root])
        
        while queue:
            level_size = len(queue)
            
            for i in range(level_size):
                node = queue.popleft()
                
                # 如果是当前层的最后一个节点，它就是从右侧看到的节点
                if i == level_size - 1:
                    ans.append(node.val)
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        
        return ans
```

DFS解法

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        ans = []
        
        def dfs(node, depth):
            if not node:
                return
            
            # 如果当前深度等于结果集的长度，说明该深度还没记录过节点
            # 因为我们先递归右子树，所以第一个进来的肯定是该层最右边的
            if depth == len(ans):
                ans.append(node.val)
            
            dfs(node.right, depth + 1)  # 优先访问右子树
            dfs(node.left, depth + 1)
        
        dfs(root, 0)
        return ans
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(M)$，其中 M 是二叉树的最大宽度（即某一层节点的最大数量）。在最坏情况下，队列中会存储整棵树的一层节点（例如完全二叉树的最后一层）。


---

## [114. 二叉树展开为链表 - Medium](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

### 题目回顾
> 给你二叉树的根节点 `root` ，请你将它展开为一个单链表：
> - 展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个节点，而 `left` 子指针始终为 `null` 。
> - 展开后的单链表应该与二叉树 **先序遍历** 顺序相同。

### 核心思路
**寻找前驱节点（Morris 遍历思想）：** 将原右子树接到左子树的最右节点上，然后将左子树移到右边。

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        """
        在先序遍历中，顺序是 根 -> 左子树全部 -> 右子树全部。
        这意味着：原有的右子树，必须接在左子树“最后被访问到的那个节点”的后面。
        在左子树中，先序遍历最后访问的节点是谁？
        根据“根 -> 左 -> 右”的规则，左子树中最后被访问的一定是它最右边的叶子节点。
        """
        curr = root
        while curr:
            if curr.left:
                # 找到左子树的最右节点
                pre = curr.left
                while pre.right:
                    pre = pre.right

                # 将原右子树curr.right接过去
                pre.right = curr.right
                # 左子树变右子树
                curr.right = curr.left
                curr.left = None

            # 继续处理下一个
            curr = curr.right
```

---

## [437. 路径总和 III - Medium](https://leetcode.cn/problems/path-sum-iii/)

### 题目回顾
> 给定一个二叉树的根节点 `root` ，和一个整数目标和 `targetSum` ，求该二叉树中 **和为目标和** 的路径数。

### 核心思路
**前缀和 + 回溯：** 类似一维数组寻找和为 K 的连续子数组。

要在二叉树中找到一段连续路径等于 targetSum，
你可以想象从根节点到当前节点的这条线是一段数组。
在数组中，如果我们想找一段子数组之和等于 target，
公式是：

$CurrentSum - PreviousSum = Target$

变形一下就是：

$PreviousSum = CurrentSum - Target$

只要我们统计一下在当前节点之前，有多少个“前缀和”刚好等于 CurrentSum - Target，
就说明有多少条路径终点是当前节点，且和为 Target。

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from collections import defaultdict

class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
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
            """
            这是在二叉树上使用前缀和的最关键一步。
            二叉树和数组最大的区别在于：它有分叉。
            当你处理完左子树，准备去处理右子树时，
            左子树里的节点并不在右子树的路径上。
            如果我们不把左子树产生的前缀和“删掉”，
            当我们在右子树里查找时，可能会误用到左子树的数据。
            """
            # 回溯：防止左子树的前缀和影响到右子树
            prefix_map[curr_sum] -= 1

            return count
        return dfs(root, 0)

```

---

## [236. 二叉树的最近公共祖先 - Medium](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

### 题目回顾
> 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

### 核心思路
**三种情况的博弈**

我们在递归回溯的过程中，left 和 right 的含义是：在该子树中找到的 $p$ 或 $q$（或者它们的公共祖先）。

- **左右逢源**：如果 left 和 right 同时不为空，说明 $p$ 和 $q$ 分别分布在当前节点的左右子树中，那么当前节点 root 必然是 LCA。
- **一侧全包**：如果一边为空，另一边不为空，说明 $p$ 和 $q$ 都在不为空的那一侧。此时我们继续向上返回那个不为空的节点。
- **空手而归**：如果两边都为空，说明这棵子树里既没有 $p$ 也没有 $q$，返回 nil。

为什么 `root == p or root == q` 时直接返回？这是一个巧妙的提前阻断。如果我们在某个节点遇到了 $p$，即使 $q$ 在 $p$ 的子树下面，根据 LCA 的定义，$p$ 本身就是它们的最近公共祖先。所以我们不需要再往下找了，直接把 $p$ 向上返回即可。

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # 1. 基准情况：如果节点为空，或者找到了 p 或 q，直接返回当前节点
        if not root or root == p or root == q:
            return root

        # 2. 递归在左右子树中寻找 p 和 q
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)

        # 3. 根据左右子树的返回值进行逻辑判断：

        # 如果左子树没找到，说明 p 和 q 都在右子树，返回右子树的结果
        if not left:
            return right

        # 如果右子树没找到，说明都在左子树，返回左子树的结果
        if not right:
            return left

        # 如果左、右子树都各找到了一个（都不为 None），
        # 说明当前 root 就是它们分叉的地方，即最近公共祖先
        return root
```

### 复杂度分析
- 时间复杂度：$O(N)$，其中 N 是二叉树的节点数。每个节点恰好被访问一次。
- 空间复杂度：$O(H)$，其中 H 是二叉树的高度。递归调用栈的最大深度为 H。

---

## [124. 二叉树中的最大路径和 - Hard](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

### 题目回顾
> 给你一个二叉树的根节点 `root` ，返回其 **最大路径和** 。
> 二叉树中的 **路径** 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 **至多出现一次** 。该路径 **至少包含一个** 节点，且不一定经过根节点。
> 路径和 是路径中各节点值的总和。

### 核心思路
每个节点计算两个值：
1. **最大贡献 (Gain)**：向上级汇报，只能选 $node.val + max(左贡献, 右贡献, 0)$。
2. **当前路径和**：$node.val + 左贡献 + 右贡献$（更新全局最大值）。

A. 内部路径（用于更新全局最大值）

在这个节点处，路径可以穿过该节点，连接左子树和右子树。这种路径形成了一个“拱桥”形状，它不能再向上延伸给父节点了。

计算公式：node.val + left_gain + right_gain

代码对应：self.max_sum = max(self.max_sum, node.val + left_gain + right_gain)

B. 节点增益（用于返回给父节点）

为了让父节点也能组成路径，当前节点只能选择左或右其中一条最长的分支加上自己，向上提供贡献。

计算公式：node.val + max(left_gain, right_gain)

代码对应：return node.val + max(left_gain, right_gain)

### 代码实现
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        self.max_sum = float('-inf')

        def get_gain(node):
            if not node:
                return 0

            # 贪心：如果贡献是负数，则舍弃（取 0）
            left_gain = max(get_gain(node.left), 0)
            right_gain = max(get_gain(node.right), 0)

            # 更新全局最大路径和
            self.max_sum = max(self.max_sum, node.val + left_gain + right_gain)

            # 返回该节点能提供给父节点的最大单侧增益
            return node.val + max(left_gain, right_gain)

        get_gain(root)
        return self.max_sum
```


---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-binary-tree/  

