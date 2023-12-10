const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const maxClients = 2;          // Maksymalna ilość klientów dołączonych do serwera
let connectedClients = 0;      // Liczba dołączonych klientów

wss.on('connection', (ws) => {        // Obsługa dołączajcych klientów
  console.log('Client connected');
  
  if (connectedClients >= maxClients) {             
    console.log('Connection rejected: Max clients reached');
    ws.close();
    return;
  }
 
  connectedClients++;
  console.log(`Client connected. Total connected clients: ${connectedClients}`);

  ws.on('message', (message) => {            // Obsługa przychodzących wiadomości
    console.log(`Received message: ${message}`);
    
    wss.clients.forEach((client) => {       // Rozesłanie wiadomości do wszystkich klientów
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
  });

  ws.on('close', () => {
    connectedClients--;
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('WebSocket server is running on port 3000');
});
