import React from 'react';
import { Alert, Button, Switch, Text, TextInput, View } from 'react-native';
import ServerCommunicator from '../ServerCommunicator';
import { HistoryPropType, RegisterUserType, UserType } from '../types';

export default class Register extends React.Component<HistoryPropType, RegisterUserType & { timesInput: string }> {
    constructor(props: HistoryPropType) {
        super(props);
        this.state = {
            username: '',
            password: '',
            name: '',
            patient: true,
            age: 0,
            address: '',
            timesAvailable: [],
            timesInput: ''
        };
    }

    private parseTimes(text: string) {
        this.setState({ timesInput: text });

        const ranges = text.replace(' ', '').split(',').map(range => range.split('-'));
        this.setState({
            timesAvailable: ranges.map(range => ({
                start: range[0],
                end: range[1]
            }))
        });
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
                <Text>You are a patient: </Text><Switch value={this.state.patient} onValueChange={value => this.setState({ patient: value })} />
                <Text>Age: </Text><TextInput value={this.state.age ? this.state.age.toString() : ''} onChangeText={text => this.setState({ age: parseInt(text.replace(/[^0-9]/g, '')) })} keyboardType='numeric' />
                <Text>Address: </Text><TextInput value={this.state.address} onChangeText={text => this.setState({ address: text })} />
                <Text>Times Available (eg. '0900-1200, 1500-2200'): </Text><TextInput value={this.state.timesInput} onChangeText={text => this.parseTimes(text)} keyboardType='numeric' />
                <Text>Username: </Text><TextInput value={this.state.username} onChangeText={text => this.setState({ username: text })} />
                <Text>Password: </Text><TextInput value={this.state.password} onChangeText={text => this.setState({ password: text })} secureTextEntry={true} />
                <Button title="submit" onPress={this.submit}><Text>Register</Text></Button>
            </View>
        );
    }
}