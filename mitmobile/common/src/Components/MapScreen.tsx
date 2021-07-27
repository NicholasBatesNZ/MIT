import messaging from '@react-native-firebase/messaging';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from 'react-router-native';
import ServerCommunicator from '../ServerCommunicator';

interface LocationType {
    time: string,
    patientUsername: string,
    patientName: string,
    helperName: string,
    patientAddress: string,
    helperAddress: string,
    patientLat: string,
    helperLat: string,
    patientLong: string,
    helperLong: string
}

export default function MapScreen(): JSX.Element {
    const location = useLocation<LocationType>();

    const patientLatNo = parseFloat(location.state.patientLat);
    const helperLatNo = parseFloat(location.state.helperLat);
    const patientLongNo = parseFloat(location.state.patientLong);
    const helperLongNo = parseFloat(location.state.helperLong);

    return (
        <View style={{ ...StyleSheet.absoluteFillObject }}>
            <MapView
                style={{ ...StyleSheet.absoluteFillObject }}
                region={{
                    latitude: (patientLatNo + helperLatNo) / 2,
                    longitude: (patientLongNo + helperLongNo) / 2,
                    latitudeDelta: Math.abs(patientLatNo - helperLatNo) * 1.5,
                    longitudeDelta: Math.abs(patientLongNo - helperLongNo) * 1.5
                }}>
                <Marker
                    title={location.state.patientName}
                    description={location.state.patientAddress}
                    coordinate={{
                        latitude: patientLatNo,
                        longitude: patientLongNo
                    }} />
                <Marker
                    title={location.state.helperName}
                    description={location.state.helperAddress}
                    coordinate={{
                        latitude: helperLatNo,
                        longitude: helperLongNo
                    }} />
            </MapView>
            <Text style={{ backgroundColor: 'white' }}>Estimated travel time: {location.state.time} minutes</Text>
            <Button title="accept" onPress={async () => await ServerCommunicator.acceptHelp(location.state.patientUsername, await messaging().getToken())}></Button>
        </View>
    );
}