const express = require('express');
const app = express();
var qs = require('querystring');
var url="rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream";
const { proxy, scriptUrl } = require('rtsp-relay')(app);
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;
// the endpoint our RTSP uses
app.ws('/api/stream', proxy({
  url: `${url}`,
  // if your RTSP stream need credentials, include them in the URL as above
  transport:'tcp',
  additionalFlags: ['-q', '1'],
  verbose: false,
}));

// the endpoint our RTSP uses
app.ws('/api/streams', 
(ws, req) =>
{
  console.log(req.query.url);
proxy({
  url: `${req.query.url}`,
  transport:'tcp',
  additionalFlags: ['-q', '1'],
  verbose: false,
})(ws)},
);

// this is an example html page to view the stream
app.get('/', (req, res) =>{
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://10.218.53.45:8080/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`);
},
  
);

app.get(
  '/stream',
  (req, res) => {    
    
    res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://10.218.53.45:8080/api/streams?url=${req.query.url}',
      canvas: document.getElementById('canvas')
    });
  </script>
`);

  }
);

app.listen(port);