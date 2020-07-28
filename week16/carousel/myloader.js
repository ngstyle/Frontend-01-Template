const parser = require("./parser");

module.exports = function (source) {
  // console.log(source);

  const tree = parser.parseHTML(source);
  // console.log(tree.children[2].children[0].content);

  let template = null;
  let script = null;

  for (const node of tree.children) {
    if (node.tagName === "template") {
      template = node.children.filter((e) => e.type !== "text")[0];
      // template = node;
    } else if (node.tagName === "script") {
      script = node.children[0].content;
    }
  }

  let visit = (node) => {
    if (node.type === "text") return JSON.stringify(node.content);

    let attrs = {};
    for (const attr of node.attributes) {
      attrs[attr.name] = attr.value;
    }

    let children = node.children.map((node) => visit(node));

    return `createElement("${node.tagName}", ${JSON.stringify(
      attrs
    )}, ${children})`;
  };

  let result = `
  import {createElement, Text, Wrapper} from './createElement';
  export default class Carousel {
    render() {
      return ${visit(template)}
    }

    setAttribute(name, value) {
      this[name] = value;
    }

    mountTo(parent) {
      this.render().mountTo(parent);
    }
  }
  `;

  console.log(result);

  return result;
};

// export default function(source) {
//   const options = getOptions(this);

//   validateOptions(schema, options, 'Example Loader');

//   // Apply some transformations to the source...

//   return `export default ${ JSON.stringify(source) }`;
// }
