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
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';


class PatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            patient: this.props.patient,
            editingPatient: {},
            isEditing: false,
            submitted: false,
            toast: React.createRef()
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
                if (!(this.state.editingPatient.firstname && this.state.editingPatient.lastname
                    && this.state.editingPatient.age && this.state.editingPatient.sex))
                    return;

                this.setState({ submitted: false, isEditing: false, patient: this.state.editingPatient });
                this.props.patientStore.updatePatient(this.state.editingPatient);
            }
        }
    }

    componentDidMount() {
        this.props.patientStore.emitter.addListener('UPDATE_PATIENT_ERROR', () => {
            this.state.toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Patient could not be modified (ID number might not be unique)' });
        })
    }

    render() {
        const dropDownValues = [
            { label: 'Male', value: 'M' },
            { label: 'Female', value: 'F' },
        ]

        return (
            <div className="p-grid p-m-1 p-justify-center p-align-center">
                <Toast ref={this.state.toast} position="top-right" />
                <div className='p-col-2' />
                <div className='p-col-4'>
                    <div style={{ height: '7vh' }} />
                    <Button icon="pi pi-angle-left" className="p-button-rounded p-ml-3 p-button-outlined"
                        onClick={() => this.props.setPatientDetailsEnabled(null)} />

                    <div style={{ textAlign: 'right' }}>
                        <span className="p-buttonset">
                            <Button label={this.state.isEditing ? 'Save' : 'Edit'}
                                onClick={this.setIsEditing}
                                style={{ fontWeight: 900, fontSize: 19 }}
                                className="p-button-text "
                                icon={this.state.isEditing ? 'pi pi-check' : 'pi pi-pencil'} />
                            {this.state.isEditing &&
                                <Button label='Cancel' onClick={() => { this.setState({ isEditing: false }) }}
                                    className="p-button-text"
                                    style={{ fontWeight: 900, fontSize: 19 }} />
                            }
                        </span>
                    </div>
                    <div style={{ height: '4vh' }}></div>
                    <div className='input-container'>
                        <label htmlFor='firstname'> Firstname:</label>
                        <Inplace className='p-mt-2 p-mb-3' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
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
                        <label htmlFor='lastname'> Lastname:</label>
                        <Inplace className='p-mt-2 p-mb-3' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <b style={{ fontSize: 23 }}>{this.state.patient.lastname}</b>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText id="lastname" name="lastname" keyfilter='alpha' value={this.state.editingPatient.lastname} onChange={this.handleChange} required
                                    className={classNames({ 'p-invalid': this.state.submitted && !this.state.editingPatient.lastname })} />
                                {this.state.submitted && !this.state.editingPatient.lastname && <small className="p-error" style={{ display: 'block' }}>Lastname is required.</small>}
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='age'> Age:</label>
                        <Inplace className='p-mt-2 p-mb-3' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <span style={{ fontSize: 17 }}>{this.state.patient.age}</span>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText id="age" name="age" keyfilter='pint' value={this.state.editingPatient.age} onChange={this.handleChange} required
                                    className={classNames({ 'p-invalid': this.state.submitted && !this.state.editingPatient.age })} />
                                {this.state.submitted && !this.state.editingPatient.age && <small className="p-error">Age is required.</small>}
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='sex'> Sex:</label>
                        <Inplace className='p-mt-2 p-mb-3' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <span style={{ fontSize: 17 }}>{this.state.patient.sex}</span>
                            </InplaceDisplay>
                            <InplaceContent>
                                <Dropdown value={this.state.editingPatient.sex} options={dropDownValues}
                                    onChange={(e) => this.setState(prevState => {
                                        let editingPatient = { ...prevState.editingPatient };
                                        editingPatient.sex = e.value;
                                        return { editingPatient }
                                    })} placeholder="Male/Female" />
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='id_number'> ID number:</label>
                        <Inplace className='p-mt-2 p-mb-3' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <span style={{ fontSize: 17 }}>{this.state.patient.identification_number}</span>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText id="id_number" name="identification_number" value={this.state.editingPatient.identification_number} onChange={this.handleChange} />
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='telephone'> Telephone:</label>
                        <Inplace className='p-mt-2 p-mb-3' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <span style={{ fontSize: 17 }}>{this.state.patient.telephone}</span>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText id="telephone" name="telephone" value={this.state.editingPatient.telephone} onChange={this.handleChange} />
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='email'> Email:</label>
                        <Inplace className='p-mt-2 p-mb-3' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <span style={{ fontSize: 17 }}>{this.state.patient.email}</span>
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText id="email" name="email" keyfilter='email' value={this.state.editingPatient.email} onChange={this.handleChange} />
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='observations'> Observations:</label>
                        <Inplace className='p-mt-2 p-mb-3' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })}>
                            <InplaceDisplay>
                                <div style={{ wordBreak: 'break-all' }}>
                                    {this.state.patient.observations}
                                </div>
                            </InplaceDisplay>
                            <InplaceContent >
                                <InputTextarea readonly id='observations' name='observations' value={this.state.editingPatient.observations}
                                    required onChange={this.handleChange} autoResize
                                    rows={14}
                                    className={classNames({ 'p-invalid': this.state.submitted && this.state.editingPatient.observations.length > 255 })} />
                                {this.state.submitted && this.state.editingPatient.observations.length > 255 && <small style={{ display: 'block' }} className="p-error">Number of characters must not exceed 255.</small>}
                            </InplaceContent>
                        </Inplace>
                    </div>


                </div>
                <div className='p-col-6' />


            </div>
        )
    }
}

export default withRouter(PatientDetails);
