import React from 'react';
import { Alert, Button, Text } from 'react-native';
import { useLocation } from 'react-router-native';
import { io } from 'socket.io-client';
import { serverIP } from '../../../env';
import { AuthenticateUserType, HistoryPropType } from '../types';

export default function Home(props: HistoryPropType): JSX.Element {
    const location = useLocation<{ authenticated: boolean, patient: boolean } & AuthenticateUserType>();
    if (!location.state?.authenticated) props.history.push('/');

    const socket = io(`ws://${serverIP}`);
    socket.emit('joinRoom', location.state.username, location.state.password);
    socket.on('message', (message) => Alert.alert(message));

    return location.state.patient
        ? <Button title="send" onPress={() => socket.send('Hello Friends')}><Text>HELP</Text></Button>
        : <Text>Hello Helper</Text>;
}