import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { Link } from 'react-router-native';

export default function Landing(): JSX.Element {
    return (
        <View>
            <Link to={'/register'} component={TouchableHighlight}><Text>Register</Text></Link>
            <Link to={'/login'} component={TouchableHighlight}><Text>Login</Text></Link>
            <Link to={'/new'} component={TouchableHighlight}><Text>New things</Text></Link>
        </View>
    );
}