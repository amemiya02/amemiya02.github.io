# [Golang] LeetCode 热题 100 - 滑动窗口

# 滑动窗口

## [3. 无重复字符的最长子串 - Mid](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

### 题目回顾

> 给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。

**示例 1:**

**输入:** `s = "abcabcbb"`
**输出:** `3`
**解释:** 因为无重复字符的最长子串是 `"abc"`，所以其长度为 3。

**示例 2:**

**输入:** `s = "pwwkew"`
**输出:** `3`
**解释:** 因为无重复字符的最长子串是 `"wke"`，所以其长度为 3。
请注意，你的答案必须是 **子串** 的长度，`"pwke"` 是一个子序列，不是子串。

### 核心思路：滑动窗口

这道题要求我们找到一个**连续**的子串，这个子串需要满足"无重复字符"的条件，并且长度要最长。这种在连续区间上求解的问题，非常适合使用**滑动窗口**算法。

我们可以想象有一个窗口在字符串 `s` 上滑动，窗口的左右边界由两个指针 `left` 和 `right` 决定。这个窗口 `s[left...right]` 就代表了我们正在考察的当前子串。

1. **数据结构选择**：我们需要一个数据结构来快速判断窗口内是否存在重复字符。**哈希集合 (HashSet)** 是不二之选，它可以在 $O(1)$ 的时间内添加、删除和查找元素。

2. **窗口的移动逻辑**：
    * **扩大窗口**：我们不断地移动右指针 `right`，将新的字符纳入窗口中。
    * **缩小窗口**：当新加入的字符 `s[right]` 已经在哈希集合中存在时，说明窗口内出现了重复。此时，我们必须从左侧开始缩小窗口，即不断地移动左指针 `left` 并从哈希集合中移除 `s[left]`，直到窗口内不再包含重复的 `s[right]` 为止。

3. **算法步骤**：
    * 初始化左指针 `left = 0`，右指针 `right = 0`，最大长度 `maxLength = 0`，以及一个空的哈希集合 `set`。
    * 右指针 `right` 开始遍历整个字符串：
        a.  获取当前右指针的字符 `c = s.charAt(right)`。
        b.  **检查重复**：在 `set` 中检查是否存在字符 `c`。如果存在，就进入一个循环，不断从 `set` 中移除左指针 `left` 指向的字符，并递增 `left`，直到 `set` 中不再有 `c`。
        c.  **添加新字符**：将当前字符 `c` 添加到 `set` 中。
        d.  **更新最大长度**：此时，从 `left` 到 `right` 的窗口内一定是无重复字符的。我们更新最大长度：`maxLength = Math.max(maxLength, right - left + 1)`。
        e.  将右指针 `right` 右移一位，考察下一个字符。
    * 遍历结束后，`maxLength` 就是最终答案。

通过这种一扩一缩的动态调整，滑动窗口能够保证在一次遍历中就找到最优解。

### 代码实现

```go
func lengthOfLongestSubstring(s string) int {
    n := len(s)
    left, right := 0, 0
    ans := 0
    countMap := make(map[byte]struct{})
    for right < n {
        // 如果 set 中已存在当前字符，说明窗口需要从左侧收缩
        for {
            _, ok := countMap[s[right]]
            if ok {
                delete(countMap, s[left])
                left++
                continue
            }
            break
        }
        // 不存在 就添加 更新长度大小
        countMap[s[right]] = struct{}{}
        length := right - left + 1
        if length > ans {
            ans = length
        }
        right++
    }
    return ans
}

```

**复杂度分析**

* 时间复杂度: $O(n)$。虽然代码中有一个 for 循环嵌套一个 while 循环，但每个字符最多被左指针 left 和右指针 right 访问一次。因此，总的操作次数是线性的，而不是二次方。
* 空间复杂度: $O(k)$。其中 k 是字符串中不同字符的数量（即字符集的大小）。哈希集合在最坏情况下需要存储 k 个字符。对于 ASCII 字符集，k 最多为 128，可以看作是 $O(1)$。

### 优化后的代码

如果当前的字符出现过，我们可以直接将左指针跳到上次出现该字符的下一个位置，而不是一个一个地移动左指针，这样就需要用数组记录一下最后出现的位置+1，方便跳转。

```go

func lengthOfLongestSubstring(s string) int {
    n := len(s)
    if n <= 1 {
        return n
    }

    // 使用数组记录字符最后出现的位置 + 1（默认为 0 表示没出现过）
    // 128 足以覆盖标准 ASCII 字符
    lastOccur := [128]int{}
    ans := 0
    left := 0

    for right := 0; right < n; right++ {
        char := s[right]

        // 如果该字符出现过，且其上次出现的位置在当前窗口 [left, right] 内
        if lastOccur[char] > left {
            // 直接跳过重复部分，更新左边界
            left = lastOccur[char]
        }

        // 计算当前窗口长度
        if right-left+1 > ans {
            ans = right - left + 1
        }

        // 记录当前字符的下一个位置，方便 left 直接跳转
        lastOccur[char] = right + 1
    }

    return ans
}
```

## [438. 找到字符串中所有字母异位词 - Mid](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

### 题目回顾

> 给定两个字符串 `s` 和 `p`，找到 `s` 中所有 `p` 的 **字母异位词** 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。
>
> **字母异位词** 指由相同字母按不同顺序排列组成的字符串。

**示例 1:**

**输入:** `s = "cbaebabacd"`, `p = "abc"`
**输出:** `[0,6]`
**解释:**
起始索引等于 0 的子串是 `"cba"`, 它是 `"abc"` 的异位词。
起始索引等于 6 的子串是 `"bac"`, 它是 `"abc"` 的异位词。

## 核心思路：定长滑动窗口 + 字符频率统计

这道题要求我们在一个长字符串 `s` 中，找出所有与短字符串 `p` 构成字母异位词的**子串**。

"字母异位词"的判断标准是：两个字符串长度相等，且包含的字符种类和数量完全相同。这提示我们，核心在于**字符频率的比较**。

"找出所有...的子串"则强烈地暗示了**滑动窗口**算法。由于 `p` 的长度是固定的，我们可以使用一个**大小固定**的滑动窗口来遍历 `s`。

结合以上两点，我们的解题策略就清晰了：

1. **统计 `p` 的频率**：首先，我们需要一个"标准答案"，也就是字符串 `p` 的字符频率分布。因为题目只包含小写字母，我们可以用一个长度为 26 的数组 `countP` 来存储。

2. **创建固定大小的窗口**：我们在 `s` 上维护一个长度与 `p` 相同的滑动窗口。我们同样用一个长度为 26 的数组 `countS` 来实时统计这个窗口内的字符频率。

3. **滑动与比较**：
    * **初始化**：先统计 `s` 中第一个窗口（即 `s[0...p.length()-1]`）的字符频率到 `countS` 中，并与 `countP` 比较。如果两者完全相同，那么索引 `0` 就是一个答案。
    * **滑动**：将窗口向右滑动一格。这个过程非常高效，我们不需要重新统计整个窗口，只需要：
        * **减去**移出窗口的左侧字符的频率。
        * **加上**进入窗口的右侧新字符的频率。
    * **比较**：每次滑动后，都将更新后的 `countS` 与 `countP` 进行比较。如果相同，就记录下当前窗口的起始索引。

4. **收集结果**：重复滑动和比较的过程，直到窗口滑动到 `s` 的末尾，我们就找到了所有答案。

### 代码实现

```go

func findAnagrams(s string, p string) []int {
    sLen, pLen := len(s), len(p)
    if sLen < pLen {
        return []int{}
    }

    var res []int
    // 使用数组代替 map，性能更高
    var pCount, sCount [26]int

    // 1. 初始化统计 p 的字符和 s 的第一个窗口
    for i := 0; i < pLen; i++ {
        pCount[p[i]-'a']++
        sCount[s[i]-'a']++
    }

    // 2. 比较第一个窗口
    if sCount == pCount {
        res = append(res, 0)
    }

    // 3. 开始滑动窗口
    // i 是新进入窗口的字符索引，i - pLen 是要滑出窗口的字符索引
    for i := pLen; i < sLen; i++ {
        sCount[s[i]-'a']++      // 右边界移入
        sCount[s[i-pLen]-'a']-- // 左边界移出

        // Go 数组支持直接 == 比较，复杂度为 $O(26)$
        if sCount == pCount {
            res = append(res, i-pLen+1)
        }
    }

    return res
}


```

**复杂度分析**

* 时间复杂度: $O(N)$。
* 空间复杂度: $O(1)$。


---

> 作者:   
> URL: https://amemiya02.github.io/posts/2026-01-25-sliding-window/  

