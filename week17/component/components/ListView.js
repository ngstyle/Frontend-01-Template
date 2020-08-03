import { createElement, Text, Wrapper } from "../util/createElement";

export default class ListView {
  constructor() {
    this.children = [];
    this.selectedIndex = 0;
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    const data = this["data"];
    return <div class="list-view">{data.map(this.children[0])}</div>;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
