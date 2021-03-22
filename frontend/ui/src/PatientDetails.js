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
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';


/*
TO DO:
posibil warning la label for...
*/

class PatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            patient: this.props.patient,
            editingPatient: { firstname: 'lala' },
            isEditing: false,
            submitted: false
        }

        this.store = new PatientStore(this.props.user);

        this.handleChange = (ev) => {
            const patient = this.state.editingPatient;
            patient[ev.target.name] = ev.target.value
            this.setState({
                editingPatient: patient
            })
        }

        this.setIsEditing = () => {
            if (!this.state.isEditing) {
                this.setState({ submitted: true, isEditing: true, editingPatient: Object.assign({}, this.state.patient) });
            } else {
                if (!this.state.editingPatient.firstname)
                    return;
                //salvam in bd
                //salvam modificarea si local
                this.setState({ submitted: false, isEditing: false, patient: this.state.editingPatient });
                this.props.patientStore.updatePatient(this.state.editingPatient);
            }
        }
    }

    componentDidMount() {
        this.props.patientStore.emitter.addListener('UPDATE_PATIENT_ERROR', () => {
            //TO DO
        })
    }

    render() {
        return (
            <div className="p-grid p-m-1 p-justify-center p-align-center">
                <div className='p-col-2' />
                <div className='p-col-8'>
                    <div style={{ height: '7vh' }} />
                    <Button icon="pi pi-angle-left" className="p-button-rounded p-ml-3 p-button-outlined"
                        onClick={() => this.props.setPatientDetailsEnabled(null)} />

                    <div style={{ textAlign: 'right' }}>
                        <span className="p-buttonset">
                            <Button label={this.state.isEditing ? 'Save' : 'Edit'}
                                onClick={this.setIsEditing}
                                style={{ fontWeight: 900, fontSize: 18 }}
                                className="p-button-text p-button-raised" />
                            {this.state.isEditing &&
                                <Button label='Cancel' onClick={() => { this.setState({ isEditing: false }) }}
                                    className="p-button-text"
                                    style={{ fontWeight: 900, fontSize: 18 }} />
                            }
                        </span>
                    </div>
                    <div style={{ height: '4vh' }}></div>
                    <div className='input-container'>
                        <label for='firstname'> Firstname:</label>
                        <Inplace className='p-mt-2 p-mb-3' id='firstname' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <b style={{ fontSize: 23 }}>{this.state.patient.firstname}</b>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText id="firstname" name="firstname" keyfilter='alpha' value={this.state.editingPatient.firstname} onChange={this.handleChange} required className={classNames({ 'p-invalid': this.state.submitted && !this.state.editingPatient.firstname })} />
                                {this.state.submitted && !this.state.editingPatient.firstname && <small className="p-error" style={{ display: 'block' }}>Firstname is required.</small>}
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label for='lastname'> Lastname:</label>
                        <Inplace className='p-mt-2 p-mb-3' id='lastname' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <b style={{ fontSize: 23 }}>Stefan</b>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText />
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label for='id_number'> ID number:</label>
                        <Inplace className='p-mt-2 p-mb-3' id='id_number' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <span style={{ fontSize: 17 }}>12312321321312</span>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText />
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label for='telephone'> Telephone:</label>
                        <Inplace className='p-mt-2 p-mb-3' id='telephone' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <span style={{ fontSize: 17 }}>12312321321312</span>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText />
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label for='email'> Email:</label>
                        <Inplace className='p-mt-2 p-mb-3' id='email' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <span style={{ fontSize: 17 }}>asdfsdafdas@asdas</span>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText />
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label for='observations'> Email:</label>
                        <Inplace className='p-mt-2 p-mb-3' id='observations' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <span style={{ fontSize: 17 }}>asdfsdafdas@asdas</span>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText />
                            </InplaceContent>
                        </Inplace>
                    </div>


                </div>
                <div className='p-col-2' />


            </div>
        )
    }
}

export default withRouter(PatientDetails);
