import React from 'react';
import HomePage from './HomePage';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Patients from './Patients';
import PatientDetails from './PatientDetails';
import PredictPage from './PredictPage';
import Graphs from './Graphs';
import GraphsPage from './GraphsPage';
import constants from './constants';


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
                        <Route path='/predict' exact={true}>
                            <PredictPage user={this.state.user}/>
                        </Route>
                        <Route path='/graphs' exact={true}>
                            <GraphsPage user={this.state.user} data={constants.diagnostics}/>
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
