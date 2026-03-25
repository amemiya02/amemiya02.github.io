# [Python] LeetCode 热题 100 - 矩阵


# 矩阵

## [73. 矩阵置零 - Mid](https://leetcode.cn/problems/set-matrix-zeroes/)

### 题目回顾

> 给定一个 `m x n` 的矩阵，如果一个元素为 `0` ，则将其所在行和列的所有元素都设为 `0` 。请使用 **原地** 算法。

---

### 核心思路：利用首行首列做标记（O(1) 空间）

关键在于避免“污染问题”。

#### 算法步骤

1. 记录第一行、第一列是否有 0
2. 用第一行和第一列做标记
3. 根据标记处理内部
4. 最后处理首行首列

---

### Python 实现

```python
def setZeroes(matrix):
    if not matrix:
        return

    m, n = len(matrix), len(matrix[0])

    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))

    # 标记
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0

    # 置零内部
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0

    # 处理首行
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0

    # 处理首列
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
````

**复杂度分析**

* 时间复杂度: $O(mn)$
* 空间复杂度: $O(1)$

---

## [54. 螺旋矩阵 - Mid](https://leetcode.cn/problems/spiral-matrix/)

### 核心思路：四边界模拟

维护四个边界：`top, bottom, left, right`

---

### Python 实现

```python
def spiralOrder(matrix):
    if not matrix or not matrix[0]:
        return []

    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while True:
        # 左 -> 右
        for j in range(left, right + 1):
            res.append(matrix[top][j])
        top += 1
        if top > bottom:
            break

        # 上 -> 下
        for i in range(top, bottom + 1):
            res.append(matrix[i][right])
        right -= 1
        if left > right:
            break

        # 右 -> 左
        for j in range(right, left - 1, -1):
            res.append(matrix[bottom][j])
        bottom -= 1
        if top > bottom:
            break

        # 下 -> 上
        for i in range(bottom, top - 1, -1):
            res.append(matrix[i][left])
        left += 1
        if left > right:
            break

    return res
```

**复杂度分析**

* 时间复杂度: $O(mn)$
* 空间复杂度: $O(1)$（不算输出）

---

## [48. 旋转图像 - Mid](https://leetcode.cn/problems/rotate-image/)

### 核心思路：转置 + 行翻转

1. 转置
2. 每一行翻转

---

### Python 实现

```python
def rotate(matrix):
    n = len(matrix)

    # 转置
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    # 每行翻转
    for i in range(n):
        matrix[i].reverse()
```

**复杂度分析**

* 时间复杂度: $O(n^2)$
* 空间复杂度: $O(1)$

---

## [240. 搜索二维矩阵 II - Mid](https://leetcode.cn/problems/search-a-2d-matrix-ii/)

### 核心思路：从左下角开始搜索

利用：

* 行递增
* 列递增

---

### Python 实现

```python
def searchMatrix(matrix, target):
    if not matrix or not matrix[0]:
        return False

    m, n = len(matrix), len(matrix[0])

    i, j = m - 1, 0  # 左下角

    while i >= 0 and j < n:
        if matrix[i][j] == target:
            return True
        elif matrix[i][j] > target:
            i -= 1
        else:
            j += 1

    return False
```

**复杂度分析**

* 时间复杂度: $O(m + n)$
* 空间复杂度: $O(1)$



---

> 作者: Amemiya  
> URL: https://amemiya02.github.io/posts/2026-03-25-matrix/  

