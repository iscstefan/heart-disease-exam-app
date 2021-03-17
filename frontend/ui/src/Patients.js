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

/*
TO DO:
-de pus intr-o componenta noua tabelul
-buton adaugare
-selectie

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
        const codeBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <span className="p-column-title">Firstname</span>
                    {rowData.firstname}
                </React.Fragment>
            );
        }

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
                                <div style={{ width: '70vw' }} className={'datatable-responsive-demo'} >
                                    <div className="card">
                                        <DataTable value={this.state.patients} className={'p-datatable-responsive-demo p-mt-4'}
                                            paginator={this.state.patients.length >= 10} rows={10} first={this.state.page} onPage={(e) => this.setState({ page: e.first })}
                                            resizableColumns columnResizeMode="expand">
                                            <Column field="firstname" header="Firstname" body={codeBodyTemplate}></Column>
                                            <Column field="lastname" header="Lastname"></Column>
                                            <Column field="email" header="Email" style={{width:'35%'}}></Column>
                                            <Column field="identification_number" header="ID number"></Column>
                                        </DataTable>
                                    </div>
                                </div>
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
