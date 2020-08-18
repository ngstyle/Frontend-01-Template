const http = require("http");
// const fs = require("fs");
let archiver = require("archiver");

let dirName = "./dist";

const options = {
  host: "localhost",
  port: 3002,
  // path: "/?filename=archiver.zip",
  path: "/file-upload",
  method: "POST",
  headers: {
    "Content-Type": "application/octet-stream",
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
});

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

const archive = archiver("zip", {
  zlib: { level: 9 },
});
archive.directory(dirName, false);
archive.pipe(req);
archive.finalize();

archive.on("end", () => {
  req.end();
});

// Write data to request body

// const readStream = fs.createReadStream(`./${filename}`);
// readStream.pipe(req);
// readStream.on("end", () => {
//   req.end();
// });
