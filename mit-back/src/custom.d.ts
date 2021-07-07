import { User } from '.';

declare module 'express-serve-static-core' {
    interface Request {
        user: User
    }
}