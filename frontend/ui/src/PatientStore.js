import { EventEmitter } from 'fbemitter';
import constants from './constants.js';
const SERVER = constants.server_url;

class PatientStore {
    constructor(user) {
        this.user = user;
        this.data = [];
        this.emitter = new EventEmitter();
        this.diagnostic = '';
    }

    async getPatients() {
        try {
            const response = await fetch(`${SERVER}/users/${this.user.id}/patients`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${this.user.token}`
                }
            });
            const data = await response.json();
            this.data = data;

            if (response.status === 200) {
                this.emitter.emit('GET_PATIENTS_SUCCESS');
            } else {
                this.emitter.emit('GET_PATIENTS_FAILED');
            }

        } catch (err) {
            console.warn(err);
            this.emitter.emit('GET_EXPERIENCES_FAILED');
        }
    }

    async addPatient(patient) {
        try {
            if(patient.identification_number.trim().length === 0)
                patient.identification_number = null

            const response = await fetch(`${SERVER}/users/${this.user.id}/patients`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${this.user.token}`
                },
                body: JSON.stringify(patient)
            })
            if (response.status === 201) {
                this.getPatients();
                this.emitter.emit('ADD_PATIENT_SUCCESS');
            } else {
                this.emitter.emit('ADD_PATIENT_ERROR');
            }
        } catch (err) {
            console.warn(err);
            this.emitter.emit('ADD_PATIENT_ERROR');
        }
    }

    async updatePatient(patient) {
        try {
            await fetch(`${SERVER}/users/${this.user.id}/patients/${patient.id}`, {
                method: 'put',
                headers: {
                    "Content-Type": 'application/json',
                    "token": `${this.user.token}`
                },
                body: JSON.stringify(patient)
            });

            this.getPatients();
        } catch (err) {
            console.warn(err);
            this.emitter.emit('UPDATE_PATIENT_ERROR')
        }
    }

    async deletePatient(id) {
        try {
            await fetch(`${SERVER}/users/${this.user.id}/patients/${id}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${this.user.token}`
                }
            })

            this.getPatients();
        } catch (err) {
            console.warn(err);
        }
    }

    async addDiagnostic(patientId, diagnostic) {
        try {
            diagnostic.sex = (diagnostic.sex === 'F') ? 0 : 1;
            const response = await fetch(`${SERVER}/users/${this.user.id}/patients/${patientId}/diagnostics`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${this.user.token}`
                },
                body: JSON.stringify(diagnostic)
            })
            if (response.status === 201) {
                // this.getPredictions();
                const data = await response.json();
                console.log(data)
                diagnostic.sex = (diagnostic.sex === 0) ? 'F' : 'M';
                
                this.diagnostic = data.prediction;
                this.emitter.emit('ADD_DIAGNOSTIC_SUCCESS');
            } else {
                this.emitter.emit('ADD_DIAGNOSTIC_ERROR');
            }
        } catch (err) {
            console.warn(err);
            this.emitter.emit('ADD_DIAGNOSTIC_ERROR');
        }
    }
}

export default PatientStore;