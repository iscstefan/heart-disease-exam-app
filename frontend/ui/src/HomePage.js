import React from 'react';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router';
import authStore from './AuthStore.js';
import constants from './constants.js';
import CustomMenuBar from './CustomMenuBar';
import { toggleWidget, Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import ChatBot from './ChatBot.js';

class HomePage extends React.Component {
    componentDidMount() {
        if (!authStore.user) {
            authStore.checkAuth();
        }

        authStore.emitter.addListener('AUTH_SUCCESS', () => {
            console.log(authStore.user);
            this.props.setUserState(authStore.user);
        });
        authStore.emitter.addListener('AUTH_FAILED', () => {

        });
    }

    render() {
        return (
            <div >
                <CustomMenuBar user={this.props.user} />

                <div className="p-grid p-m-2 p-justify-center p-align-center">
                    <div className='p-col-0 p-md-2'/>
                    <div className='p-col-0 p-md-3'>
                        <div className='landing-primary-text'>
                            Predict a Heart Disease
                        </div>
                        <div className='landing-secondary-text'>
                            Sign in to have access to your patients and your previous diagnostics.
                        </div>
                        <Button
                            label="Sign in with Google"
                            className="p-button-secondary p-button-lg p-button-rounded landing-auth-button"
                            icon="pi pi-google"
                            onClick={() => {
                                window.location.href = constants.server_url + "/auth/google";
                            }}/>
                    </div>
                    <div className='p-col-12 p-md-6 '>
                        <img src={process.env.PUBLIC_URL + 'Doctor2.svg'} className={'landing-image'} height={10} alt=''/>
                    </div>
                    <div className='p-col-0 p-md-1  ' />
                </div>
                <ChatBot/>
            </div>
        )
    }
}

export default withRouter(HomePage);