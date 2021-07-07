import { UserType } from './types';
import { AuthenticateUserType } from './types';

export default abstract class ServerCommunicator {

    private static getHeaders(username: string, password: string) {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
        };
    }

    /**
     * Send user data to be added to the database
     * @param user User information to store in database
     * @returns true if user was added successfully
     */
    public static async register(user: UserType): Promise<boolean> {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: this.getHeaders(user.username, user.password),
            body: JSON.stringify({
                name: user.name,
                gender: user.gender,
                email: user.email
            })
        });
        return await response.json();
    }

    /**
     * Authenticate user
     * @param user User to authenticate
     * @returns true is user was successfully authenticated
     */
    public static async authenticate(user: AuthenticateUserType): Promise<boolean> {
        const response = await fetch('http://localhost:3001/authenticate', {
            method: 'GET',
            headers: this.getHeaders(user.username, user.password)
        });
        return await response.json();
    }
}