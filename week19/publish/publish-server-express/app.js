var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const fs = require("fs");
const unzip = require("unzipper");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.post("/file-upload", (req, res) => {
  // let writeStream = fs.createWriteStream("../server/public/x.zip");
  let writeStream = unzip.Extract({ path: "../server/public/" });
  req.pipe(writeStream);

  req.on("end", () => {
    res.writeHead(200, {
      "content-Type": "text/plain",
    });
    res.end("file upload success");
  });
});

module.exports = app;
