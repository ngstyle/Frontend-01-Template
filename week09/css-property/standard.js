const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

void (async function (async = true) {
  let standards = await getStandards("https://www.w3.org/TR/?tag=css");
  console.log("standards count: " + standards.length);

  if (async) {
    // 异步
    standards = await Promise.all(
      standards.map(async (standard) => await getProperties(standard))
    );
  } else {
    // 同步
    for (let [index, standard] of standards.entries()) {
      standards[index] = await getProperties(standard);
    }
  }

  let md =
    "| NO. | Specification | Property | Status | Subtotal |\n| ---- | ---- | ---- | ---- | ---- |\n";
  let propCount = 0;

  standards
    .filter((standard) => standard.properties)
    .forEach((standard, index) => {
      md += `|${++index}|[${standard.name}](${
        standard.url
      })|${standard.properties.join(", ")}|${standard.status}|${
        standard.properties.length
      }|\n`;
      propCount += standard.properties.length;
    });

  md += `\nTotal Property: ${propCount}`;

  fs.writeFile("css-property.md", md, function (err, data) {
    if (err) {
      return console.log(err);
    }
  });
})();

async function getStandards(url) {
  const dom = await getDom(url);
  const lis = [
    ...dom.window.document.querySelectorAll("#container li[data-tag~=css]"),
  ].filter(
    (li) => !["Retired", "GroupNote"].includes(li.children[1].className)
  );
  return lis.reduce((pre, curr) => {
    pre.push({
      profile: curr.children[0].textContent,
      name: curr.children[1].textContent,
      url: curr.children[1].children[0].href,
      status: curr.children[1].className,
      index: pre.length + 1,
      count: lis.length,
    });
    return pre;
  }, []);
}

async function getProperties(standard) {
  const dom = await getDom(standard.url);

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

  console.log(
    `parse(${standard.index}/${standard.count})(${properties.length || 0}) -> ${
      standard.url
    }`
  );

  if (properties.length) {
    standard.properties = properties;
  }
  return standard;
}

async function getDom(url) {
  let response = await fetch(url);
  let text = await response.text();
  return await new JSDOM(text);
}
