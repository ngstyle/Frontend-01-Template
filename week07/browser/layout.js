function getStyle(element) {
  if (!element.style) element.style = {};

  for (const prop in element.computedStyle) {
    console.log(prop);
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    } else if (!Number.isNaN(Number(element.style[prop].toString()))) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }

  return element.style;
}

function layout(element) {
  if (!element.computedStyle) return;

  const style = getStyle(element);

  // 仅处理Flex 布局
  if (style.display !== 'flex') return;

  // 仅处理element 子节点
  let children = element.children.filter((e) => e.type === 'element');

  // 子元素order 排序
  children.sort((a, b) => (a.order || 0) - (b.order || 0));

  ['width', 'height'].forEach((val) => {
    if (style[val] === 'auto' || style[val] === '') {
      style[val] = null;
    }
  });

  // 属性默认值
  if (!style.flexDirection || style.flexDirection === 'auto')
    style.flexDirection = 'row';
  if (!style.alignItems || style.alignItems === 'auto')
    style.flexDirection = 'stretch';
  if (!style.justifyContent || style.justifyContent === 'auto')
    style.justifyContent = 'flex-start';
  if (!style.flexWrap || style.flexWrap === 'auto') style.flexWrap = 'nowrap';
  if (!style.alignContent || style.alignContent === 'auto')
    style.alignContent = 'stretch';

  let mainAxis = null;
  let crossAxis = null;
  if (style.flexDirection === 'row') {
    mainAxis = {
      dimension: 'width',
      start: 'left',
      end: 'right',
      sign: +1,
      base: 0,
    };

    crossAxis = {
      dimension: 'height',
      start: 'top',
      end: 'bottom',
    };
  } else if (style.flexDirection === 'row-reverse') {
    mainAxis = {
      dimension: 'width',
      start: 'right',
      end: 'left',
      sign: -1,
      base: style.width,
    };

    crossAxis = {
      dimension: 'height',
      start: 'top',
      end: 'bottom',
    };
  } else if (style.flexDirection === 'column') {
    mainAxis = {
      dimension: 'height',
      start: 'top',
      end: 'bottom',
      sign: +1,
      base: 0,
    };

    crossAxis = {
      dimension: 'width',
      start: 'left',
      end: 'right',
    };
  } else if (style.flexDirection === 'column-reverse') {
    mainAxis = {
      dimension: 'height',
      start: 'bottom',
      end: 'top',
      sign: -1,
      base: style.height,
    };

    crossAxis = {
      dimension: 'width',
      start: 'left',
      end: 'right',
    };
  }

  if (style.flexWrap === 'wrap-reverse') {
    [crossAxis.start, crossAxis.end] = [crossAxis.end, crossAxis.start];
    crossAxis.sign = -1;

    if (style.flexDirection.includes('row')) {
      crossAxis.base = style.height;
    } else {
      crossAxis.base = style.width;
    }
  } else {
    crossAxis.sign = 1;
    crossAxis.base = 0;
  }

  // 是否由子元素决定主轴宽/高
  let isAutoMainDimension = false;
  if (!style[mainAxis.dimension]) {
    style[mainAxis.dimension] = 0;
    for (let i = 0; i < children.length; i++) {
      const childStyle = getStyle(children[i]);
      if (
        childStyle[mainAxis.dimension] != null ||
        childStyle[mainAxis.dimension] !== void 0
      ) {
        style[mainAxis.dimension] += childStyle[mainAxis.dimension];
      }
    }
    isAutoMainDimension = true;
  }

  // flexDirection = ^row 时用来存储一行的元素
  // flexDirection = ^column 时用来存储一列的元素
  let flexLine = [];
  let flexLines = [flexLine];

  // 主轴剩余空间，交叉轴所占空间
  mainAxis.space = style[mainAxis.dimension];
  crossAxis.space = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childStyle = getStyle(children[i]);

    if (!childStyle[mainAxis.dimension]) {
      childStyle[mainAxis.dimension] = 0;
    }

    if (childStyle.flex) {
      flexLine.push(child);
    } else if (style.flexWrap === 'nowrap' && isAutoMainDimension) {
      // 元素没给宽度, 真实情况下可能100% 父级宽度
      // 这里当inline-flex 处理
      mainAxis.space -= childStyle[mainAxis.dimension];
      if (
        childStyle[crossAxis.dimension] !== null ||
        childStyle[crossAxis.dimension] === 0
      ) {
        crossAxis.space = Math.max(
          crossAxis.space,
          childStyle[crossAxis.dimension]
        );
      }
      flexLine.push(child);
    } else {
      // 子元素宽度超过父元素 (for row)
      if (childStyle[mainAxis.dimension] > style[mainAxis.dimension]) {
        childStyle[mainAxis.dimension] = style[mainAxis.dimension];
      }

      if (mainAxis.space < childStyle[mainAxis.dimension]) {
        // 起新行前给当前行/列剩余空间和交叉轴高/宽度赋值
        flexLine.mainAxisSpace = mainAxis.space;
        flexLine.crossAxisSpace = crossAxis.space;

        // 另起一行/列
        flexLine = [child];
        flexLines.push(flexLine);
        mainAxis.space = style[mainAxis.dimension];
        crossAxis.space = 0;
      } else {
        flexLine.push(child);
      }

      if (
        childStyle[crossAxis.dimension] !== null ||
        childStyle[crossAxis.dimension] === 0
      ) {
        crossAxis.space = Math.max(
          crossAxis.space,
          childStyle[crossAxis.dimension]
        );
      }

      mainAxis.space -= childStyle[mainAxis.dimension];
    }
  }
  flexLine.mainAxisSpace = mainAxis.space;
  flexLine.crossAxisSpace = crossAxis.space;
}

module.exports = layout;
