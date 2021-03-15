import React from 'react';
import HomePage from './HomePage';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';


class App extends React.Component {
    constructor() {
        super();

        this.state = {
            user: {
                username: '',
                id: '',
                token: ''
            }
        }

        this.setUserState = (user) => {
            this.setState({
                user: user
            })
        }
    }

    render() {
        return (
            <div >
                <Router>
                    <Switch>
                        <Route path='/' exact={true}>
                            <HomePage />
                        </Route>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App;
