import React from 'react';
import { Button, Text } from 'react-native';
import { useLocation } from 'react-router-native';
import ServerCommunicator from '../ServerCommunicator';
import { AuthenticateUserType, HistoryPropType } from '../types';

export default function Home(props: HistoryPropType): JSX.Element {
    const location = useLocation<{ authenticated: boolean, patient: boolean } & AuthenticateUserType>();
    if (!location.state?.authenticated) props.history.push('/');

    return location.state.patient
        ? <Button title="help" onPress={() => ServerCommunicator.requestHelp(location.state.username)}></Button>
        : <Text>Hello Helper</Text>;
}