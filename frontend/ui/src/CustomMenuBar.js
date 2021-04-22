import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router';
import { toggleWidget } from 'react-chat-widget';

class CustomMenuBar extends React.Component {
    render() {
        const items = [
            {
                label: 'Home',
                command: (event) => {
                    this.props.history.push(``);
                }
            },
            {
                label: 'Graphs',
                command: (event) => {
                    this.props.history.push(`/graphs`);
                }
            },
            {
                label: 'Predict',
                command: (event) => {
                    this.props.history.push(`/predict`);
                }
            },
            {
                label: 'COVID-19',
                command: (event) => {
                    
                        toggleWidget();
                    
                    
                }
            }
        ];

        let MenuBarEndButton = {};

        if (this.props.user) {
            const userItem = {
                label: this.props.user.email,
                icon: 'pi pi-fw pi-user',
                command: (event) => {
                    this.props.history.push(`/users/${this.props.user.id}/patients`);
                }
            }

            items.push(userItem);

            MenuBarEndButton = <Button label="Sign Out"
                className="header-button p-button-text"
                icon="pi pi-sign-out"
                onClick={() => {
                    window.location.href = "http://localhost:8080/logout";
                }} />

        } else {
            MenuBarEndButton = <Button label="Sign In"
                className="header-button p-button-text"
                icon="pi pi-google"
                onClick={() => {
                    window.location.href = "http://localhost:8080/auth/google";
                }} />
        }

        return (
            <div>
                <Menubar model={items} end={MenuBarEndButton}/>
            </div>
        );
    }
};

export default withRouter(CustomMenuBar);