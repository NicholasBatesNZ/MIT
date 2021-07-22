import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import DatabaseHandler from './DatabaseHandler';

interface UserWithoutAuth {
    name?: string,
    patient?: boolean,
    age?: number,
    address?: string,
    timesAvailable?: {
        start: string,
        end: string
    }[]
}

export interface User extends UserWithoutAuth {
    username: string,
    password: string
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// parse auth header
app.use((request, reponse, next) => {
    if (!request.headers.authorization) return reponse.status(405).json('No credentials given!');
    const token = request.headers.authorization.split(' ')[1];
    const authData = Buffer.from(token, 'base64').toString().split(':');
    request.user = {
        username: authData[0],
        password: authData[1]
    };
    request.user = { ...request.user, ...request.body as UserWithoutAuth };
    next();
});

void (async () => {
    await DatabaseHandler.init();
})();

app.post('/register', async (request, response) => {
    const result = await DatabaseHandler.register(request.user);
    response.status(result ? 201 : 409).json(result);
});

app.get('/authenticate', async (request, response) => {
    const result = await DatabaseHandler.authenticate(request.user.username, request.user.password);
    response.status(result ? 200 : 404).json(result);
});

const http = createServer(app);
const io = new Server(http, {
    cors: {
        origin: '*'
    },
    serveClient: false
});

const clientsToReceiveMessage: string[] = [];
io.on('connect', (socket) => {
    console.log('Client connected');

    socket.on('joinRoom', async (username: string, password: string) => {
        if (clientsToReceiveMessage.includes(username)) return; // client already in room on another device
        if (!await DatabaseHandler.authenticate(username, password)) return; // client not in database
        await socket.join('messageRoom');
        clientsToReceiveMessage.push(username);
        console.log('Client added to room');
    });

    socket.on('message', message => socket.broadcast.to('messageRoom').emit('message', message));
});

http.listen(3001);