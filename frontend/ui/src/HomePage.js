import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router';
import authStore from './AuthStore.js'


class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(!authStore.user) {
            authStore.checkAuth();
        }
        authStore.emitter.addListener('AUTH_SUCCESS', () => {
            console.log(authStore.user);
            // this.props.onLogin(loginStore.user);
            // this.props.history.push('/')
        });
        authStore.emitter.addListener('AUTH_FAILED', () => {
            // if (this.toast.current !== null)
            //     this.toast.current.show({ severity: 'info', summary: 'Login Failed', detail: 'Invalid credentials', life: 3000 });
            console.log("auth failed");

        });
    }

    render() {
        const items = [
            {
                label: 'Home',
            },
            {
                label: 'Graphs',
            },
            {
                label: 'Predict',
            }
        ];

        return (
            <div >
                <Menubar model={items} end={
                    <Button label="Sign In" 
                            className="header-button p-button-text" 
                            icon="pi pi-google"
                            onClick={() => {window.location.href="http://localhost:8080/auth/google";
                                authStore.signIn()}} />
                } />


                <div className="p-grid p-m-2 p-justify-center p-align-center">
                    <div className='p-col-0 p-md-2  ' />
                    <div className='p-col-0 p-md-3  '>
                        <div className='landing-primary-text'>
                            Predict a Heart Disease
                        </div>
                        <div className='landing-secondary-text'>
                            Sign in to have access to your patients and your previous diagnostics.
                        </div>
                        <Button label="Sign in with Google" className="p-button-lg p-button-rounded landing-auth-button" icon="pi pi-google" />
                    </div>
                    <div className='p-col-12 p-md-6 '>
                        <img src={process.env.PUBLIC_URL + 'Doc.svg'} className={'landing-image'} height={10} />
                    </div>
                    <div className='p-col-0 p-md-1  ' />
                </div>

            </div>
        )
    }
}

export default withRouter(HomePage);