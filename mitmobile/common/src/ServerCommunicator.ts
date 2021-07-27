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
     * @param username username of user needing help
     * @returns boolean successful. True indicates message was sent successfully
     */
    public static async requestHelp(username: string): Promise<boolean> {
        const response = await fetch(`http://${serverIP}/help?username=${username}`);
        return await response.json();
    }

    /**
     * Request help acceptance message to be sent from a helper to a patient
     * @param patientUsername username of patient to help
     * @param helperDevice device token of helper
     * @returns boolean successful. True indicates message was sent successfully
     */
    public static async acceptHelp(patientUsername: string, helperDevice: string): Promise<boolean> {
        const response = await fetch(`http://${serverIP}/accept?patient=${patientUsername}&helper=${helperDevice}`);
        return await response.json();
    }
    /**
     * Request information relevant for a help response
     * @param patientUsername username of patient to help
     * @param helperDevice device token of helper
     * @returns information Object
     */
    public static async requestInfo(patientUsername: string, helperDevice: string): Promise<{ [key: string]: string }> {
        const response = await fetch(`http://${serverIP}/info?patient=${patientUsername}&helper=${helperDevice}`);
        return await response.json();
    }
}
