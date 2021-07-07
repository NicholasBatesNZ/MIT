import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import DatabaseHandler from './DatabaseHandler';

interface UserWithoutAuth {
    name?: string,
    gender?: string,
    email?: string
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
    request.user = {...request.user, ...request.body as UserWithoutAuth};
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

app.listen(3001);