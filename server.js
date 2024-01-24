const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let documentContent = "";

wss.on('connection', (ws) => {
    // Send current document content to the newly connected client
    ws.send(JSON.stringify({ type: 'init', content: documentContent }));

    ws.on('message', (message) => {
        const { type, content } = JSON.parse(message);
        
        if (type === 'update') {
            documentContent = content;
            // Broadcast the update to all connected clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'update', content }));
                }
            });
        }
    });
});

app.use(express.static('public'));
//Runs the server when npm app.js is run in the terminal
let port = process.env.PORT || 80;
server.listen(port, () => {
    console.log('Server is running on http://localhost:80');
});
