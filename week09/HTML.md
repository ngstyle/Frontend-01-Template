# HTML语义&DOM

### HTML 基本语法

![](https://static001.geekbang.org/resource/image/b6/bc/b6fdf08dbe47c837e274ff1bb6f630bc.jpg)

DTD 规定了 HTML 包含了哪些标签、属性和文本实体, 所谓文本实体定义就是类似以下的代码:

```html
&lambda;
&lt;
&nbsp;
&gt;
&amp;
```

每一个文本实体由&开头，由;结束，这属于基本语法的规定，文本实体可以用#后跟一个十进制数字，表示字符 Unicode 值。除此之外这两个符号之间的内容，则由 DTD 决定。

DTD 在 HTML4.01 和之前都非常的复杂，到了 HTML5，抛弃了 SGML 兼容，变成简单的。



### 语义类标签是什么，使用它有什么好处？

语义类标签也是大家工作中经常会用到的一类标签，它们的特点是视觉表现上互相都差不多，主要的区别在于它们表示了不同的语义，比如大家会经常见到的 section、nav、p，这些都是语义类的标签。不过，在很多工作场景里，语义类标签也有它们自己无可替代的优点。正确地使用语义标签可以带来很多好处。

- 作为自然语言延伸的语义类标签 - 用来表达一定的结构或者消除歧义

- 作为标题摘要的语义类标签

  ```html
  
  例如：
  
  <h1>HTML语义</h1>
  <p>balah balah balah balah</p>
  <h2>弱语义</h2>
  <p>balah balah</p>
  <h2>结构性元素</h2>
  <p>balah balah</p>
  ......
  ```

  

- 作为整体结构的语义类标签

  ```html
  <body>
      <header>……</header>
      <article>
          <header>……</header>
          <section>……</section>
          <section>……</section>
          <section>……</section>
          <footer>……</footer>
      </article>
      <article>
          ……
      </article>
      <article>
          ……
      </article>
      <footer>
          <address></address>
      </footer>
  </body>
  ```

  

### DOM API

DOM(document object modal )文档对象模型是用来描述文档，这里的文档，特指 HTML 文档（也用于 XML 文档）。同时它又是一个“对象模型”，这意味着它使用的是对象这样的概念来描述 HTML 文档。HTML 文档是一个由标签嵌套而成的树形结构，DOM 使用树形的对象模型来描述一个 HTML 文档，DOM API 大致会包含 4 个部分：

- 节点：DOM 树形结构中的节点相关 API

- 事件：触发和监听事件相关 API

- Range：操作文字范围相关 API

- 遍历：遍历 DOM 需要的 API



#### 节点(Node)

![](https://static001.geekbang.org/resource/image/6e/f6/6e278e450d8cc7122da3616fd18b9cf6.png)

在这些节点中，除了 Document 和 DocumentFrangment，都有与之对应的 HTML 写法：

```html
Element: <tagname>...</tagname>
Text: text
Comment: <!-- comments -->
DocumentType: <!Doctype html>
ProcessingInstruction: <?a 1?>
```

Node 提供了一组属性，来查询父、子，兄弟节点/元素API：

|              | 节点            | 元素                   |
| ------------ | --------------- | ---------------------- |
| 父           | parentNode      | parentElement          |
| 子           | childNodes      | children               |
| 第一个       | firstChild      | firstElementChild      |
| 最后一个     | lastChild       | lastElementChild       |
| (当前)后一个 | nextSibling     | nextElementSibling     |
| (当前)前一个 | previousSibling | previousElementSibling |

和一组API来增删替换节点：

- appendChild
- insertBefore
- removeChild
- replaceChild

**所有这几个修改型的 API，全都是在父元素上操作的，比如我们要想实现“删除一个元素的上一个元素”，必须要先用 parentNode 获取其父元素。**

除此之外，Node 还提供了一些高级 API：

- compareDocumentPosition 用于比较两个节点中关系的函数
- contains 检查一个节点是否包含另一个节点的函数
- isEqualNode 检查两个节点是否完全相同
- isSameNode 检查两个节点是否是同一个节点，实际上在 JavaScript 中可以用“===”
- cloneNode 复制一个节点，如果传入参数 true，则会连同子元素做深拷贝

DOM 标准规定了节点必须从文档的 create 方法创建出来，不能够使用原生的 JavaScript 的 new 运算。于是 document 对象有这些方法:

- createElement
- createTextNode
- createComment
- createProcessingInstruction
- createDocumentFragment
- createDocumentType

### Element 与 Attribute

Node 提供了树形结构上节点相关的操作。大部分时候，我们更关注元素。Element 表示元素，它是 Node 的子类。元素对应了 HTML 中的标签，它既有子节点，又有属性。所以 Element 子类中，有一系列操作属性的方法。

getElementById、getElementsByName、getElementsByTagName、getElementsByClassName，这几个 API 的性能高于 querySelector。

getElementsByName、getElementsByTagName、getElementsByClassName 获取的集合并非数组，而是一个能够动态更新的集合

所有Element 都可以调用 getElementsByTagName 方法， 但是只有document能调用 getElementsByName 方法