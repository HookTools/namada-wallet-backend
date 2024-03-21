import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import bodyParser from 'body-parser'

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.use(bodyParser.json());

const wsConnections = {};

app.post('/:uuid', (req, res) => {
  const uuid = req.params.uuid;
    console.log(req.body)
  const ws = wsConnections[uuid];
  if (ws) {
    ws.send(JSON.stringify(req.body));
    res.status(200).send('Data sent via WebSocket');
    
    ws.close();
  } else {
    res.status(404).send('No WebSocket connection found for the UUID');
  }
});

wss.on('connection', (ws, req) => {
  const uuid = req.url.substr(1);
  wsConnections[uuid] = ws;

  ws.on('close', () => {
    delete wsConnections[uuid];
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
