import React from 'react';
import { BackButton, NativeRouter, Route, Switch } from 'react-router-native';
import Home from './Components/Home';
import Landing from './Components/Landing';
import Login from './Components/Login';
import Register from './Components/Register';

export default function App(): JSX.Element {
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