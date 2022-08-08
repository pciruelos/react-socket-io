import express from 'express';
import morgan from 'morgan';
import {Server as SocketServer} from 'socket.io'
import http from 'http';
import cors from 'cors';

import {PORT} from './config.js'

const app = express();
//real Server : con node creamos un servidor con su modulo http y le pasamos la configuracion de express
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors: {
        origin:'*'
    }
})

// cualquier servidor externo al localhost 3000 va a poder conectarse
app.use(cors())
app.use(morgan('dev'))

//vamos a pedirle a la app que escuche los eventos (Cuando ocurran,no siempre)q le llegan en caso de perder la conexion
io.on('connection', (socket) => {
    console.log(socket.id)
    // (nombre, valor (en este caso una funcion))
    socket.on('message', (mensaje) => {
        socket.broadcast.emit('message', {
            body:mensaje,from:socket.id
        })
    })
})

server.listen(PORT)
console.log('server running in port ',PORT)