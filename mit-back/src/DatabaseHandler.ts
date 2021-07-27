import { Client as MapsClient } from '@googlemaps/google-maps-services-js';
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
    private static gmaps = new MapsClient({});

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
    public static async sendToNearby(username: string): Promise<boolean> {
        const user = await this.UserModel.findOne({ username: username });
        if (!user?.address || !process.env.maps) return false;

        const now = new Date();
        
        const location = (await this.gmaps.geocode({
            params: {
                address: user.address,
                key: process.env.maps
            }
        })).data.results[0].geometry.location;

        await admin.messaging().sendToDevice((await this.getClosestTwoHelpers(user, now)).map(user => user.deviceToken ?? '').filter(user => user != ''), {
            notification: {
                title: 'HELP',
                body: `${user.name ?? 'Somebody'} needs help at ${user.address ?? 'an unknown location'}. ${now.getHours()}${now.getMinutes()}hrs`,
            },
            data: {
                patientUsername: user.username,
                patientName: user.name ?? 'Someone',
                patientAddress: user.address ?? 'Somewhere',
                patientLat: location.lat.toString(),
                patientLong: location.lng.toString()
            }
        });

        return true;
    }

    /**
     * Get travel information data for helper
     * @param patientUsername 
     * @param helperDevice device token of helper
     * @returns information Object
     */
    public static async requestPreliminaryInfo(patientUsername: string, helperDevice: string): Promise<{[key: string]: string} | boolean> {
        const patient = await this.UserModel.findOne({ username: patientUsername });
        const helper = await this.UserModel.findOne({ deviceToken: helperDevice });
        if (!helper?.address || !patient || !process.env.maps) return false;

        const location = (await this.gmaps.geocode({
            params: {
                address: helper.address,
                key: process.env.maps
            }
        })).data.results[0].geometry.location;

        return {
            time: (await this.getTravelTime(helper, patient) ?? Infinity / 60).toString(),
            helperName: helper.name ?? 'Somebody',
            helperAddress: helper.address,
            helperLat: location.lat.toString(),
            helperLong: location.lng.toString()
        };
    }

    /**
     * Send alert to a patient that a helper is coming
     * @param patientUsername 
     * @param helperDevice device token of helper
     * @returns boolean successful. True indicates message was sent successfully
     */
    public static async sendToPatient(patientUsername: string, helperDevice: string): Promise<boolean> {
        const patient = await this.UserModel.findOne({ username: patientUsername });
        const helper = await this.UserModel.findOne({ deviceToken: helperDevice });
        if (!patient?.deviceToken || !helper) return false;
        const now = new Date();

        await admin.messaging().sendToDevice([patient.deviceToken], {
            notification: {
                title: 'Help is coming',
                body: `${helper.name ?? 'Somebody'} accepted the notification at ${now.getHours()}${now.getMinutes()}hrs and should arrive in approximately ${(await this.getTravelTime(helper, patient) ?? Infinity) / 60} minutes`,
            }
        });

        return true;
    }

    private static async getClosestTwoHelpers(patient: User, time: Date): Promise<User[]> {
        const now = time.getHours() * 60 + time.getMinutes();

        return (await Promise.all(
            (await this.UserModel.find({ patient: false }))
                .filter(helper => helper.deviceToken && helper.timesAvailable?.some(time => {
                    const start = parseInt(time.start.slice(0, 2)) * 60 + parseInt(time.start.slice(2, 4));
                    const end = parseInt(time.end.slice(0, 2)) * 60 + parseInt(time.end.slice(2, 4));
                    return start <= now && now <= end;
                }))
                .map(async (helper: User) => ({
                    helper: helper,
                    seconds: await this.getTravelTime(helper, patient) ?? Infinity
                }))))
            .sort((a, b) => a.seconds - b.seconds)
            .slice(0, 2)
            .map(data => data.helper);
    }

    private static async getTravelTime(helper: User, patient: User): Promise<number | undefined> {
        if (!helper.address || !patient.address) return undefined;
        return (await this.gmaps.directions({
            params: {
                origin: patient.address,
                destination: helper.address,
                key: process.env.maps ?? ''
            }
        })).data.routes[0].legs[0].duration.value;
    }
}