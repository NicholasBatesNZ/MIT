import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import React from 'react';
import { Alert } from 'react-native';
import { Route, Switch } from 'react-router-native';
import ServerCommunicator from '../ServerCommunicator';
import { HistoryPropType } from '../types';
import Home from './Home';
import Landing from './Landing';
import Login from './Login';
import MapScreen from './MapScreen';
import Register from './Register';

export default function MainView(props: HistoryPropType): JSX.Element {

    async function goToMap(message: FirebaseMessagingTypes.RemoteMessage) {
        if (!message.notification?.title) return;

        if (message.notification.title.includes('HELP')) {
            Alert.alert(message.notification.title, message.notification.body, [{
                text: 'See Details',
                onPress: async () => {
                    if (!message.data) return;
                    const response = await ServerCommunicator.requestInfo(message.data.patientUsername, await messaging().getToken());
                    props.history.push('/map', { ...message.data, ...response });
                }
            }]);
        } else {
            Alert.alert(message.notification.title, message.notification.body);
        }
    }
    messaging().onMessage(goToMap);
    messaging().onNotificationOpenedApp(goToMap);

    return (
        <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/home" component={Home} />
            <Route path="/map" component={MapScreen} />
            <Route path="/" component={Landing} />
        </Switch>
    );
};