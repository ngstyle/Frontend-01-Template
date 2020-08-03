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

  get style() {
    return this.root.style;
  }

  setAttribute(name, value) {
    // console.log("setAttribute: ", name, value);
    this.root.setAttribute(name, value);
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

class Carousel {
  constructor() {
    this.children = [];
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  render() {
    const root = <div class="carousel"></div>;
    const children = [];
    this.data.forEach((url) => {
      let element = <img src={url} />;
      element.addEventListener("dragstart", (e) => e.preventDefault());
      children.push(element);

      root.appendChild(element);
    });

    let position = 0;
    let nextPic = () => {
      let nextPosition = (position + 1) % children.length;

      let current = children[position];
      let next = children[nextPosition];

      // current.style.transition = 'ease 0s';
      // next.style.transition = 'ease 0s';
      current.style.transition = "none";
      next.style.transition = "none";

      current.style.transform = `translateX(${-100 * position}%)`;
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      setTimeout(function () {
        current.style.transition = "ease 0.5s";
        next.style.transition = "ease 0.5s";

        current.style.transform = `translateX(${-100 - 100 * position}%)`;
        next.style.transform = `translateX(${-100 * nextPosition}%)`;

        position = nextPosition;
      }, 16);
      setTimeout(nextPic, 2000);
    };
    setTimeout(nextPic, 3000);

    root.addEventListener("mousedown", (de) => {
      // console.log('down:' + de.clientX, de.clientY);
      let [startX] = [de.clientX, de.clientY];

      let prePosition = (position - 1 + this.data.length) % this.data.length;
      let nextPosition = (position + 1) % this.data.length;

      let pre = children[prePosition];
      let current = children[position];
      let next = children[nextPosition];

      pre.style.transition = "ease 0s";
      current.style.transition = "ease 0s";
      next.style.transition = "ease 0s";

      pre.style.transform = `translateX(${-500 - 500 * prePosition}px)`;
      current.style.transform = `translateX(${-500 * position}px)`;
      next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;

      const moveEvent = (me) => {
        pre.style.transform = `translateX(${
          me.clientX - startX - 500 - 500 * prePosition
        }px)`;
        current.style.transform = `translateX(${
          me.clientX - startX - 500 * position
        }px)`;
        next.style.transform = `translateX(${
          me.clientX - startX + 500 - 500 * nextPosition
        }px)`;
      };

      const upEvent = (ue) => {
        let offset = 0;

        if (ue.clientX - startX > 250) {
          // 拖动一半以上
          offset = 1;
        } else if (ue.clientX - startX < -250) {
          offset = -1;
        }

        pre.style.transition = "ease 0.5s";
        current.style.transition = "ease 0.5s";
        next.style.transition = "ease 0.5s";

        pre.style.transform = `translateX(${
          offset * 500 - 500 - 500 * prePosition
        }px)`;
        current.style.transform = `translateX(${
          offset * 500 - 500 * position
        }px)`;
        next.style.transform = `translateX(${
          offset * 500 + 500 - 500 * nextPosition
        }px)`;

        position = (position - offset + this.data.length) % this.data.length;

        document.removeEventListener("mousemove", moveEvent);
        document.removeEventListener("mouseup", upEvent);
      };

      document.addEventListener("mousemove", moveEvent);
      document.addEventListener("mouseup", upEvent);
    });

    return root;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}

const data = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

let component = <Carousel data={data} />;
component.mountTo(document.body);

/*
// Vue style component

import Carousel from "./carousel.vue";

let component = new Carousel();
component.mountTo(document.body);
*/
