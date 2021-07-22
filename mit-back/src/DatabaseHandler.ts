import bcrypt from 'bcrypt';
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
    }]
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
        await newUser.save();

        return true;
    }

    /**
     * Authenticate user
     * @param username username to search for
     * @param password password to search for
     * @returns boolean successful. True indicates user was authenticated successfully
     */
    public static async authenticate(username: string, password: string): Promise<boolean> {
        const user = await this.UserModel.findOne({ username: username });
        if (!user) return false;

        return await bcrypt.compare(password, user.password);
    }
}