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
  let propCount = 0;
  let md =
    "|   Standard    |   Property   |\n|   ----        |   ----       |\n";

  // for (let [index, standard] of standards.slice(0, 5).entries()) {
  for (let [index, standard] of standards.entries()) {
    console.log(`parse(${index}/${standards.length}) -> ${standard.url}`);
    response = await fetch(standard.url);
    text = await response.text();
    dom = await new JSDOM(text);

    const properties = [
      ...dom.window.document.querySelectorAll(
        ".propdef [data-dfn-type=property]"
      ),
    ].map((e) => e.textContent);

    if (properties.length) {
      md += `|[${standard.name}](${standard.url})|${properties.join(", ")}|\n`;
      propCount += properties.length;
      // propMap.set(standard.name, properties.join(", "));
    }
  }

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
