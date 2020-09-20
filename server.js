const express = require('express');
const app = express();
const { createServer } = require('http');
const cors = require('cors');
const port = 3000;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const _dirname = "C:\\Users\\Kevin\\Google Drive\\Coding Projects\\Git\\FluteBotXD\\";
const WebSocket = require('ws');
const { client } = require('tmi.js');

//Use Body Parser to Parse as json
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());
app.use("/node_modules", express.static('./node_modules/'));
app.use("/adlibs", express.static('./adlibs/'));
app.use("/static", express.static('./static/'));

//Establish HTTP Server
const server = createServer(app);

//Establish WebSocket
const wss = new WebSocket.Server({ server });
var clients = [];

wss.on('connection', function(ws){
    console.log('Server: Incoming new client connection');
    clients.push(ws);
    console.log('Server: Current Number of Clients: ' + clients.length);

    //On Open Connection
    ws.on('open', function() 
    {
        console.log('Server: Connection Opened'); 
        ws.send('Server: Connection Opened');
    });

    //On messaging from opening new connection
    ws.on('message', function(data) 
    {
        ws.send(`message received ${data}`);
        console.log(`Client: ${data}`);
    });
    
    //On Close
    ws.on('close', function()
    {
        console.log('Server: Connection Closed');
        let index = clients.indexOf(ws);
        clients.splice(ws);
    })
    
    
    
});

//On GET request
app.get('/', function(req, res){
    res.sendFile('soundplayer.html', {root: _dirname})
});

//On POST Request
app.post('/', function(req, res){
    console.log('Server: received command ' + req.body);
    res.send(`Server: received command ${req.body}`);

    //Send command to Client
    clients[0].send(req.body);
    console.log(`Sending ${req.body} to client`);

});

//Open Listening Port
server.listen(3000, function (){
    console.log('Listening on http://localhost:3000');
});


