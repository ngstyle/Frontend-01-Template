function createElement(Cls, attributes, ...children) {
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

  for (const child of children) {
    // 处理文字 textNode
    if (typeof child === "string") {
      child = new Text(child);
    }
    o.appendChild(child);
  }

  return o;
}

class Text {
  constructor(text) {
    this.root = document.createTextNode(text);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }

  set class(v) {
    // Property
    console.log("Property: ", v);
  }

  setAttribute(name, value) {
    // console.log("setAttribute: ", name, value);
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    // children
    // console.log("Parent::appendChild" + child);

    this.children.push(child);
  }

  mountTo(parent) {
    for (const child of this.children) {
      if (child instanceof Wrapper || child instanceof Text)
        child.mountTo(this.root);
    }
    parent.appendChild(this.root);
  }
}

class Component {
  constructor() {
    this.children = [];
    // this.root = document.createElement("div");
    this.slot = <div></div>;
  }

  set class(v) {
    // Property
    // console.log("Property: ", v);
  }

  setAttribute(name, value) {
    // console.log("setAttribute: ", name, value);
    // this.root.setAttribute(name, value);
    this.slot.setAttribute(name, value);
  }

  appendChild(child) {
    // children
    this.children.push(child);
  }

  render() {
    return (
      <article>
        <header>This is a Header</header>
        {this.slot}
        <footer>This is a footer</footer>
      </article>
    );
  }

  mountTo(parent) {
    for (const child of this.children) {
      this.slot.appendChild(child);
    }

    this.render().mountTo(parent);
  }
}

let component = (
  <Component
    id="container"
    class="light-gray"
    style="width: 100px; height: 100px; background: pink"
  >
    {/* <div>{1}</div> */}
    <p>xxx</p>
    <div></div>
    <div></div>
  </Component>
);

component.class = "primary";
component.mountTo(document.body);

console.log(component);
