var express = require("express");
var router = express.Router();

var path = require("path");
var mime = require("mime");
var fs = require("fs");

router.get("/", async function (req, res) {
  let prefix = req.query.prefix;
  let count = req.query.count;

  if (!prefix) {
    console.log(`请输入手机号段(手机号码前7位),
  例如：node generate-vcf.js 1877880`);
    res.send("请输入手机号段(手机号码前7位)");
    return;
  }

  if (isNaN(Number(prefix)) || prefix.length !== 7) {
    console.log(`请输入有效手机号段(手机号码前7位),
    例如：node generate-vcf.js 1877880`);
    res.send("请输入手机号段(手机号码前7位)");
    return;
  }

  if (!count || isNaN(Number(count)) || Number(count) > 8999) {
    count = 500;
  }

  const file = await generateVcf(prefix, Math.floor(Number(count)));

  const filename = path.basename(file);
  const mimetype = mime.lookup(file);
  res.setHeader("Content-disposition", "attachment; filename=" + filename);
  res.setHeader("Content-type", mimetype);

  const filestream = fs.createReadStream(file);
  filestream.pipe(res);

  filestream.on("close", function () {
    fs.unlinkSync(file);
    console.log("close callback, delete file");
  });
});

async function generateVcf(prefix, count) {
  // let [prefix, count] = myArgs;
  // let [prefix, count] = ["1870123", "20"];

  console.log(`号段: ${prefix}, 个数: ${count}, 生成中...`);

  const suffixSet = new Set();
  for (let index = 0; index < count; index++) {
    const suffix = Math.floor(1000 + Math.random() * 8999);

    if (suffixSet.has(prefix + suffix)) {
      index--;
    }

    suffixSet.add(prefix + suffix.toString());
  }

  console.log("size = " + suffixSet.size);

  let data = "";
  for (const suffix of suffixSet) {
    data += `BEGIN:VCARD
N;CHARSET=UTF-8:${suffix}
FN;CHARSET=UTF-8:${suffix}
TEL;TYPE=CELL:${suffix}
END:VCARD
`;
  }

  const path = "./temp/" + prefix + "-" + Date.now() + ".vcf";

  await fs.writeFile(path, data, (err) => {
    if (err) return console.log(err);
  });

  return path;
}

module.exports = router;
