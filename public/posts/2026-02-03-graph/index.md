# [Golang] LeetCode 热题 100 - 图论

# 图论

## [200. 岛屿数量 - Mid](https://leetcode-cn.com/problems/number-of-islands/)

### 题目回顾

> 给你一个由 '1'（陆地）和 '0'（水）组成的二维网格，请你计算网格中岛屿的数量。岛屿总是被水包围，并且每座岛屿只能由水平方向和竖直方向上相邻的陆地连接形成。你可以假设网格的四个边均被水包围。

### 核心思路

1. 扫描：像扫描仪一样遍历每一个格点。

2. 触发搜索：遇到 '1' 时，说明找到了一个岛屿。

3. 消除影响：为了不重复计算同一个岛屿，必须在发现它的瞬间，通过 DFS 把这个岛屿所有的土地全部标记为 '0'。这就像是在地图上把发现的岛屿“涂黑”。

4. 计数：触发 DFS 的次数，就是岛屿的总数。

### 代码实现

```go
func numIslands(grid [][]byte) int {
    if len(grid) == 0 {
        return 0
    }

    m, n := len(grid), len(grid[0])
    count := 0

    // 遍历整个网格
    for i := 0; i < m; i++ {
        for j := 0; j < n; j++ {
            // 如果发现陆地
            if grid[i][j] == '1' {
                dfs(grid, i, j)
                // 发现一个岛屿，计数加 1
                count++
            }
        }
    }

    return count
}

func dfs(grid [][]byte, i, j int) {
    m, n := len(grid), len(grid[0])

    // 越界检查或遇到水（'0'），直接返回
    if i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == '0' {
        return
    }

    // 标记当前陆地已被访问（淹没），防止死循环
    grid[i][j] = '0'

    // 向四个方向扩散
    dfs(grid, i+1, j) // 下
    dfs(grid, i-1, j) // 上
    dfs(grid, i, j+1) // 右
    dfs(grid, i, j-1) // 左
}
```

### 复杂度分析
- 时间复杂度：$O(M * N)$，其中 M 和 N 分别是网格的行数和列数。每个格点最多被访问一次。
- 空间复杂度：$O(M * N)$，在最坏情况下，递归栈的深度可能达到 M * N。

## [994. 腐烂的橘子 - Mid](https://leetcode-cn.com/problems/rotting-oranges/)

### 题目回顾
> 在给定的网格中，每个单元格可以有以下三个值之一：
> - 值 0 代表空单元格；
> - 值 1 代表新鲜橘子；
> - 值 2 代表腐烂的橘子。
> 每分钟，任何与腐烂橘子（在 4 个正方向上相邻）的新鲜橘子都会腐烂。
> 返回直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 -1。

### 核心思路

1. 为什么是 BFS 而不是 DFS？
DFS 会一路深入，难以计算“最短时间”或“同步扩散”。而 BFS 就像是往水里丢石头产生的涟漪，每一圈代表一分钟。层序遍历 保证了我们找到的是最短传播路径。

2. 终止条件
成功：freshCount == 0，所有橘子都烂了。

失败：队列空了但 freshCount > 0，说明有些橘子被隔离了。

### 代码实现

```go
func orangesRotting(grid [][]int) int {
    m, n := len(grid), len(grid[0])
    freshCount := 0
    queue := [][]int{}

    // 1. 扫描网格，记录新鲜橘子数量并将腐烂橘子入队
    for r := 0; r < m; r++ {
        for c := 0; c < n; c++ {
            if grid[r][c] == 1 {
                freshCount++
            } else if grid[r][c] == 2 {
                queue = append(queue, []int{r, c})
            }
        }
    }

    // 如果一开始就没有新鲜橘子，直接返回 0
    if freshCount == 0 {
        return 0
    }

    minutes := 0
    // 方向数组：上下左右
    dirs := [][]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

    // 2. 开始 BFS 扩散
    for len(queue) > 0 && freshCount > 0 {
        minutes++
        // 记录当前层的橘子数量
        size := len(queue)
        for i := 0; i < size; i++ {
            curr := queue[0]
            queue = queue[1:]

            r, c := curr[0], curr[1]
            for _, d := range dirs {
                nr, nc := r+d[0], c+d[1]
                // 如果相邻的是新鲜橘子
                if nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1 {
                    grid[nr][nc] = 2 // 变腐烂
                    freshCount--    // 新鲜橘子减少
                    queue = append(queue, []int{nr, nc})
                }
            }
        }
    }

    // 3. 如果还有新鲜橘子剩下来，说明无法全部腐烂，返回 -1
    if freshCount > 0 {
        return -1
    }
    return minutes
}
```
### 复杂度分析

- 时间复杂度：$O(M * N)$，其中 M 和 N 分别是网格的行数和列数。每个格点最多被访问一次。
- 空间复杂度：$O(M * N)$，在最坏情况下，队列中可能存储所有的橘子。

## [207. 课程表 - Mid](https://leetcode-cn.com/problems/course-schedule/)

### 题目回顾
> 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。
> 在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。
> 例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
> 请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。

### 核心思路

通用的解法是 Kahn 算法（广度优先搜索实现的拓扑排序）。它的核心逻辑是：不断消除入度为 0 的节点（即没有先修课限制的课程），如果最后所有课程都能被消除，说明图中没有环，可以修完。

1. 关键概念
入度 (In-degree)：指向该节点的边的数量。在本项目中，代表“还需要修多少门先修课”。

出边 (Out-degree/Adjacency)：该节点指向其他节点的边。代表“修完这门课后，哪些课的限制会减少”。

2. 执行流程
找起点：入度为 0 的课是安全的，可以直接上。

拆边：上一门课，就把由它发出的所有边删掉（即减少后继课的入度）。

循环：如果在这个过程中产生了新的入度为 0 的课，继续重复。

判定：如果图中存在环，环上的节点入度永远不会减到 0。

### 代码实现

```go
func canFinish(numCourses int, prerequisites [][]int) bool {
    // 1. 初始化入度数组和邻接表
    inDegree := make([]int, numCourses)
    adjacency := make([][]int, numCourses)

    for _, pre := range prerequisites {
        course, preCourse := pre[0], pre[1]
        inDegree[course]++
        adjacency[preCourse] = append(adjacency[preCourse], course)
    }

    // 2. 将所有入度为 0 的课程放入队列
    queue := make([]int, 0)
    for i := 0; i < numCourses; i++ {
        if inDegree[i] == 0 {
            queue = append(queue, i)
        }
    }

    // 已学习的课程数量
    count := 0

    // 3. 开始 BFS 拓扑排序
    for len(queue) > 0 {
        curr := queue[0]
        queue = queue[1:]
        count++

        // 遍历当前课程的所有后继课程
        for _, nextCourse := range adjacency[curr] {
            inDegree[nextCourse]--
            // 如果后继课程的入度减为 0，说明先修课都上完了，入队
            if inDegree[nextCourse] == 0 {
                queue = append(queue, nextCourse)
            }
        }
    }

    // 4. 如果学完的课程等于总课程数，说明无环
    return count == numCourses
}
```

### 复杂度分析
- 时间复杂度：$O(V + E)$，其中 V 是课程数（节点），E 是先修关系数（边）。
- 空间复杂度：$O(V + E)$，用于存储入度数组和邻接表。

## [208. 实现 Trie (前缀树) - Mid](https://leetcode-cn.com/problems/implement-trie-prefix-tree/)

### 题目回顾

Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 Trie 类：

Trie() 初始化前缀树对象。
void insert(String word) 向前缀树中插入字符串 word 。
boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。


### 核心思路

利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较。它是一种典型的“空间换时间”的数据结构。

1. 节点结构
每个节点包含：

children：一个指向子节点的指针数组。数组的索引 0-25 分别代表字母 a-z。

isEnd：布尔值，表示从根到当前节点的路径是否构成了一个完整的单词。

2. 插入 (Insert)
从根节点开始，根据单词的字符顺序沿树向下。如果子节点不存在，则创建一个新的 Trie 节点。最后将末尾节点的 isEnd 设为 true。

3. 搜索 (Search vs StartsWith)
StartsWith：只要路径中每一个字符都能在树中找到对应的节点，就返回 true。

Search：不仅要路径匹配，最后一个字符所在的节点还必须满足 isEnd == true。

### 代码实现

```go
type Trie struct {
    children [26]*Trie
    isEnd    bool
}

// Constructor 初始化 Trie
func Constructor() Trie {
    return Trie{}
}

// Insert 向前缀树中插入一个单词
func (this *Trie) Insert(word string) {
    node := this
    for _, ch := range word {
        index := ch - 'a'
        if node.children[index] == nil {
            node.children[index] = &Trie{}
        }
        node = node.children[index]
    }
    // 标记该节点为一个单词的结尾
    node.isEnd = true
}

// Search 查找单词是否存在
func (this *Trie) Search(word string) bool {
    node := this.searchPrefix(word)
    return node != nil && node.isEnd
}

// StartsWith 查找是否存在以 prefix 为前缀的单词
func (this *Trie) StartsWith(prefix string) bool {
    return this.searchPrefix(prefix) != nil
}

// 辅助函数：根据前缀进行搜索，返回最后一个匹配的节点
func (this *Trie) searchPrefix(prefix string) *Trie {
    node := this
    for _, ch := range prefix {
        index := ch - 'a'
        if node.children[index] == nil {
            return nil
        }
        node = node.children[index]
    }
    return node
}
```
### 复杂度分析

- 时间复杂度：
  - Insert：$O(m)$，其中 m 是插入单词的长度。
  - Search 和 StartsWith：$O(m)$，其中 m 是查询单词或前缀的长度。
- 空间复杂度：$O(m)$，在最坏情况下，插入一个长度为 m 的单词需要创建 m 个新节点。

---

> 作者:   
> URL: https://amemiya02.github.io/posts/2026-02-03-graph/  

