import React from 'react';
import HomePage from './HomePage';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Patients from './Patients';
import PredictPage from './PredictPage';
import GraphsPage from './GraphsPage';
import constants from './constants';
import CovidPage from './CovidPage';
import { addResponseMessage } from 'react-chat-widget';


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

    componentDidMount() {
        addResponseMessage("Greetings. You can ask any questions regarding COVID-19.")
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
                        <Route path='/covid19' exact={true}>
                            <CovidPage user={this.state.user}/>
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
