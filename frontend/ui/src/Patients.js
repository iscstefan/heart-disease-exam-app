import React from 'react';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router';
import authStore from './AuthStore.js';
import CustomMenuBar from './CustomMenuBar'
import { TabView, TabPanel } from 'primereact/tabview';
import PatientStore from './PatientStore.js';
import PatientDataTable from './PatientDataTable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import { InputTextarea } from 'primereact/inputtextarea';
import PatientDetails from './PatientDetails.js';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import DiagnosticDataTable from './DiagnosticDataTable.js';
import Graphs from './Graphs.js';
import DiagnosticStore from './DiagnosticStore.js';

class Patients extends React.Component {
    constructor(props) {
        super(props);

        this.emptyPatient = {
            firstname: '',
            lastname: '',
            age: '',
            sex: 'M',
            identification_number: '',
            email: '',
            telephone: '',
            observations: '',
        }

        this.state = {
            patients: [],
            isDialogShown: false,
            patient: this.emptyPatient,
            submitted: false,
            isPatientDetailsEnabled: false,
            selectedPatient: null,
            toast: React.createRef()
        }

        this.store = new PatientStore(this.props.user);

        this.showHideDialog = () => {
            if (!this.state.isDialogShown) {
                this.emptyPatient = {
                    firstname: '',
                    lastname: '',
                    age: '',
                    sex: 'M',
                    identification_number: '',
                    email: '',
                    telephone: '',
                    observations: '',
                }

                this.setState({
                    patient: this.emptyPatient,
                    submitted: false
                })
            }

            this.setState({
                isDialogShown: !this.state.isDialogShown
            })
        }

        this.setPatientDetailsEnabled = (patient) => {
            this.setState({
                selectedPatient: patient,
                isPatientDetailsEnabled: !this.state.isPatientDetailsEnabled
            })
        }

        this.handleChange = (ev) => {
            const patient = this.state.patient;
            patient[ev.target.name] = ev.target.value
            this.setState({
                patient: patient
            })
        }

        this.addPatient = () => {
            this.setState({ submitted: true });

            if (this.state.patient.firstname && this.state.patient.lastname && this.state.patient.age) {
                this.store.addPatient(this.state.patient);
            }
        }
    }

    componentDidMount() {
        if (!authStore.user) {
            this.props.history.push('/');
        }

        this.store.getPatients();

        this.store.emitter.addListener('GET_PATIENTS_SUCCESS', () => {
            this.setState({
                patients: this.store.data
            })
        });

        this.store.emitter.addListener('ADD_PATIENT_SUCCESS', () => {
            this.showHideDialog();
        });

        this.store.emitter.addListener('UNAUTHORIZED', () => {
            this.props.history.push('/')
        });

        this.store.emitter.addListener('ADD_PATIENT_ERROR', () => {
            this.state.toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Patient could not be modified (ID number might not be unique)' });
        });
    }

    render() {
        const dialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.showHideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.addPatient} />
            </React.Fragment>
        );

        const dropDownValues = [
            { label: 'Male', value: 'M' },
            { label: 'Female', value: 'F' },
        ]

        return (
            <div>
                <Toast ref={this.state.toast} />
                <CustomMenuBar user={this.props.user} />
                <div className='title-bar p-d-flex p-flex-column p-jc-center p-ai-center'>
                    <span>Your Patients</span>
                </div>
                <div>
                    {this.state.isPatientDetailsEnabled
                        ?
                        <PatientDetails patient={this.state.selectedPatient} setPatientDetailsEnabled={this.setPatientDetailsEnabled}
                            patientStore={this.store} />
                        :
                        <div>
                            <TabView className={'p-d-flex p-flex-column p-jc-center p-ai-center p-mt-4'}>
                                <TabPanel header="Patients">
                                    <Button label="Add Patient"
                                        className="p-ml-5 p-mt-4 p-mb-2 p-button-lg p-button-secondary p-button-text"
                                        style={{ fontWeight: 900 }}
                                        icon={'pi pi-plus'}
                                        onClick={this.showHideDialog} />
                                    {
                                        this.state.patients.length > 0
                                            ? <PatientDataTable patients={this.state.patients} setPatientDetailsEnabled={this.setPatientDetailsEnabled} />
                                            : <div style={{ width: '70vw', textAlign: 'center' }}></div>
                                    }
                                    <Dialog header="Add a patient" footer={dialogFooter} visible={this.state.isDialogShown} className={'add-patient-dialog p-fluid'} onHide={this.showHideDialog}>
                                        <div className="p-field">
                                            <label htmlFor="firstname">Firstname:</label>
                                            <InputText id="firstname" name="firstname" keyfilter='alpha' value={this.state.patient.firstname} onChange={this.handleChange} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.patient.firstname })} />
                                            {this.state.submitted && !this.state.patient.firstname && <small className="p-error">Firstname is required.</small>}
                                        </div>
                                        <div className="p-field ">
                                            <label htmlFor="lastname">Lastname:</label>
                                            <InputText id="lastname" name="lastname" keyfilter='alpha' value={this.state.patient.lastname} onChange={this.handleChange} required
                                                className={classNames({ 'p-invalid': this.state.submitted && !this.state.patient.lastname })} />
                                            {this.state.submitted && !this.state.patient.lastname && <small className="p-error">Lastname is required.</small>}
                                        </div>
                                        <div className="p-field ">
                                            <label htmlFor="age">Age:</label>
                                            <InputText id="age" name="age" keyfilter='pint' value={this.state.patient.age} onChange={this.handleChange} required
                                                className={classNames({ 'p-invalid': this.state.submitted && !this.state.patient.age })} />
                                            {this.state.submitted && !this.state.patient.age && <small className="p-error">Age is required.</small>}
                                        </div>
                                        <div className="p-field">
                                            <label htmlFor="sex">Sex:</label>
                                            <Dropdown value={this.state.patient.sex} options={dropDownValues}
                                                onChange={(e) => this.setState(prevState => {
                                                    let patient = { ...prevState.patient };
                                                    patient.sex = e.value;
                                                    return { patient }
                                                })} placeholder="Male/Female" />
                                        </div>
                                        <div className="p-field">
                                            <label htmlFor="identification_number">ID number:</label>
                                            <InputText id="identification_number" name="identification_number" value={this.state.patient.identification_number} onChange={this.handleChange} />
                                        </div>
                                        <div className="p-field">
                                            <label htmlFor="email">Email:</label>
                                            <InputText id="email" name="email" keyfilter='email' value={this.state.patient.email} onChange={this.handleChange} />
                                        </div>
                                        <div className="p-field">
                                            <label htmlFor="telephone">Telephone:</label>
                                            <InputText id="telephone" name="telephone" value={this.state.patient.telephone} onChange={this.handleChange} />
                                        </div>
                                        <div className="p-field">
                                            <label htmlFor="observations">Observations:</label>
                                            <InputTextarea rows={6} id='observations' name='observations' value={this.state.patient.observations} required onChange={this.handleChange} autoResize
                                                className={classNames({ 'p-invalid': this.state.submitted && this.state.patient.observations.length > 255 })} />
                                            {this.state.submitted && this.state.patient.observations.length > 255 && <small className="p-error">Number of characters must not exceed 255.</small>}
                                        </div>
                                    </Dialog>
                                </TabPanel>
                                <TabPanel header="Predictions">
                                    <DiagnosticDataTable user={this.props.user} />
                                </TabPanel>
                                <TabPanel header="Graphs">
                                    <div style={{ width: '80vw' }}>
                                        <Graphs store={new DiagnosticStore(this.props.user)}/>
                                    </div>
                                </TabPanel>
                            </TabView>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(Patients);
