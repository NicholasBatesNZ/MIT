import base64 from 'react-native-base64';
import { serverIP } from '../../env';
import { AuthenticateUserType, UserType } from './types';

export default abstract class ServerCommunicator {
    private static getHeaders(username: string, password: string) {
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + base64.encode(`${username}:${password}`),
        };
    }

    /**
     * Send user data to be added to the database
     * @param user User information to store in database
     * @returns true if user was added successfully
     */
    public static async register(user: UserType): Promise<boolean> {
        const response = await fetch(`http://${serverIP}/register`, {
            method: 'POST',
            headers: this.getHeaders(user.username, user.password),
            body: JSON.stringify({
                name: user.name,
                patient: user.patient,
                age: user.age,
                address: user.address,
                timesAvailable: user.timesAvailable
            }),
        });
        return await response.json();
    }

    /**
     * Authenticate user
     * @param user User to authenticate
     * @returns true is user was successfully authenticated
     */
    public static async authenticate(user: AuthenticateUserType): Promise<boolean> {
        const response = await fetch(`http://${serverIP}/authenticate`, {
            method: 'GET',
            headers: this.getHeaders(user.username, user.password),
        });
        return await response.json();
    }
}
