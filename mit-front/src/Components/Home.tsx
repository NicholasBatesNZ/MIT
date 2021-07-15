import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthenticateUserType, HistoryPropType } from '../types';

export default function Home(props: HistoryPropType): JSX.Element {
    const location = useLocation<{ authenticated: boolean } & AuthenticateUserType>();
    if (!location.state?.authenticated) props.history.push('/');

    const socket = io('ws://localhost:3001');
    socket.emit('joinRoom', location.state.username, location.state.password);
    socket.on('message', (message) => alert(message));

    return <button onClick={() => socket.send('Hello Friends')}>Send</button>;
}