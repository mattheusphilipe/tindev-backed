const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');


const httpServer = express();
const server = require('http').Server(httpServer); // extrair o servidor http de dentro do express e unir com wsocket
const io = require('socket.io')(server); // require retorna uma função entao vou chamala

// meoria do node mudar para o mongo
// preciso saber o id do usuario do mongo db e a relação com o id de socket
// para saber qual usuario está em qual socket
// melhor usando banco chave valor como o mongo
const connectedUsers = {}; 

// permitir a troca de mensagem entre o fornt  eo back em tempo real
io.on('connection', socket => {
    const { user } = socket.handshake.query
    connectedUsers[user] = socket.id
    console.log('Nova conexão', user, socket.id);

    socket.on('hello', message => {
        console.log(message);
    });
});

mongoose.connect('mongodb+srv://mattheus:1989@clusterdomatheus-qrr1j.azure.mongodb.net/omnistacking?retryWrites=true&w=majority',
 {useNewUrlParser: true, useUnifiedTopology: true});
 

 // middleware é um interceptador, como uam rota dentro da aplicação

 httpServer.use((request, response, next) => {
    request.io = io;
    request.connectedUsers = connectedUsers;

    return next();
 });
 httpServer.use(cors());
 httpServer.use(express.json());
 httpServer.use(routes);
 //httpServer.listen(3333);
 server.listen(3333);