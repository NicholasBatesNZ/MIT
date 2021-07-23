import messaging from '@react-native-firebase/messaging';
import React from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import ServerCommunicator from '../ServerCommunicator';
import { AuthenticateUserType, HistoryPropType, LoginUserType } from '../types';

export default class Login extends React.Component<HistoryPropType, LoginUserType> {
    constructor(props: HistoryPropType) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    private submit = async () => {
        const response = await ServerCommunicator.authenticate(this.state as AuthenticateUserType, await messaging().getToken());
        if (response.authenticated) {
            this.props.history.push('/home', {
                authenticated: true,
                patient: response.patient,
                username: this.state.username,
                password: this.state.password
            });
        } else {
            Alert.alert('Username and password combination not found!');
        }
    }

    render(): JSX.Element {
        return (
            <View>
                <Text>Username: </Text><TextInput value={this.state.username} onChangeText={text => this.setState({ username: text })} />
                <Text>Password: </Text><TextInput value={this.state.password} onChangeText={text => this.setState({ password: text })} secureTextEntry={true} />
                <Button title="submit" onPress={this.submit}><Text>Login</Text></Button>
            </View>
        );
    }
}