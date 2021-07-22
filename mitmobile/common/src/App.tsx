import messaging from '@react-native-firebase/messaging';
import React from 'react';
import { Alert } from 'react-native';
import { BackButton, NativeRouter, Route, Switch } from 'react-router-native';
import Home from './Components/Home';
import Landing from './Components/Landing';
import Login from './Components/Login';
import Register from './Components/Register';

export default function App(): JSX.Element {
    messaging().onMessage(async message => Alert.alert('You have a message!', JSON.stringify(message)));
    messaging().setBackgroundMessageHandler(async message => console.log(`Message received in background: ${JSON.stringify(message)}`));

    return (
        <NativeRouter>
            <BackButton>
                <Switch>
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/home" component={Home} />
                    <Route path="/" component={Landing} />
                </Switch>
            </BackButton>
        </NativeRouter>
    );
};