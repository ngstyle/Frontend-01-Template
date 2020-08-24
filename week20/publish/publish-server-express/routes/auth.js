var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

const client_id = "78e43ce5841f78dacfdf";
const client_secret = "a2da76f75736f72575705f042ae6852d2b951746";

router.get("/", function (req, res, next) {
  console.dir("code is: " + req.query.code);

  // POST https://github.com/login/oauth/access_token
  // client_id client_secret code
  const params = new URLSearchParams();
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);
  params.append("code", req.query.code);

  fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: params,
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json.access_token);
      res.redirect(`http://localhost:3001/?token=${json.access_token}`);
    });
});

module.exports = router;
