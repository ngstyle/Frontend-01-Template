var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const unzip = require("unzipper");

router.post("/", (req, res) => {
  fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${req.headers.token}`,
      "User-Agent": "publish-tool",
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      // TODO: 得到用户数据，权限校验
    })
    .then((user) => {
      let writeStream = unzip.Extract({ path: "../server/public/" });
      req.pipe(writeStream);

      req.on("end", () => {
        res.writeHead(200, {
          "content-Type": "text/plain",
        });
        res.end("file upload success");
      });
    });
});

module.exports = router;
