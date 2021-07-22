export interface AuthenticateUserType {
    username: string;
    password: string;
}

export interface UserType extends AuthenticateUserType {
    name: string,
    patient: boolean,
    age: Number,
    address: string,
    timesAvailable: {
        start: string,
        end: string
    }[]
}

export interface LoginUserType {
    username?: string;
    password?: string;
}

export interface RegisterUserType extends LoginUserType {
    name?: string,
    patient?: boolean,
    age?: Number,
    address?: string,
    timesAvailable?: {
        start: string,
        end: string
    }[]
}

export interface HistoryPropType {
    history: { push: (ar0: string, arg1?: unknown) => void };
}
