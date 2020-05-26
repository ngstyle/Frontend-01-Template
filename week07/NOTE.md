# 每周总结可以写在这里

keywords:

> postcss
>
> rem @keyframes 
> rem vw 误差			vm 兼容
> @midea print
> css-next
> rax和rpx 单位
> http://www.html-js.com/article/2402
>
> not 属性选择器(包含、起始)
> dpi/dpr
> viewport
> :root CSS 变量
> requestAnimationFram和requestIdleCallback是在哪个阶段执行的
> 跨域
> Canvas
>
> GraphQL
> AR 3d框架 webGL	



1. CSS 语法

   https://www.w3.org/TR/CSS22/

   https://www.w3.org/TR/css-syntax-3/

2. CSS @规则的研究

   https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule

3. CSS 规则的结构

   - Selector
     - https://www.w3.org/TR/selectors-3/
     - https://www.w3.org/TR/selectors-4/
   - Key
     - Properties
       - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference
       - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference
       - https://www.w3.org/TR/CSS22/propidx.html
       
     - Variables
     
       - https://www.w3.org/TR/css-variables/
   - Value
     - https://www.w3.org/TR/css-values-4/
     - https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units

4. 初建CSS 知识体系



### 收集CSS 标准

1. 访问 https://www.w3.org/TR/?tag=css，通过下面的代码获取分散的 CSS 标准

```javascript
const standards = [];
[...document.getElementById('container').children]
  .filter((e) => e.getAttribute('data-tag').includes('css'))
  .forEach((e) => {
    standards.push({
      tag: e.getAttribute('data-tag'),
      profile: e.children[0].innerText,
      name: e.children[1].innerText,
      url: e.children[1].children[0].href,
    });
  });
  JSON.stringify(standards,null,2);
```

2. 针对单个标准链接获取详情
```javascript
let iframe = document.createElement('iframe');
document.body.innerHTML = '';
document.body.appendChild(iframe);

function happen(element, event) {
  return new Promise(function (resolve) {
    let handler = () => {
      resolve();
      element.removeEventListener(event, handler);
    };
    element.addEventListener(event, handler);
  });
}

void (async function () {
  for (let standard of standards) {
    iframe.src = standard.url;
    console.log(standard.name);
    await happen(iframe, 'load');
  }
})();
```

