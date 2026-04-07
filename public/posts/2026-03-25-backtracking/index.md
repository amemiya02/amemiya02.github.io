# [Python] LeetCode 热题 100 - 回溯


# 回溯


### 回溯算法核心公式
```python
def backtrack(路径, 选择列表):
    if 满终止条件:
        res.append(路径[:]) # 注意：必须拷贝一份，否则回溯会清空结果
        return

    for 选择 in 选择列表:
        做选择
        backtrack(路径, 选择列表)
        撤销选择 # 关键：恢复现场
```

---

## [46. 全排列 - Medium](https://leetcode.cn/problems/permutations/)

### 核心思路
**决策树遍历：** 我们需要一个 `used` 数组来记录哪些数字已经被选入 `path`。Python 的 `list` 传参是引用传递，在 `res.append` 时使用 `path[:]` 是最地道的写法。



### 代码实现
```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        res = []
        used = [False] * len(nums)
        N = len(nums)
        def backtrack(path):
            # 终止条件
            if len(path) == N:
                res.append(path[:]) # Python 切片进行浅拷贝
                return

            for i in range(N):
                if used[i]: continue

                # 1. 做选择
                used[i] = True
                path.append(nums[i])
                # 2. 递归进入下一层
                backtrack(path)
                # 3. 撤销选择（回溯）
                path.pop()
                used[i] = False

        backtrack([])
        return res
```

### 复杂度分析
- **时间复杂度**：$O(n \times n!)$
- **空间复杂度**：$O(n)$

---

## [78. 子集 - Medium](https://leetcode.cn/problems/subsets/)

### 核心思路
子集问题是收集 **树的所有节点**。
对于每一个元素，我们有两种选择：**选** 或 **不选**，对不选和选两种情况进行递归即可。
### 代码实现
```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res = []
        n = len(nums)

        def backtrack(depth, path):
            if depth == n:
                res.append(path[:])
                return
            # 不选当前元素
            backtrack(depth+1, path)
            # 选当前元素
            path.append(nums[depth])
            backtrack(depth+1, path)
            path.pop()
        backtrack(0, [])
        return res
```

---

## [17. 电话号码的字母组合 - Medium](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

### 核心思路
这是典型的 **组合问题**。由于每一层处理的是不同的数字（不同的字符集），
我们不需要 `used` 数组，只需通过 `index` 控制处理到的数字位置。

### 代码实现
```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits: return []
        phone_map = {
            "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
            "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"
        }
        res = []

        def backtrack(index, path):
            if index == len(digits):
                # 注意：path 是一个字符列表，需要 join 成字符串
                res.append("".join(path))
                return

            letters = phone_map[digits[index]]
            for char in letters:
                path.append(char)
                backtrack(index + 1, path)
                path.pop()

        backtrack(0, [])
        return res
```

---

## [39. 组合总和 - Medium](https://leetcode.cn/problems/combination-sum/)

### 核心思路
1. **允许重复选择**：在递归时传入 `i` 而不是 `i + 1`。
2. **剪枝优化**：先对 `candidates` 排序，如果当前数字已经让 `target` 变成负数，直接 `break` 掉。

### 代码实现
```python
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        candidates.sort() # 排序是剪枝的前提

        def backtrack(remain, start, path):
            if remain == 0:
                res.append(path[:])
                return

            for i in range(start, len(candidates)):
                # 剪枝：如果当前值已超过剩余目标，后续更大的数无需考虑
                if remain - candidates[i] < 0:
                    break

                path.append(candidates[i])
                # 关键：传 i 表示可以重复使用当前数字
                backtrack(remain - candidates[i], i, path)
                path.pop()

        backtrack(target, 0, [])
        return res
```

---

## [22. 括号生成 - Medium](https://leetcode.cn/problems/generate-parentheses/)

### 核心思路
这题的回溯更像是一种 **带约束的路径搜索**。
- 左括号数量必须小于 $n$ 才能加。
- 右括号数量必须小于 **左括号数量** 才能加（保证有效性）。

### 代码实现
```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []

        def backtrack(left, right, path):
            if len(path) == 2 * n:
                res.append("".join(path))
                return

            if left < n:
                path.append("(")
                backtrack(left + 1, right, path)
                path.pop()

            if right < left:
                path.append(")")
                backtrack(left, right + 1, path)
                path.pop()

        backtrack(0, 0, [])
        return res
```

---

## [79. 单词搜索 - Medium](https://leetcode.cn/problems/word-search/)

### 核心思路
**矩阵 DFS + 原地标记**：为了省去 `visited` 数组的空间，我们可以将当前访问过的格子临时改为 `'#'`，回溯时再改回来。

### 代码实现
```python
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])

        def dfs(r, c, k):
            if k == len(word):
                return True
            if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[k]:
                return False

            # 1. 标记访问
            temp, board[r][c] = board[r][c], "#"

            # 2. 四向探索
            res = (dfs(r+1, c, k+1) or dfs(r-1, c, k+1) or
                dfs(r, c+1, k+1) or dfs(r, c-1, k+1))

            # 3. 回溯（恢复现场）
            board[r][c] = temp
            return res

        for i in range(rows):
            for j in range(cols):
                if board[i][j] == word[0]:
                    if dfs(i, j, 0): return True
        return False
```

---

## [131. 分割回文串 - Medium](https://leetcode.cn/problems/palindrome-partitioning/)

### 核心思路
在 Python 中，判断回文最快的方式是字符串切片反转 `s == s[::-1]`。

### 代码实现
```python
class Solution:
    def partition(self, s: str) -> List[List[str]]:
        res = []

        def backtrack(start, path):
            if start == len(s):
                res.append(path[:])
                return

            for i in range(start, len(s)):
                sub = s[start:i+1]
                # 只有当前片段是回文才继续递归
                if sub == sub[::-1]:
                    path.append(sub)
                    backtrack(i + 1, path)
                    # path.pop() 是为了恢复现场。当左侧的分支探索完了，
                    # 我们需要把刚才加进去的子串删掉，这样才能在同一个 start 位置尝试下一个不同的 i。
                    path.pop()

        backtrack(0, [])
        return res
```

---

## [51. N 皇后 - Hard](https://leetcode.cn/problems/n-queens/)

### 核心思路
**几何冲突检查：** - **列冲突**：`col`
- **正斜线 (/)**：`row + col` 为常数
- **反斜线 (\\)**：`row - col` 为常数
利用 Python 的 `set` 可以实现 $O(1)$ 的冲突检查。



### 代码实现
```python
class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        res = []
        # 使用 set 记录已占用的列和斜线
        cols = set()
        pos_diag = set() # row + col
        neg_diag = set() # row - col

        board = [["."] * n for _ in range(n)]

        def backtrack(r):
            if r == n:
                res.append(["".join(row) for row in board])
                return

            for c in range(n):
                if c in cols or (r + c) in pos_diag or (r - c) in neg_diag:
                    continue

                # 做选择
                board[r][c] = "Q"
                cols.add(c)
                pos_diag.add(r + c)
                neg_diag.add(r - c)

                backtrack(r + 1)

                # 回溯
                board[r][c] = "."
                cols.remove(c)
                pos_diag.remove(r + c)
                neg_diag.remove(r - c)

        backtrack(0)
        return res
```

### 复杂度分析
- **时间复杂度**：$O(N!)$
- **空间复杂度**：$O(N)$，用于存储递归栈和三个 `set`。

---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-backtracking/  

