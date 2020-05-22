const http = require('http');

const server = http.createServer((req, res) => {
  console.log('request received:' + new Date());
  //   console.log(req.headers);

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // <input type="text" required>
  const body = `<html maaa=a >
    <head>
        <style>
    .ss,body div #myid{
        width:100px;
        background-color: #ff5000;
    }
    body div .img{
        width:300px;
        background-color: #ff1111;
    }
    body div img{
        width:30px;
        background-color: #ff1122;
    }
        </style>
    </head>
    <body>
        <div>
            <img id="myid" style="  width: 20%"/>
            <img class='img second'/>
            <input name="username" placeHolders='user Name' type='text' required/>
        </div>
        <hr/>
    </body>
    </html>`;
  res.end(body);
});

server.listen(8088);
