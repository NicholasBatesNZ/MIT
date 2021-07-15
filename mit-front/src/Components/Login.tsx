import React from 'react';
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

    private textChange = (event: { target: { name: string; value: string; }; }) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    private submit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (await ServerCommunicator.authenticate(this.state as AuthenticateUserType)) {
            this.props.history.push('/home', {
                authenticated: true,
                username: this.state.username,
                password: this.state.password
            });
        } else {
            alert('Username and password combination not found!');
        }
    }

    render(): JSX.Element {
        return (
            <form onSubmit={this.submit}>
                <label>Username: <input name="username" type="text" value={this.state.username} onChange={this.textChange} required /></label><p />
                <label>Password: <input name="password" type="password" value={this.state.password} onChange={this.textChange} required /></label><p />
                <input type="submit" value="Login" />
            </form>
        );
    }
}