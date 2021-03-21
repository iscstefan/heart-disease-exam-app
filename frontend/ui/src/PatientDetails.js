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

/*
TO DO:
media query ptr aliniere form la stanga
*/

class PatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: '',
            lastname: '',
            id_number: '',
            email: '',
            telephone: '',
            observations: '',
            submitted: true
        }

        this.store = new PatientStore(this.props.user);

        this.handleChange = (ev) => {
            this.setState({
                [ev.target.name]: ev.target.value
            })
        }
    }

    componentDidMount() {
        if (!authStore.user) {
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div>
                <CustomMenuBar user={this.props.user} />
                <div className='title-bar p-d-flex p-flex-column p-jc-center p-ai-center p-flex-wrap'>
                    {/* <img src={process.env.PUBLIC_URL + 'Doctor.svg'} className={'text-bar'} alt='' width={350}/> */}
                    <span>Add a Patient</span>
                </div>
                <div className='p-formgrid p-d-flex p-flex-column p-jc-center p-ai-center p-mt-6 p-fluid' >
                    <div className="p-field p-col-4 p-mr-2">
                        <label htmlFor="firstname">Firstname:</label>
                        <InputText id="firstname" name="firstname" keyfilter='alpha' value={this.state.firstname} onChange={this.handleChange} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.firstname })} />
                        {this.state.submitted && !this.state.firstname && <small className="p-error">Firstname is required.</small>}
                    </div>
                    <div className="p-field p-col-4">
                        <label htmlFor="lastname">Lastname:</label>
                        <InputText id="lastname" name="lastname" keyfilter='alpha' value={this.state.lastname} onChange={this.handleChange} required
                            className={classNames({ 'p-invalid': this.state.submitted && !this.state.lastname })} />
                        {this.state.submitted && !this.state.lastname && <small className="p-error">Lastname is required.</small>}
                    </div>
                    <div className="p-field p-col-4">
                        <label htmlFor="id_number">ID number:</label>
                        <InputText id="id_number" name="id_number" value={this.state.id_number} onChange={this.handleChange} />
                    </div>
                    <div className="p-field p-col-4">
                        <label htmlFor="email">Email:</label>
                        <InputText id="email" name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>
                    <div className="p-field p-col-4">
                        <label htmlFor="telephone">Telephone:</label>
                        <InputText id="telephone" name="telephone" value={this.state.telephone} onChange={this.handleChange} />
                    </div>
                    <div className="p-field p-col-4">
                        <label htmlFor="observations">Observations:</label>
                        <InputTextarea rows={6} id='observations' name='observations' value={this.state.observations} required onChange={this.handleChange} autoResize
                            className={classNames({ 'p-invalid': this.state.submitted && this.state.observations.length > 500 })} />
                        {this.state.submitted && this.state.observations.length > 500 && <small className="p-error">Number of characters must not exceed 500.</small>}
                    </div>
                
                </div>
                <div className='p-d-flex p-jc-center p-ai-center p-mt-2 p-mb-5'>
                <Button label="Cancel"
                                className="p-button-text"
                                style={{ fontWeight: 900, fontSize: 'px'}}
                                icon={'pi pi-times'}
                                />
                <Button label="Add Patient"
                                className="p-button-text"
                                style={{ fontWeight: 900, fontSize: '19px' }}
                                icon={'pi pi-check'}
                                />
                </div>
            </div>
        )
    }
}

export default withRouter(PatientDetails);
