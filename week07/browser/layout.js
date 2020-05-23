function getStyle(element) {
  if (!element.style) element.style = {};

  for (const prop in element.computedStyle) {
    let formatterProp = prop.split('-').reduce((pre, curr) => {
      return pre + curr.replace(curr[0], curr[0].toUpperCase());
    });
    element.style[formatterProp] = element.computedStyle[prop].value;

    if (element.style[formatterProp].toString().match(/px$/)) {
      element.style[formatterProp] = parseInt(element.style[formatterProp]);
    } else if (!Number.isNaN(Number(element.style[formatterProp].toString()))) {
      element.style[formatterProp] = parseInt(element.style[formatterProp]);
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
    style.alignItems = 'stretch';
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
    // 换个方向
    [crossAxis.start, crossAxis.end] = [crossAxis.end, crossAxis.start];
    crossAxis.sign = -1;
    crossAxis.base = style[crossAxis.dimension];
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

  // 主轴剩余空间
  mainAxis.remainSpace = style[mainAxis.dimension];
  // 交叉轴所占空间
  crossAxis.space = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childStyle = getStyle(child);

    if (!childStyle[mainAxis.dimension]) {
      childStyle[mainAxis.dimension] = 0;
    }

    if (childStyle.flex) {
      flexLine.push(child);
    } else if (style.flexWrap === 'nowrap' && isAutoMainDimension) {
      // 元素没给宽度, 真实情况下可能100% 父级宽度
      // 这里当inline-flex 处理
      mainAxis.remainSpace -= childStyle[mainAxis.dimension];
      if (
        childStyle[crossAxis.dimension] !== null &&
        childStyle[crossAxis.dimension] !== void 0
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

      if (mainAxis.remainSpace < childStyle[mainAxis.dimension]) {
        // 起新行前给当前行/列剩余空间和交叉轴高/宽度赋值
        flexLine.mainAxisRemainSpace = mainAxis.remainSpace;
        flexLine.crossAxisSpace = crossAxis.space;

        // 另起一行/列
        flexLine = [child];
        flexLines.push(flexLine);
        mainAxis.remainSpace = style[mainAxis.dimension];
        crossAxis.space = 0;
      } else {
        flexLine.push(child);
      }

      if (
        childStyle[crossAxis.dimension] !== null &&
        childStyle[crossAxis.dimension] !== void 0
      ) {
        crossAxis.space = Math.max(
          crossAxis.space,
          childStyle[crossAxis.dimension]
        );
      }

      mainAxis.remainSpace -= childStyle[mainAxis.dimension];
    }
  }
  flexLine.mainAxisRemainSpace = mainAxis.remainSpace;

  if (style.flexWrap === 'nowrap' && isAutoMainDimension) {
    flexLine.crossAxisSpace =
      style[crossAxis.dimension] !== undefined
        ? style[crossAxis.dimension]
        : crossAxis.space;
  } else {
    flexLine.crossAxisSpace = crossAxis.space;
  }

  // 主轴剩余空间为负数
  if (mainAxis.remainSpace < 0) {
    // nowrap
    let currentBase = mainAxis.base;
    for (let i = 0; i < children.length; i++) {
      const childStyle = getStyle(children[i]);

      const scale =
        style[mainAxis.dimension] /
        (style[mainAxis.dimension] - mainAxis.remainSpace);

      // 仅处理flex 值为单个数值的情况
      if (childStyle.flex) {
        childStyle[mainAxis.dimension] = 0;
      }

      childStyle[mainAxis.dimension] *= scale;
      childStyle[mainAxis.start] = currentBase;
      childStyle[mainAxis.end] =
        childStyle[mainAxis.start] +
        mainAxis.sign * childStyle[mainAxis.dimension];

      currentBase = childStyle[mainAxis.end];
    }
  } else {
    flexLines.forEach((line) => {
      const mainAxisRemainSpace = line.mainAxisRemainSpace;
      let flexTotal = 0;

      for (let i = 0; i < line.length; i++) {
        const childStyle = getStyle(line[i]);

        // 仅处理flex 值为单个数值的情况
        if (childStyle.flex) {
          flexTotal += childStyle.flex;
        }
      }

      if (flexTotal > 0) {
        // Flexible element in this line
        let currentBase = mainAxis.base;
        for (let i = 0; i < line.length; i++) {
          const childStyle = getStyle(line[i]);

          if (childStyle.flex) {
            childStyle[mainAxis.dimension] =
              (mainAxisRemainSpace * childStyle.flex) / flexTotal;
          }

          childStyle[mainAxis.start] = currentBase;
          childStyle[mainAxis.end] =
            childStyle[mainAxis.start] +
            mainAxis.sign * childStyle[mainAxis.dimension];

          currentBase = childStyle[mainAxis.end];
        }
      } else {
        // No flexible element here, handle...
        let currentMainBase = mainAxis.base; // 起始位置
        let step = 0; // 间距
        if (style.justifyContent === 'flex-start') {
          // default
        } else if (style.justifyContent === 'flex-end') {
          currentMainBase = mainAxis.base + mainAxisRemainSpace * mainAxis.sign;
        } else if (style.justifyContent === 'center') {
          currentMainBase =
            mainAxis.base + (mainAxisRemainSpace / 2) * mainAxis.sign;
        } else if (style.justifyContent === 'space-between') {
          step = (mainAxisRemainSpace / (children.length - 1)) * mainAxis.sign;
        } else if (style.justifyContent === 'space-around') {
          step = (mainAxisRemainSpace / children.length) * mainAxis.sign;
          currentMainBase = step / 2 + mainAxis.base;
        } else if (style.justifyContent === 'space-evenly') {
          step = (mainAxisRemainSpace / (children.length + 1)) * mainAxis.sign;
          currentMainBase = step + mainAxis.base;
        }

        for (let i = 0; i < line.length; i++) {
          const childStyle = getStyle(line[i]);
          childStyle[mainAxis.start] = currentMainBase;
          childStyle[mainAxis.end] =
            childStyle[mainAxis.start] +
            mainAxis.sign * childStyle[mainAxis.dimension];
          currentMainBase = childStyle[mainAxis.end] + step;
        }
      }
    });
  }

  // computing crossAxis
  let crossAxisSpace = 0;
  if (!style[crossAxis.dimension]) {
    style[crossAxis.dimension] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      style[crossAxis.dimension] += flexLines[i].crossAxisSpace;
    }
  } else {
    crossAxisSpace = style[crossAxis.dimension];
    for (let i = 0; i < flexLines.length; i++) {
      crossAxisSpace -= flexLines[i].crossAxisSpace;
    }
  }

  // let lineSize = style[crossAxis.dimension] / flexLines.length;
  let currentCrossBase = crossAxis.base; // 交叉轴起始位置
  let step = 0;

  // 多根主轴线时生效
  if (style.alignContent === 'flex-start') {
  } else if (style.alignContent === 'flex-end') {
    currentCrossBase = crossAxis.space + crossAxisSpace * crossAxis.sign;
  } else if (style.alignContent === 'center') {
    currentCrossBase = crossAxis.space + (crossAxisSpace / 2) * crossAxis.sign;
  } else if (style.alignContent === 'space-between') {
    step = (crossAxisSpace / (flexLines.length - 1)) * crossAxis.sign;
  } else if (style.alignContent === 'space-around') {
    step = (crossAxisSpace / flexLines.length) * crossAxis.sign;
    currentCrossBase = crossAxis.space + step / 2;
  } else if (style.alignContent === 'space-evenly') {
    step = (crossAxisSpace / (flexLines.length + 1)) * crossAxis.sign;
    currentCrossBase = crossAxis.space + step;
  } else if (style.alignContent === 'stretch') {
    // 子元素设置了宽/高 无效
  }

  flexLines.forEach((line) => {
    let lineCrossSize =
      style.alignContent === 'stretch'
        ? line.crossAxisSpace + crossAxisSpace / flexLines.length
        : line.crossAxisSpace;

    for (let i = 0; i < line.length; i++) {
      let childStyle = getStyle(line[i]);

      let align = childStyle.alignSelf || style.alignItems;

      if (childStyle[crossAxis.dimension] === null)
        childStyle[crossAxis.dimension] =
          align === 'stretch' ? lineCrossSize : 0;

      if (align === 'flex-start') {
        childStyle[crossAxis.start] = currentCrossBase;
        childStyle[crossAxis.end] =
          childStyle[crossAxis.start] +
          crossAxis.sign * childStyle[crossAxis.dimension];
      } else if (align === 'flex-end') {
        childStyle[crossAxis.end] =
          currentCrossBase + crossAxis.sign * lineCrossSize;
        childStyle[crossAxis.start] =
          childStyle[crossAxis.end] -
          crossAxis.sign * childStyle[crossAxis.dimension];
      } else if (align === 'center') {
        childStyle[crossAxis.start] =
          currentCrossBase +
          (crossAxis.sign * (lineCrossSize - childStyle[crossAxis.dimension])) /
            2;
        childStyle[crossAxis.end] =
          childStyle[crossAxis.start] +
          crossAxis.sign * childStyle[crossAxis.dimension];
      } else if (align === 'stretch') {
        childStyle[crossAxis.start] = currentCrossBase;
        childStyle[crossAxis.end] =
          currentCrossBase +
          crossAxis.sign *
            (childStyle[crossAxis.dimension] !== null &&
            childStyle[crossAxis.dimension] !== void 0
              ? childStyle[crossAxis.dimension]
              : lineCrossSize);

        childStyle[crossAxis.dimension] =
          crossAxis.sign *
          (childStyle[crossAxis.end] - childStyle[crossAxis.start]);
      }
    }

    currentCrossBase += crossAxis.sign * (lineCrossSize + step);
  });

  console.log('=================== Element ==========================');
  console.log(element);
  console.log('=================== Children ==========================');
  console.log(children);
}

module.exports = layout;
