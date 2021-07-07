import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');
socket.on('message', (message) => alert(message));

export default function Home(): JSX.Element {
    return <button onClick={() => socket.send('Hello Friends')}>Send</button>;
}