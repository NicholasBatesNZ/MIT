import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');
socket.on('message', (message) => alert(message));

function send() {
    socket.send('Hello Friends');
}

export default function Home(): JSX.Element {
    return <button onClick={send}>Send</button>;
}