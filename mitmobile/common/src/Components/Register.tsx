import React from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import ServerCommunicator from '../ServerCommunicator';
import { HistoryPropType, RegisterUserType, UserType } from '../types';

export default class Register extends React.Component<HistoryPropType, RegisterUserType> {
    constructor(props: HistoryPropType) {
        super(props);
        this.state = {
            username: '',
            password: '',
            name: '',
            gender: '',
            email: ''
        };
    }

    private submit = async () => {
        if (await ServerCommunicator.register(this.state as UserType)) {
            this.props.history.push('/login');
        } else {
            Alert.alert('User already registered!');
        }
    }

    render(): JSX.Element {
        return (
            <View>
                <Text>Name: </Text><TextInput value={this.state.name} onChangeText={text => this.setState({ name: text })} />
                <Text>Gender: </Text><TextInput value={this.state.gender} onChangeText={text => this.setState({ gender: text })} />
                <Text>Email: </Text><TextInput value={this.state.email} onChangeText={text => this.setState({ email: text })} />
                <Text>Username: </Text><TextInput value={this.state.username} onChangeText={text => this.setState({ username: text })} />
                <Text>Password: </Text><TextInput value={this.state.password} onChangeText={text => this.setState({ password: text })} />
                <Button title="submit" onPress={this.submit}><Text>Register</Text></Button>
            </View>
        );
    }
}