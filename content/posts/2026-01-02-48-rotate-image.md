---
title: "【HOT100/矩阵】LeetCode 48. 旋转图像"
date: 2026-01-02 22:15:00 +0900
categories: [算法, LeetCode]
tags: [数组, 矩阵, 数学]
---

## 题目回顾

> 给定一个 `n × n` 的二维矩阵 `matrix` 表示一个图像。请你将图像顺时针旋转 90 度。
>
> 你必须在 **原地** 旋转图像，这意味着你需要直接修改输入的二维矩阵。**请不要** 使用另一个矩阵来旋转图像。

**示例 1：**


**输入：** `matrix = [[1,2,3],[4,5,6],[7,8,9]]`
**输出：** `[[7,4,1],[8,5,2],[9,6,3]]`

**示例 2：**

**输入：** `matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]`
**输出：** `[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]`

## 核心思路：数学变换

这道题最直接的思路是找出每个元素旋转后的坐标规律。对于一个坐标为 `(i, j)` 的元素，顺时针旋转 90 度后，它的新位置是 `(j, n-1-i)`。
如果直接模拟这个过程，我们需要小心翼翼地进行四角交换，逻辑容易出错。

更优雅的解法是利用矩阵运算的性质。顺时针旋转 90 度可以拆解为两步简单的变换：

1.  **转置 (Transpose)**：将矩阵的行列互换（沿对角线翻转）。
    * `matrix[i][j]` $\leftrightarrow$ `matrix[j][i]`
2.  **水平镜像 (Reverse Rows)**：将每一行左右翻转。
    * `matrix[i][j]` $\leftrightarrow$ `matrix[i][n-1-j]`

**演示过程：**

假设输入为：
```text
1 2 3
4 5 6
7 8 9
```

第一步：转置（对角线翻转）
```text
1 4 7
2 5 8
3 6 9
```
第二步：每行左右翻转

```text
7 4 1
8 5 2
9 6 3
```
我们可以看到，结果正好是顺时针旋转 90 度的样子。这种方法代码非常简洁且不易出错。

## 代码实现 (Java)
```Java

class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        if (n == 0) {
            return;
        }

        // 第一步：转置矩阵 (Transpose)
        // 只需要遍历对角线右上方的元素即可，避免重复交换
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                swap(matrix, i, j);
            }
        }

        // 第二步：沿垂直轴翻转每一行 (Reflect)
        // 每一行只需要遍历到中间位置
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n / 2; j++) {
                swap2(matrix, i, j);
            }
        }
    }

    // 辅助方法：交换矩阵中两个坐标的值 (用于转置)
    // matrix[i][j] <-> matrix[j][i]
    private void swap(int[][] matrix, int i, int j) {
        int temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
    }

    // 辅助方法：交换同一行中对称位置的值 (用于左右翻转)
    // matrix[i][j] <-> matrix[i][n - j - 1]
    private void swap2(int[][] matrix, int i, int j) {
        int n = matrix.length;
        int temp = matrix[i][j];
        matrix[i][j] = matrix[i][n - j - 1];
        matrix[i][n - j - 1] = temp;
    }
}
```
## 复杂度分析

- 时间复杂度: $O(N^2)$。

- 空间复杂度: O(1)。我们是原地修改矩阵，没有使用额外的存储空间。
