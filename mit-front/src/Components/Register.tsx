import React from 'react';
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

    private textChange = (event: { target: { name: string; value: string; }; }) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    private submit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        
        if (await ServerCommunicator.register(this.state as UserType)) {
            this.props.history.push('/login');
        } else {
            alert('User already registered!');
        }
    }

    render(): JSX.Element {
        return (
            <form onSubmit={this.submit}>
                <label>Name: <input name="name" type="text" value={this.state.name} onChange={this.textChange} required /></label><p />
                <label>Gender: <input name="gender" type="text" value={this.state.gender} onChange={this.textChange} required /></label><p />
                <label>Email: <input name="email" type="email" value={this.state.email} onChange={this.textChange} required /></label><p />
                <label>Username: <input name="username" type="text" value={this.state.username} onChange={this.textChange} required /></label><p />
                <label>Password: <input name="password" type="password" value={this.state.password} onChange={this.textChange} required /></label><p />
                <input type="submit" value="Register" />
            </form>
        );
    }
}