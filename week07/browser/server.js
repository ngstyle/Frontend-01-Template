const http = require('http');

const server = http.createServer((req, res) => {
  console.log('request received:' + new Date());
  //   console.log(req.headers);

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/html' });
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
    .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width:200px;
        background-color:rgb(255,255,255);
    }
        </style>
    </head>
    <body>
        <div>
            <div class='container'>
                <div style="width:100px;height:100px;background-color:rgb(255,0,0);"> </div>
                <div style="width:40px;height:40px;align-self:center;background-color:rgb(0,0,255);"> </div>
            </div>
            <img id="myid" style="  width: 20%"/>
            <img class='img second'/>
        </div>
        <hr/>
    </body>
    </html>`;
  res.end(body);
});

server.listen(8088);
