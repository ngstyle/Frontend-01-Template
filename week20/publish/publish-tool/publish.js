const opn = require("opn");
const fetch = require("node-fetch");
const http = require("http");
const url = require("url");
let archiver = require("archiver");
let dirName = "./dist";

// 唤起 github Oauth 授权
const client_id = "78e43ce5841f78dacfdf";
opn(`https://github.com/login/oauth/authorize?client_id=${client_id}`);

// 3001 端口监听server 重定向回来的token
const server = http.createServer((req, res) => {
  console.log(req.url);
  if (!req.url.match(/^\/\?token=/)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }

  const token = url.parse(req.url, true).query.token;

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });
  archive.directory(dirName, false);
  archive.finalize();

  fetch("http://localhost:3002/upload", {
    method: "POST",
    body: archive,
    headers: { token, "Content-Type": "application/octet-stream" },
  })
    .then((res) => res.text())
    .then((body) => {
      console.log(body);

      res.end("Publish Success");
      server.close();
    });
});

server.listen(3001);
