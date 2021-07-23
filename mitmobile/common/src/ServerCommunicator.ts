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
     * @param deviceToken Token for users device for notifications
     * @returns Object of Type: { authenticated: boolean, patient?: boolean }
     */
    public static async authenticate(user: AuthenticateUserType, deviceToken: string): Promise<{ authenticated: boolean, patient?: boolean }> {
        const response = await fetch(`http://${serverIP}/authenticate?deviceToken=${deviceToken}`, {
            method: 'GET',
            headers: this.getHeaders(user.username, user.password),
        });
        return await response.json();
    }

    /**
     * Request help message to be sent from a user to nearby caregivers
     * @param user User needing help
     * @returns boolean successful. True indicates message was sent successfully
     */
    public static async requestHelp(user: AuthenticateUserType): Promise<boolean> {
        const response = await fetch(`http://${serverIP}/help`, {
            method: 'POST',
            headers: this.getHeaders(user.username, user.password),
        });
        return await response.json();
    }
}
