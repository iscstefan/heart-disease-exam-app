import React from 'react';
import HomePage from './HomePage';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Patients from './Patients';
import PatientDetails from './PatientDetails';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            user: null
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
                            <HomePage user={this.state.user} setUserState={this.setUserState}/>
                        </Route>
                        <Route path='/users/:uid/patients' exact={true}>
                            <Patients user={this.state.user}/>
                        </Route>
                        <Route path='/users/:uid/patients/add' exact={true}>
                            <PatientDetails user={this.state.user}/>
                        </Route>
                        <Route>
                            <div>Not Found</div>
                        </Route>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App;
