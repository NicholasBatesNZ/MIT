import React from 'react';
import { BackButton, NativeRouter, Route } from 'react-router-native';
import MainView from './Components/MainView';

export default function App(): JSX.Element {
    return (
        <NativeRouter>
            <BackButton>
                <Route component={MainView} />
            </BackButton>
        </NativeRouter>
    );
};