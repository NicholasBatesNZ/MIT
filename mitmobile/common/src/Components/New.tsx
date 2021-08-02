import React from 'react';
import { StyleSheet, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { LatLng, Marker } from 'react-native-maps';

export default class Login extends React.Component<{}, { position: LatLng }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            position: {
                latitude: -36.8509,
                longitude: 174.7645
            }
        };
    }

    componentDidMount() {
        Geolocation.getCurrentPosition(async (position) => this.setState({
            position: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        }), console.error, { enableHighAccuracy: true });
    }

    render(): JSX.Element {
        return (
            <View style={{ ...StyleSheet.absoluteFillObject }}>
                <MapView
                    style={{ ...StyleSheet.absoluteFillObject }}
                    region={{
                        ...this.state.position,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01
                    }}>
                    <Marker coordinate={this.state.position} />
                </MapView>
            </View>
        );
    }
}