import { Link } from 'react-router-dom';

export default function Landing(): JSX.Element {
    return (
        <div>
            <Link to={'/register'}>Register</Link>
            <p />
            <Link to={'/login'}>Login</Link>
        </div>
    );
}