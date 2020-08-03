import { enableGesture } from "../base/gesture";

export function createElement(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === "string") {
    o = new Wrapper(Cls);
  } else {
    o = new Cls();
  }

  for (const name in attributes) {
    // o[name] = attributes[name];
    o.setAttribute(name, attributes[name]);
  }

  let visit = (children) => {
    for (const child of children) {
      if (child instanceof Array) {
        visit(child);
        continue;
      }

      // 处理文字 textNode
      if (typeof child === "string") {
        child = new Text(child);
      }

      o.appendChild(child);
    }
  };

  visit(children);

  return o;
}

export class Text {
  constructor(text) {
    this.root = document.createTextNode(text);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }

  set class(v) {
    // Property
    console.log("Property: ", v);
  }

  get style() {
    return this.root.style;
  }

  setAttribute(name, value) {
    // console.log("setAttribute: ", name, value);
    this.root.setAttribute(name, value);

    if (name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(
        RegExp.$1[0],
        RegExp.$1[0].toLowerCase()
      );
      this.addEventListener(eventName, value);
    }

    if (name === "enableGesture" && value) {
      enableGesture(this.root);
    }

    if (name === "click") {
      this.addEventListener(name, value);
    }
  }

  getAttribute(name) {
    return this.root.getAttribute(name);
  }

  get classList() {
    return this.root.classList;
  }

  appendChild(child) {
    // children
    this.children.push(child);
  }

  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  mountTo(parent) {
    for (const child of this.children) {
      if (child instanceof Wrapper || child instanceof Text)
        child.mountTo(this.root);
    }
    parent.appendChild(this.root);
  }
}
