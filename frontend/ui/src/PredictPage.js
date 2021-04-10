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
import DiagnosticStore from './DiagnosticStore.js';

class PredictPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            diagnostic: {},
            isDialogShown: false,
            isSubmittingDialog: true,
            isDiagnosticSubmitted: false,
            prediction: '',
            toast: React.createRef()
        }

        this.store = new DiagnosticStore();

        this.showHideDialog = () => {
            if (!this.state.isDialogShown) {
                const emptyDiagnostic = {
                    age: '',
                    sex: 'M',
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

        this.addDiagnostic = () => {
            this.setState({ isDiagnosticSubmitted: true });

            if (this.state.diagnostic.age
                && this.state.diagnostic.trestbps
                && this.state.diagnostic.chol
                && this.state.diagnostic.thalach
                && this.state.diagnostic.oldpeak) {

                this.setState({ isSubmittingDialog: true });
                this.store.predict(this.state.diagnostic);
            }

        }
    }

    componentDidMount() {
        this.store.emitter.addListener('PREDICT_SUCCESS', () => {
            this.setState({ prediction: this.store.diagnostic });
        })

        this.store.emitter.addListener('PREDICT_ERROR', () => {
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

        return (
            <div>
                <Toast ref={this.state.toast} position="top-right" />
                <CustomMenuBar user={this.props.user} />
                <div className='title-bar p-d-flex p-flex-column p-jc-center p-ai-center'>
                    {/* <img src={process.env.PUBLIC_URL + 'Doctor.svg'} className={'text-bar'} alt='' width={350}/> */}
                    <span>Predict</span>
                </div>
                <div style={{ height: '10vh' }} />
                <Button label='Predict a heart disease'
                    className='p-button-lg p-button-secondary  p-d-block p-mx-auto'
                    onClick={this.showHideDialog}
                    style={{
                        fontWeight: 900, fontSize: 20, padding: '1em',
                        marginTop: '4em'
                    }} />

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

        )
    }
}

export default withRouter(PredictPage);
