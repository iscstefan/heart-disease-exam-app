import React from 'react';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router';
import authStore from './AuthStore.js';
import CustomMenuBar from './CustomMenuBar'
import { TabView, TabPanel } from 'primereact/tabview';
import PatientDataTable from './PatientDataTable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import { InputTextarea } from 'primereact/inputtextarea';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';

class PatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            patient: this.props.patient,
            editingPatient: {},
            diagnostic: {},
            isDialogShown: false,
            isEditing: false,
            submitted: false,
            isSubmittingDialog: true,
            isDiagnosticSubmitted: false,
            prediction: '',
            toast: React.createRef()
        }

        this.showHideDialog = () => {
            if (!this.state.isDialogShown) {
                const emptyDiagnostic = {
                    age: this.state.patient.age,
                    sex: this.state.patient.sex,
                    cp: '0',
                    trestbps: '',
                    chol: '',
                    fbs: '0',
                    restecg: '1',
                    thalach: '',
                    exang: '0',
                    oldpeak: '',
                    slope: '1',
                    ca: '0',
                    thal: '1'
                }

                this.setState({
                    diagnostic: emptyDiagnostic,
                    isDiagnosticSubmitted: false,
                    isSubmittingDialog: false,
                    prediction: ''
                })
            }

            this.setState({
                isDialogShown: !this.state.isDialogShown
            })
        }

        this.handleDiagnosticChange = (ev) => {
            const diagnostic = this.state.diagnostic;
            diagnostic[ev.target.name] = ev.target.value
            this.setState({
                diagnostic: diagnostic
            })
        }

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

        this.addDiagnostic = () => {
            this.setState({ isDiagnosticSubmitted: true });

            if (this.state.diagnostic.age
                && this.state.diagnostic.trestbps
                && this.state.diagnostic.chol
                && this.state.diagnostic.thalach
                && this.state.diagnostic.oldpeak) {

                this.setState({ isSubmittingDialog: true });
                this.props.patientStore.addDiagnostic(this.state.patient.id, this.state.diagnostic);
            }

        }
    }

    componentDidMount() {
        this.props.patientStore.emitter.addListener('UPDATE_PATIENT_ERROR', () => {
            this.state.toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Patient could not be modified (ID number might not be unique)' });
        })

        this.props.patientStore.emitter.addListener('ADD_DIAGNOSTIC_SUCCESS', () => {
            this.setState({ prediction: this.props.patientStore.diagnostic });
        })

        this.props.patientStore.emitter.addListener('ADD_DIAGNOSTIC_ERROR', () => {
            this.state.toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Invalid prediction' });
        })
    }

    render() {
        const dialogFooter = (
            <React.Fragment>
                {
                    this.state.isSubmittingDialog
                        ?
                        <Button label="Close" icon="pi pi-times" className="p-button-text" onClick={this.showHideDialog} />
                        :
                        <div>
                            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.showHideDialog} />
                            <Button label="Submit" icon="pi pi-check" className="p-button-text" onClick={this.addDiagnostic} />
                        </div>
                }

            </React.Fragment>
        );

        const dropDownValues = [
            { label: 'Male', value: 'M' },
            { label: 'Female', value: 'F' },
        ];

        const cpDropDownValues = [
            { label: 'Asymptomatic', value: '0' },
            { label: 'Atypical angina', value: '1' },
            { label: 'Pain without relation to angina', value: '2' },
            { label: 'Typical angina', value: '3' }
        ];

        const fbsDropDownValues = [
            { label: 'Lower', value: '0' },
            { label: 'Higher', value: '1' },
        ]

        const exangDropDownValues = [
            { label: 'No', value: '0' },
            { label: 'Yes', value: '1' },
        ]

        const restecgDropDownValues = [
            { label: 'Probable left ventricular hypertrophy', value: '0' },
            { label: 'Normal', value: '1' },
            { label: 'Abnormalities - T wave or ST segment', value: '2' },
        ]

        const slopeDropDownValues = [
            { label: 'Descending', value: '0' },
            { label: 'Flat', value: '1' },
            { label: 'Ascending', value: '2' }
        ]

        const caDropDownValues = [
            { label: '0', value: '0' },
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' }
        ]

        const thalDropDownValues = [
            { label: 'Fixed defect', value: '1' },
            { label: 'Normal blood flow', value: '2' },
            { label: 'Reversible defect', value: '3' }
        ]


        const accept = () => {
            this.props.patientStore.deletePatient(this.state.patient.id);
            this.props.setPatientDetailsEnabled(null);
        };

        const confirmDeletion = () => {
            confirmDialog({
                message: 'Do you want to delete this patient?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                baseZIndex: 1000,
                accept
            });
        };

        return (
            <div>
                <div style={{ height: '8vh' }} />
                <div className="p-grid p-m-1 ">
                    <div className="p-col-12 p-md-2" />
                    <div className="p-col-12 p-md-5">
                        <Button icon="pi pi-angle-left" className="p-button-rounded p-ml-3 p-button-outlined"
                            onClick={() => this.props.setPatientDetailsEnabled(null)} />
                    </div>
                    <div className="p-col-12 p-md-4" style={{ textAlign: 'center' }}>
                        <div>
                            <span>
                                <Button label='Delete'
                                    onClick={confirmDeletion}
                                    style={{ fontWeight: 900, fontSize: 19 }}
                                    className="p-button-text"
                                    icon='pi pi-trash' />
                                <Button label={this.state.isEditing ? 'Save' : 'Edit'}
                                    onClick={this.setIsEditing}
                                    style={{ fontWeight: 900, fontSize: 19 }}
                                    className="p-button-text "
                                    icon={this.state.isEditing ? 'pi pi-check' : 'pi pi-pencil'} />
                                {
                                    this.state.isEditing &&
                                    <Button label='Cancel' onClick={() => { this.setState({ isEditing: false }) }}
                                        className="p-button-text"
                                        style={{ fontWeight: 900, fontSize: 19 }} />
                                }
                            </span>
                        </div>
                    </div>
                    <div className='p-col-12 p-md-1' />
                </div>
                <div className="p-grid p-m-1 p-justify-center p-align-center">
                    <Toast ref={this.state.toast} position="top-right" />
                    <div className='p-col-12 p-md-2' />
                    <div className='p-col-12 p-md-5'>
                        <div style={{ height: '3vh' }}></div>
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
                                        })} />
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
                            <Inplace className='p-mt-2 p-mb-3' disabled active={this.state.isEditing} onToggle={(e) => this.setState({ isEditing: e.value })} >
                                <InplaceDisplay>
                                    <div style={{ wordBreak: 'break-all', width: '30vw' }}>
                                        {this.state.patient.observations}
                                    </div>
                                </InplaceDisplay>
                                <InplaceContent >
                                    <InputTextarea id='observations' name='observations' value={this.state.editingPatient.observations}
                                        required onChange={this.handleChange} autoResize
                                        rows={14}
                                        className={classNames({ 'p-invalid': this.state.submitted && this.state.editingPatient.observations.length > 255 }), 'observations'} />
                                    {this.state.submitted && this.state.editingPatient.observations.length > 255 && <small style={{ display: 'block' }} className="p-error">Number of characters must not exceed 255.</small>}
                                </InplaceContent>
                            </Inplace>
                        </div>


                    </div>
                    <div className='p-col-12 p-md-4 p-col-align-start'>
                        <Button label='Predict a heart disease'
                            className='p-button-lg p-button-secondary  p-d-block p-mx-auto'
                            onClick={this.showHideDialog}
                            style={{
                                fontWeight: 900, fontSize: 20, padding: '1em',
                                marginTop: '4em'
                            }} />
                        <div>
                            <img src={process.env.PUBLIC_URL + 'prediction.svg'} className={'landing-image hide-photo'} height={10} alt=''
                                style={{
                                    marginTop: '5em'
                                }} />
                        </div>

                    </div>
                    <div className='p-col-12 p-md-1'></div>

                    <Dialog header="Predict" footer={dialogFooter} visible={this.state.isDialogShown} className={'add-patient-dialog p-fluid'} onHide={this.showHideDialog}>
                        <div className="p-field">
                            <label htmlFor="ageDiag">Age:</label>
                            <InputText id="ageDiag" name="age" keyfilter='pint' value={this.state.diagnostic.age} onChange={this.handleDiagnosticChange} required
                                className={classNames({ 'p-invalid': this.state.isDiagnosticSubmitted && !this.state.diagnostic.age })} />
                            {this.state.isDiagnosticSubmitted && !this.state.diagnostic.age && <small className="p-error">This field is required.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="sexDiag">Sex:</label>
                            <Dropdown id="sexDiag" value={this.state.diagnostic.sex} options={dropDownValues}
                                onChange={(e) => this.setState(prevState => {
                                    let diagnostic = { ...prevState.diagnostic };
                                    diagnostic.sex = e.value;
                                    return { diagnostic }
                                })} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="cp">Chest pain type:</label>
                            <Dropdown id="cp" value={this.state.diagnostic.cp} options={cpDropDownValues}
                                onChange={(e) => this.setState(prevState => {
                                    let diagnostic = { ...prevState.diagnostic };
                                    diagnostic.cp = e.value;
                                    return { diagnostic }
                                })} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="trestbps">Trestbps:</label>
                            <InputText id="trestbps" name="trestbps" keyfilter='pint' value={this.state.diagnostic.trestbps} onChange={this.handleDiagnosticChange} required
                                className={classNames({ 'p-invalid': this.state.isDiagnosticSubmitted && !this.state.diagnostic.trestbps })}
                                tooltip={'Resting blood pressure in millimeters of mercury (mm Hg) when the patient was admitted to the hospital.'}
                                tooltipOptions={{ position: 'top', style: { maxWidth: '25vw' } }} />
                            {this.state.isDiagnosticSubmitted && !this.state.diagnostic.trestbps && <small className="p-error">This field is required.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="chol">Cholesterol (mg/dl):</label>
                            <InputText id="chol" name="chol" keyfilter='pint' value={this.state.diagnostic.chol} onChange={this.handleDiagnosticChange} required
                                className={classNames({ 'p-invalid': this.state.isDiagnosticSubmitted && !this.state.diagnostic.chol })} />
                            {this.state.isDiagnosticSubmitted && !this.state.diagnostic.chol && <small className="p-error">This field is required.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="fbs">Fbs:</label>
                            <Dropdown id="fbs" value={this.state.diagnostic.fbs} options={fbsDropDownValues}
                                onChange={(e) => this.setState(prevState => {
                                    let diagnostic = { ...prevState.diagnostic };
                                    diagnostic.fbs = e.value;
                                    return { diagnostic }
                                })}
                                tooltip={'Whether the level of sugar in the blood is higher than 120 mg/dl or not.'}
                                tooltipOptions={{ position: 'top', style: { maxWidth: '25vw' } }} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="restecg">Electrocardiogram on rest results:</label>
                            <Dropdown id="restecg" value={this.state.diagnostic.restecg} options={restecgDropDownValues}
                                onChange={(e) => this.setState(prevState => {
                                    let diagnostic = { ...prevState.diagnostic };
                                    diagnostic.restecg = e.value;
                                    return { diagnostic }
                                })} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="thalach">Maxium heart rate during the stress test:</label>
                            <InputText id="thalach" name="thalach" keyfilter='pint' value={this.state.diagnostic.thalach} onChange={this.handleDiagnosticChange} required
                                className={classNames({ 'p-invalid': this.state.isDiagnosticSubmitted && !this.state.diagnostic.age })} />
                            {this.state.isDiagnosticSubmitted && !this.state.diagnostic.thalach && <small className="p-error">This field is required.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="exang">Exercise angina:</label>
                            <Dropdown id="exang" value={this.state.diagnostic.exang} options={exangDropDownValues}
                                onChange={(e) => this.setState(prevState => {
                                    let diagnostic = { ...prevState.diagnostic };
                                    diagnostic.exang = e.value;
                                    return { diagnostic }
                                })}
                                tooltip={'Whether the patient had angina during exercise.'}
                                tooltipOptions={{ position: 'top', style: { maxWidth: '25vw' } }} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="oldpeak">Oldpeak:</label>
                            <InputText id="oldpeak" name="oldpeak" keyfilter='num' value={this.state.diagnostic.oldpeak} onChange={this.handleDiagnosticChange} required
                                className={classNames({ 'p-invalid': this.state.isDiagnosticSubmitted && !this.state.diagnostic.oldpeak })}
                                tooltip={'Decrease of the ST segment during exercise according to the same one on rest.'}
                                tooltipOptions={{ position: 'top', style: { maxWidth: '25vw' } }} />
                            {this.state.isDiagnosticSubmitted && !this.state.diagnostic.oldpeak && <small className="p-error">This field is required.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="slope">Slope of the ST segment:</label>
                            <Dropdown id="slope" value={this.state.diagnostic.slope} options={slopeDropDownValues}
                                onChange={(e) => this.setState(prevState => {
                                    let diagnostic = { ...prevState.diagnostic };
                                    diagnostic.slope = e.value;
                                    return { diagnostic }
                                })}
                                tooltip={'Slope of the ST segment during the most demanding part of the exercise.'}
                                tooltipOptions={{ position: 'top', style: { maxWidth: '25vw' } }} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="ca">CA:</label>
                            <Dropdown id="ca" value={this.state.diagnostic.ca} options={caDropDownValues}
                                onChange={(e) => this.setState(prevState => {
                                    let diagnostic = { ...prevState.diagnostic };
                                    diagnostic.ca = e.value;
                                    return { diagnostic }
                                })}
                                tooltip={'Number of main blood vessels coloured by the radioactive dye.'}
                                tooltipOptions={{ position: 'top', style: { maxWidth: '25vw' } }} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="thal">Thal:</label>
                            <Dropdown id="thal" value={this.state.diagnostic.thal} options={thalDropDownValues}
                                onChange={(e) => this.setState(prevState => {
                                    let diagnostic = { ...prevState.diagnostic };
                                    diagnostic.thal = e.value;
                                    return { diagnostic }
                                })}
                                tooltip={'Results of the blood flow observed via the radioactive dye. Fixed defect - no blood flow in some part of the heart; Reversible defect - a blood flow is observed but it is not normal'}
                                tooltipOptions={{ position: 'top', style: { maxWidth: '50vw' } }} />
                        </div>

                        {
                            this.state.isSubmittingDialog
                                ?
                                <div className={'p-d-flex p-flex-jc-center p-ai-center'} style={{ height: '120px' }}>
                                    {
                                        this.state.prediction
                                            ?
                                            <div className={'p-d-block p-mx-auto'} >
                                                {
                                                    this.state.prediction === '0'
                                                        ?
                                                        <div style={{ color: '#cc0000', fontSize: '30px', fontWeight: 500 }}>
                                                            Your patient is expected to suffer from a heart disease
                                                        </div>
                                                        :
                                                        <div style={{ color: '#00802b', fontSize: '30px', fontWeight: 500 }}>
                                                            Your patient is expected to be healthy
                                                        </div>

                                                }
                                            </div>
                                            :
                                            <ProgressSpinner style={{marginTop: '10px'}}/>
                                    }
                                </div>
                                :
                                <div className="p-field" style={{ height: '10vh' }}>
                                </div>
                        }
                    </Dialog>
                </div>
            </div>
        )
    }
}

export default withRouter(PatientDetails);
