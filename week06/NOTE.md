# 每周总结可以写在这里

[Design and Analysis of Algorithms](https://www.ics.uci.edu/~eppstein/161/960222.html)

[Boyer Moore Algorithm for Pattern Searching](https://www.geeksforgeeks.org/boyer-moore-algorithm-for-pattern-searching/?ref=lbp)

[Finite Automata algorithm for Pattern Searching](https://www.geeksforgeeks.org/finite-automata-algorithm-for-pattern-searching/)



[How is specificity calculated?](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

一个选择器的优先级可以说是由四个部分相加 (分量)，可以认为是个十百千 — 四位数的四个位数：

1. **千位**： 如果声明在 `style` 的属性（内联样式）则该位得一分。这样的声明没有选择器，所以它得分总是1000。
2. **百位**： 选择器中包含ID选择器则该位得一分。
3. **十位**： 选择器中包含类选择器、属性选择器或者伪类则该位得一分。
4. **个位**：选择器中包含元素、伪元素选择器则该位得一分。

| **选择器**                              | **千位** | **百位** | **十位** | **个位** | 优先级 |
| --------------------------------------- | -------- | -------- | -------- | -------- | ------ |
| h1                                      | 0        | 0        | 0        | 1        | 0001   |
| h1 + p::first-letter                    | 0        | 0        | 0        | 3        | 0003   |
| li > a[href*="en-US"] > .inline-warning | 0        | 0        | 2        | 2        | 0022   |
| \#identifier                            | 0        | 1        | 0        |          | 0100   |
| 内联样式                                | 1        | 0        | 0        | 0        | 1000   |

> **注**: 通用选择器 (`*`)，组合符 (`+`, `>`, `~`, ' ')，和否定伪类 (`:not`) 不会影响优先级。
>
> **在进行计算时不允许进行进位，例如，20 个类选择器仅仅意味着 20 个十位，而不能视为 两个百位，也就是说，无论多少个类选择器的权重叠加，都不会超过一个 ID 选择器。**
>
> **通用选择器 (`*`)优先级高于继承**

![specifishity](https://specifishity.com/specifishity.png)

