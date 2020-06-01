# 每周总结可以写在这里

### keywords

CSS BEM 规范

https://tech.yandex.com/bem/

http://getbem.com/introduction/

01：32     01：47

关于命名规范

winter: CSS 是依赖HTML 来, 根据HTML 语义化标签选择器选中; 而不用反过来HTML css属性名依赖选择器

取其精华去其糟粕,何为精华,根据使用场景取舍

**团队最重要的是统一**



### 思考

first-line 没有float ？

脱离文档流，下一行顶上去，矛盾。



first-line 可以改变字体， 会改变这一行的文字，为什么可以设置？实现机制

不是算好哪些文字在first-line 再套上css, 而是排版过程中把first-line 相关属性直接加在文字上，不是作用于盒。



[Vertical-Align: All You Need To Know](https://christopheraue.net/design/vertical-align)

base-line **vertical-align**: top/bottom/middle/text-top/text-bottom 



api: getClientReacts()



[Understanding CSS Layout And The Block Formatting Context](https://www.smashingmagazine.com/2017/12/understanding-css-layout-block-formatting-context/)

[css进阶之十三：margin合并与margin无效](https://zhyjor.github.io/2018/06/26/css进阶之十三：margin崩塌/)

**margin 折叠**只发生在BFC中

**block-level box/block-container/block box**

> inline-block:可以当两部分看，对外面的它的兄弟节点来说，他是一个inline元素，对它包含的元素来说，他是一个可以包含block的container，建立BFC



block-level : all except inline-*,run-in

block-container：block inline-block....

block-level&block-container: block    <block-box>

> block-level 表示可以被放入bfc
> block-container 表示可以容纳bfc
> block-box = block-level + block-container
> block-box 如果 overflow 是 visible， 那么就跟父bfc合并





flex-grow,flex-shrink,flex-basis
