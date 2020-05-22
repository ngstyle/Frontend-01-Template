const parser = require('./css-parser.js');
const layout = require('./layout.js');

let state = data;
let EOF = Symbol('EOF');
let currentToken = null;
let currentAttribute = null;

let stack = [{ type: 'document', children: [] }];
let currentTextNode = null;

let tokenType = Symbol('type');
let tag = Symbol('tagName');

module.exports.parseHTML = function parseHTML(html) {
  // console.log(html);
  for (const c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
};

function emit(token) {
  let top = stack[stack.length - 1];
  if (token[tokenType] === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
      parent: top,
      tagName: token[tag],
    };

    for (const p in token) {
      element.attributes.push({
        name: p,
        value: token[p],
      });
    }

    parser.computeCSS(element);
    top.children.push(element);

    if (!token.isSelfClosing) stack.push(element);

    currentTextNode = null;
  } else if (token[tokenType] === 'endTag') {
    if (top.tagName !== token[tag]) {
      throw Error('Start and End Tag not matched!');
    } else {
      if (top.tagName === 'style') {
        parser.addCSSRules(top.children[0].content);
      }
      layout(top);
      stack.pop();
    }

    currentTextNode = null;
  } else if (token[tokenType] === 'text') {
    if (!currentTextNode) {
      currentTextNode = {
        type: 'text',
        content: '',
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({ [tokenType]: 'EOF' });
    return;
  } else {
    emit({ [tokenType]: 'text', content: c });
  }
  return data;
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-z]$/i)) {
    currentToken = {
      [tokenType]: 'startTag',
      [tag]: '',
    };
    Object.defineProperties(currentToken, {
      tokenType: { enumerable: false },
      tag: { enumerable: false },
    });
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-z]$/i)) {
    currentToken = {
      [tokenType]: 'endTag',
      [tag]: '',
    };
    Object.defineProperties(currentToken, {
      tokenType: { enumerable: false },
      tag: { enumerable: false },
    });
    return tagName(c);
  } else if (c === '>') {
  } else if (c === EOF) {
  } else {
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-z]$/i)) {
    // console.log(c);
    currentToken[tag] += c;
    return tagName;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    throw Error("attribute name can't start with '='");
  } else {
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    // <input require/>
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<') {
    // This is an unexpected-character-in-attribute-name parse error. Treat it as per the "anything else" entry below.
    throw Error("attribute name can't includes '" + char + "'");
  } else {
    currentAttribute.name += c;
    // return afterAttributeName;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // 没有属性值的的属性
    currentToken[currentAttribute.name] = currentAttribute.value;
  } else if (c === '/') {
    // 没有属性值的的属性
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    emit({ [tokenType]: 'EOF' });
  } else {
    return attributeName(c);
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    // <input type= > TODO
    return beforeAttributeName;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return signleQuotedAttributeValue;
  } else if (c === '>') {
  } else {
    return unQuotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function signleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return signleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\n\t\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    // TODO check
    beforeAttributeName(c);
  }
}

function unQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === '\u0000') {
  } else if (c === "'" || c === '"' || c === '<' || c === '=' || c === '`') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return unQuotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  }
}
