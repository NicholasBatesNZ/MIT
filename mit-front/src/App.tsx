import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Components/Home';
import Landing from './Components/Landing';
import Login from './Components/Login';
import Register from './Components/Register';

export default function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/home" component={Home} />
                <Route path="/" component={Landing} />
            </Switch>
        </BrowserRouter>
    );
}