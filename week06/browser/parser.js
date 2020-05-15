let state = data;
let EOF = Symbol('EOF');
let currentToken = null;

module.exports.parseHTML = function parseHTML(html) {
  // console.log(html);
  for (const c of html) {
    state = state(c);
  }
  state = state(EOF);
};

function emit(token) {
  console.log(token);
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: 'EOF' });
    return;
  } else {
    emit({ type: 'text', content: c });
  }
  return data;
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-z]$/i)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
    };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-z]$/i)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    };
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
    currentToken.tagName += c;
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
  } else if (c === '>') {
    return data;
  } else if (c === '=') {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c === EOF) {
  }
}
