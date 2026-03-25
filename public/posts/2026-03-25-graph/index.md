# [Python] LeetCode 热题 100 - 图论


# 图论


### [200. 岛屿数量 - Mid](https://leetcode.cn/problems/number-of-islands/)

### 核心思路
**染色法（DFS）：** 遍历网格，每当我们遇到一个 `'1'`，就启动一次 DFS。DFS 的任务是将当前岛屿相连的所有 `'1'` 全部“淹没”（改为 `'0'`）。这种原地修改的方式避免了额外的 `visited` 空间。



### 代码实现
```python
def numIslands(grid: list[list[str]]) -> int:
    if not grid: return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        # 越界或遇到水，直接返回
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return

        # 标记已访问（淹没）
        grid[r][c] = '0'

        # 向四个方向扩散
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == '1':
                dfs(i, j)
                # 触发一次 DFS 代表发现一个完整岛屿
                count += 1

    return count
```

### 复杂度分析
- **时间复杂度**：$O(M \times N)$，每个单元格最多被访问一次。
- **空间复杂度**：$O(M \times N)$，最坏情况下递归栈的深度。

---

## [994. 腐烂的橘子 - Mid](https://leetcode.cn/problems/rotting-oranges/)

### 核心思路
**多源 BFS：** 腐烂是按分钟“同步扩散”的，这完美契合 BFS 的**层序遍历**特性。我们将所有初始腐烂的橘子存入队列，作为 BFS 的第 0 层。



### 代码实现
```python
from collections import deque

def orangesRotting(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    # 1. 初始化：收集所有腐烂橘子，统计新鲜橘子
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    if fresh_count == 0: return 0

    minutes = 0
    # 2. BFS 扩散
    while queue and fresh_count > 0:
        minutes += 1
        # 逐层处理
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh_count -= 1
                    queue.append((nr, nc))

    return minutes if fresh_count == 0 else -1
```

---

## [207. 课程表 - Mid](https://leetcode.cn/problems/course-schedule/)

### 核心思路
**Kahn 算法（拓扑排序）：** 这是一个**有向无环图（DAG）**的判定问题。
1. 统计所有节点的**入度**（需要多少先修课）。
2. 将所有入度为 0 的课程入队。
3. 不断从队列中取出课程，并将其指向的后继课程的入度减 1。
4. 如果后继课程入度变为 0，则入队。



### 代码实现
```python
from collections import deque, defaultdict

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    indegree = [0] * numCourses
    adj = defaultdict(list)

    # 1. 建立邻接表和入度数组
    for cur, pre in prerequisites:
        adj[pre].append(cur)
        indegree[cur] += 1

    # 2. 入度为 0 的节点进队列
    queue = deque([i for i in range(numCourses) if indegree[i] == 0])

    count = 0
    while queue:
        course = queue.popleft()
        count += 1
        for next_course in adj[course]:
            indegree[next_course] -= 1
            if indegree[next_course] == 0:
                queue.append(next_course)

    # 3. 如果处理过的节点数等于总课程数，说明无环
    return count == numCourses
```

---

## [208. 实现 Trie (前缀树) - Mid](https://leetcode.cn/problems/implement-trie-prefix-tree/)

### 核心思路
在 Python 中实现 Trie，使用 **嵌套字典** 往往比使用长度为 26 的列表更加简洁且节省内存。每个节点是一个字典，包含字符映射和一个标记位。



### 代码实现
```python
class Trie:
    def __init__(self):
        # 字典的 key 为字符，value 为下一个 Trie 节点
        self.children = {}
        self.is_end = False

    def insert(self, word: str) -> None:
        node = self
        for char in word:
            if char not in node.children:
                node.children[char] = Trie()
            node = node.children[char]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self._search_prefix(word)
        return node is not None and node.is_end

    def startsWith(self, prefix: str) -> bool:
        return self._search_prefix(prefix) is not None

    def _search_prefix(self, prefix: str):
        node = self
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

### 复杂度分析
- **Insert/Search/StartsWith**: $O(m)$，$m$ 是单词长度。
- **空间复杂度**: $O(S)$，$S$ 是所有插入单词的字符总数。


---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-graph/  

