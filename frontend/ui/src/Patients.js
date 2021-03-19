import React from 'react';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router';
import authStore from './AuthStore.js';
import constants from './constants.js';
import CustomMenuBar from './CustomMenuBar'
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PatientStore from './PatientStore.js';
import PatientDataTable from './PatientDataTable'

/*
TO DO:
-buton adaugare
-selectie
-poate coloana result : pass/failed
-de modificat telehpone in telephone in petient.js (backend)
*/

class Patients extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            patients: [],
            page: 0
        }

        this.store = new PatientStore(this.props.user);
    }

    componentDidMount() {
        if (!authStore.user) {
            this.props.history.push('/');
        }

        this.store.getPatients();

        this.store.emitter.addListener('GET_EXPERIENCES_SUCCESS', () => {
            this.setState({
                patients: this.store.data
            })
        });

        this.store.emitter.addListener('UNAUTHORIZED', () => {
            this.props.history.push('/')
        });

    }

    render() {
        return (
            <div>
                <CustomMenuBar user={this.props.user} />
                <div className='title-bar p-d-flex p-flex-column p-jc-center p-ai-center'>
                    {/* <img src={process.env.PUBLIC_URL + 'Doctor.svg'} className={'text-bar'} alt='' width={350}/> */}
                    <span>Your Patients</span>
                </div>
                <div>
                    <TabView className={'p-d-flex p-flex-column p-jc-center p-ai-center p-mt-4'}>
                        <TabPanel header="Patients">
                            {
                                this.state.patients.length > 0 &&
                                <PatientDataTable patients={this.state.patients} setPage={(page) => { this.setState({ page: page }) }} />
                            }
                        </TabPanel>
                        <TabPanel header="Graphs">
                            Content II
                         </TabPanel>
                    </TabView>
                </div>
            </div>
        )
    }
}

export default withRouter(Patients);
