import { createElement, Text, Wrapper } from "../util/createElement";
import css from "./tabs.css";

export default class TabPanel {
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
    this.titles = [];
    for (const [index, child] of this.children.entries()) {
      this.titles.push(
        <div class="tabs-tab" onClick={() => this.titleClick(index)}>
          {child.getAttribute("title")}
        </div>
      );

      child.style.display = index === this.selectedIndex ? "" : "none";
    }
    this.titles[this.selectedIndex].classList.add("tabs-tab-active");

    const root = (
      <div>
        <div class="ant-tabs-nav">{this.titles}</div>
        {this.children}
      </div>
    );
    return root;
  }

  titleClick(index) {
    this.selectedIndex = index;

    for (const view of this.children) {
      view.style.display = "none";
    }
    this.children[index].style.display = "";

    for (const view of this.titles) {
      view.classList.remove("tabs-tab-active");
    }
    this.titles[index].classList.add("tabs-tab-active");
  }

  mountTo(parent) {
    const root = this.render();
    root.mountTo(parent);

    const rootStyle = getComputedStyle(root.root);
    this.width = Number(rootStyle.width.slice(0, -2));
  }
}
