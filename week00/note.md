1. 编写一个 DOM 编辑器：可以自由地操作一个 iframe（空白）中的 DOM 结构，包括增、删、移动。(**客户端API**)

   

2. 讲讲 [position float display](https://medium.com/@mautayro/understanding-css-position-display-float-87f9727334b2) 各有哪些取值，它们互相之间会如何影响？(**CSS**)

   ##### position

   1. position属性取值：static(默认)、relative、absolute、fixed、sticky、inherit。
   2. postision：static；始终处于文档流给予的位置。看起来好像没有用，但它可以快速取消定位，让top，right，bottom，left的值失效。在切换的时候可以尝试这个方法。

   3. 除了static值，在其他三个值的设置下，z-index才会起作用。（确切地说z-index只在定位元素上有效） 
   4. position：relative和absolute都可以用于定位，区别在于前者的div还属于正常的文档流，后者已经是脱离了正常文档流，不占据空间位置，不会将父类撑开。定位原点relative是相对于它在正常流中的默认位置偏移，它原本占据的空间任然保留；absolute相对于第一个position属性值不为static的父类。所以设置了position：absolute，其父类的该属性值要注意，而且overflow：hidden也不能乱设置，因为不属于正常文档流，不会占据父类的高度，也就不会有滚动条。
   5. fixed旧版本IE不支持，却是很有用，定位原点相对于浏览器窗口，而且不能变。常用于header，footer，或者一些固定的悬浮div，随滚动条滚动又稳定又流畅，比JS好多了。fixed可以有很多创造性的布局和作用，兼容性是问题。
   6. sticky，元素相对定位，直到通过滚动达到指定的偏移位置为止，然后将元素“固定”定位在滚动元素上的该位置。
   7. position：inherit。规定从父类继承position属性的值，所以这个属性也是有继承性的。但是任何版本的IE都不支持该属性值。

   ##### float

   1. float属性取值：none(默认)、left、right、inherit。

   2. float：left(或right)，向左（或右）浮动，直到它的边缘碰到包含框或另一个浮动框为止。且脱离普通的文档流，会被正常文档流内的块框忽略。不占据空间，无法将父类元素撑开。

   3. 任何元素都可以浮动，浮动元素会生成一个块级框，不论它本身是何种元素。因此，没有必要为浮动元素设置display：block。

   4. 如果浮动非替换元素，则要指定一个明确的width，否则它们会尽可能的窄。（什么叫替换元素？根据元素本身的特点定义的， (X)HTML中的img、input、textarea、select、object都是替换元素，这些元素都没有实际的内容。 (X)HTML 的大多数元素是不可替换元素，他们将内容直接告诉浏览器，将其显示出来。）

   ##### display

   1. display属性取值：none、inline、inline-block、block、grid、flex、inherit。

   2. display属性规定元素应该生成的框的类型。文档内任何元素都是框，块框或行内框。

   3. display：none和visiability：hidden都可以隐藏div，区别有点像absolute和relative，前者不占据文档的空间，后者还是占据文档的位置。

   4. display: blocak，元素从新行开始并占据整个宽度。 可能包含其他块或内联元素。 默认情况下，块级元素包括<div>，<p>，<h1>-<h6>，<ul>，<li>和<canvas>。

   5. display: inline，以水平方式布局，垂直方向的margin和padding都是无效的，大小跟内容一样，且无法设置宽高。inline就像塑料袋，内容怎么样，就长得怎么样；block就像盒子，有固定的宽和高。

   6. inline-block就介于两者之间。元素以行内显示，但可以定义高度和宽度。 也可以与grid，flex或table一起使用，因为它们是块级元素。

   7. grid 元素以块级显示，内部内容以网格布局显示。

   8. flex 元素以块级显示，内部内容以flexbox布局显示。

      

3. JavaScript 启动后，内存中有多少个对象？如何用代码来获得这些信息？(Javascript API)

   [JavaScript标准内置对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)

   

4. HTML 的中，如何写一个值为 “a”=‘b’ 的属性值？(**Html**)

   ```html
   &quot;a&quot;=&#39;b&#39;
   ```



5. 编写一个快速排序代码，并且用动画演示它的过程。(**算法+动画**)

``` javascript
	let numbers = [3,1,20,5,4,9,7,10,6];
	for (let i = 0; i < numbers.length; i++) {
		for (let j = i + 1; j < numbers.length; j++) {
			if (numbers[i] < numbers[j]) { 
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
			}
		}
	}
	console.log(numbers);
```