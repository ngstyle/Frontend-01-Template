const regexp = /([\d\.]+)|([\s]+)|(\+)|(\-)|(\*)|(\/)/g;

let types = ["Number", "Space", "+", "-", "*", "/"];

function* tokenize(source) {
  let lastIndex = 0;
  let result;
  while ((result = regexp.exec(source))) {
    if (regexp.lastIndex - lastIndex > result[0].length) {
      throw Error(
        `Unexpected character: '${source.slice(
          lastIndex,
          regexp.lastIndex - result[0].length
        )}'`
      );
    }
    lastIndex = regexp.lastIndex;

    let token = {
      type: null,
      value: null,
    };
    for (let i = 0; i < types.length; i++) {
      if (result[i + 1]) {
        token.type = types[i];
        break;
      }
    }
    token.value = result[0];
    yield token;
  }

  yield { type: "EOF" };
}

function Expression(source) {
  if (
    source[0].type === "AdditiveExpression" &&
    source[1] &&
    source[1].type === "EOF"
  ) {
    const node = {
      type: "Expression",
      children: [source.shift(), source.shift()],
    };

    source.unshift(node);
    return node;
  }
  AdditiveExpression(source);
  return Expression(source);
}

function AdditiveExpression(source) {
  if (source[0].type === "Number") {
    MultiplicativeExpression(source);
    return AdditiveExpression(source);
  }

  if (source[0].type === "MultiplicativeExpression") {
    const node = {
      type: "AdditiveExpression",
      children: [source.shift()],
    };
    source.unshift(node);
    return AdditiveExpression(source);
  }

  if (
    source[0].type === "AdditiveExpression" &&
    source[1] &&
    source[1].type === "+"
  ) {
    const node = {
      type: "AdditiveExpression",
      children: [source.shift(), source.shift()],
    };
    MultiplicativeExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }

  if (
    source[0].type === "AdditiveExpression" &&
    source[1] &&
    source[1].type === "-"
  ) {
    const node = {
      type: "AdditiveExpression",
      children: [source.shift(), source.shift()],
    };
    MultiplicativeExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }

  if (source[0].type === "AdditiveExpression") return source[0];
}

function MultiplicativeExpression(source) {
  if (source[0].type === "Number") {
    const node = {
      type: "MultiplicativeExpression",
      children: [source.shift()],
    };

    source.unshift(node);

    return MultiplicativeExpression(source);
  }

  if (
    source[0].type === "MultiplicativeExpression" &&
    source[1] &&
    source[1].type === "*"
  ) {
    const node = {
      type: "MultiplicativeExpression",
      children: [source.shift(), source.shift(), source.shift()],
    };
    source.unshift(node);

    return MultiplicativeExpression(source);
  }

  if (
    source[0].type === "MultiplicativeExpression" &&
    source[1] &&
    source[1].type === "/"
  ) {
    const node = {
      type: "MultiplicativeExpression",
      children: [source.shift(), source.shift(), source.shift()],
    };
    source.unshift(node);

    return MultiplicativeExpression(source);
  }

  if (source[0].type === "MultiplicativeExpression") return source[0];
}

let source = [];
for (const token of tokenize("5 + 1024 * 2")) {
  if (token.type !== "Space") {
    source.push(token);
  }
}

console.log(Expression(source));
