import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { HistoryPropType } from '../types';

const socket = io('ws://localhost:3001');
socket.on('message', (message) => alert(message));

export default function Home(props: HistoryPropType): JSX.Element {
    const location = useLocation<{ authenticated: boolean }>();
    if (!location.state?.authenticated) props.history.push('/');
    return <button onClick={() => socket.send('Hello Friends')}>Send</button>;
}