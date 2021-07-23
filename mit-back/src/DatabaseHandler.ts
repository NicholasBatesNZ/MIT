import bcrypt from 'bcrypt';
import admin from 'firebase-admin';
import { connect, connection, model, Schema } from 'mongoose';
import { User } from '.';

const userSchema = new Schema<User>({
    username: String,
    password: String,
    name: String,
    patient: Boolean,
    age: Number,
    address: String,
    timesAvailable: [{
        start: String,
        end: String
    }],
    deviceToken: String
});

export default class DatabaseHandler {

    private static UserModel = model<User>('user', userSchema);

    /**
     * Initialise database connection
     */
    public static async init(): Promise<void> {
        connection.on('error', console.error);
        connection.on('connected', () => console.log('Connected to db'));

        if (!process.env.mongo) {
            console.error('No db uri found in local .env');
            process.exit(1);
        }

        await connect(process.env.mongo);
    }

    /**
     * Adds a user to the database
     * @param user User to register
     * @returns boolean successful. True indicates user was added successfully
     */
    public static async register(user: User): Promise<boolean> {
        if (await this.UserModel.findOne({ username: user.username })) {
            return false;
        }

        const newUser = new this.UserModel(user);
        newUser.password = await bcrypt.hash(user.password, 10);
        newUser.deviceToken = '';
        await newUser.save();

        return true;
    }

    /**
     * Authenticate user and optionally update device token
     * @param username username to search for
     * @param password password to search for
     * @param deviceToken optional updated device token
     * @returns Object of Type: { authenticated: boolean, patient?: boolean }
     */
    public static async authenticate(username: string, password: string, deviceToken?: string): Promise<{ authenticated: boolean, patient?: boolean }> {
        const user = await this.UserModel.findOne({ username: username });
        if (!user) return { authenticated: false };

        if (!await bcrypt.compare(password, user.password)) return { authenticated: false };

        if (deviceToken) {
            user.deviceToken = deviceToken;
            await user.save();
        }

        return { authenticated: true, patient: user.patient };
    }

    /**
     * Send help request from a user to nearby caregivers
     * @param username 
     * @param password 
     * @returns boolean successful. True indicates message was sent successfully
     */
    public static async sendToNearby(username: string, password: string): Promise<boolean> {
        const user = await this.UserModel.findOne({ username: username });
        if (!user || !await bcrypt.compare(password, user.password)) return false;

        await admin.messaging().sendToDevice((await this.UserModel.find({})).map(user => user.deviceToken ?? '').filter(user => user != ''), {
            notification: {
                title: 'HELP',
                body: `${user.name ?? 'Somebody'} needs help at ${user.address ?? 'an unknown location'}`
            }
        });
        
        return true;
    }
}