import React from 'react';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router';
import authStore from './AuthStore.js';
import constants from './constants.js';
import CustomMenuBar from './CustomMenuBar'

class Patients extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (!authStore.user) {
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div>
                <CustomMenuBar user={this.props.user} />
                <div class='title-bar p-d-flex p-flex-column p-jc-center p-ai-center'>
                        {/* <img src={process.env.PUBLIC_URL + 'Doctor.svg'} className={'text-bar'} alt='' width={350}/> */}
                        <span>Your Patients</span>
                </div>
            </div>
        )
    }
}

export default withRouter(Patients);
