const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');


const httpServer = express();
const server = require('http').Server(httpServer); // extrair o servidor http de dentro do express e unir com wsocket
const io = require('socket.io')(server); // require retorna uma função entao vou chamala

// permitir a troca de mensagem entre o fornt  eo back em tempo real
io.on('connection', socket => {
    console.log('Nova conexão', socket.id);
});

mongoose.connect('mongodb+srv://mattheus:1989@clusterdomatheus-qrr1j.azure.mongodb.net/omnistacking?retryWrites=true&w=majority',
 {useNewUrlParser: true, useUnifiedTopology: true});
 

 httpServer.use(cors());
 httpServer.use(express.json());
 httpServer.use(routes);
 //httpServer.listen(3333);
 server.listen(3333);