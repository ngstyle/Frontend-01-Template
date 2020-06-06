const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

void (async function () {
  let response = await fetch("https://www.w3.org/TR/?tag=css");
  let text = await response.text();
  let dom = await new JSDOM(text);
  // console.log(dom.window.document.querySelector("h1").textContent);

  let standards = [];
  [
    ...dom.window.document.querySelectorAll("#container li[data-tag~=css]"),
  ].reduce((pre, curr) => {
    if (!["Retired", "GroupNote"].includes(curr.children[1].className)) {
      pre.push({
        profile: curr.children[0].textContent,
        name: curr.children[1].textContent,
        url: curr.children[1].children[0].href,
        status: curr.children[1].className,
      });
    }
    return pre;
  }, standards);

  console.log("standards count: " + standards.length);

  // const propMap = new Map();
  let docCount = 0;
  let propCount = 0;
  let md =
    "| NO. | Standard | Property | Subtotal |\n| ---- | ---- | ---- | ---- |\n";

  // for (let [index, standard] of standards.slice(0, 4).entries()) {
  for (let [index, standard] of standards.entries()) {
    response = await fetch(standard.url);
    text = await response.text();
    dom = await new JSDOM(text);

    const properties = [
      ...dom.window.document.querySelectorAll(
        ".propdef [data-dfn-type=property]"
      ),
    ].map((dfn) => {
      while (dfn.lastElementChild) {
        console.count("----- ElementChild is not empty --------");
        dfn.removeChild(dfn.lastElementChild);
      }

      let propdef = dfn.parentElement;
      while (!propdef.className.includes("propdef")) {
        propdef = propdef.parentElement;
      }

      let target = propdef.previousElementSibling;
      while (target && !target.id) {
        target = target.previousElementSibling;
      }

      return `[${dfn.textContent.trim()}](${standard.url}#${
        target ? target.id : ""
      })`;
    });

    if (properties.length) {
      md += `|${++docCount}|[${standard.name}](${
        standard.url
      })|${properties.join(", ")}|${properties.length}|\n`;
      propCount += properties.length;
      // propMap.set(standard.name, properties.join(", "));
    }

    console.log(
      `parse(${index}/${standards.length})(${properties.length || 0}) -> ${
        standard.url
      }`
    );
  }

  md += `Total Property: ${propCount}`;
  // console.log(propMap);
  // console.log(md);
  console.log("Property count: " + propCount);
  fs.writeFile("css-property.md", md, function (err, data) {
    if (err) {
      return console.log(err);
    }
    // console.log(data);
  });
})();
