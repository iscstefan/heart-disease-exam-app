import { EventEmitter } from 'fbemitter';
import constants from './constants.js';
const SERVER = constants.server_url;

class PatientStore {
    constructor(user) {
        this.user = user;
        this.data = [];
        this.emitter = new EventEmitter();
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
                this.emitter.emit('GET_EXPERIENCES_SUCCESS');
            } else if (response.status === 401) {
                this.emitter.emit('UNAUTHORIZED');
            } else {
                this.emitter.emit('GET_EXPERIENCES_FAILED');
            }

        } catch (err) {
            console.warn(err);
            this.emitter.emit('GET_EXPERIENCES_FAILED');
        }
    }

    async addPatient(patient) {
        try {
            await fetch(`${SERVER}/users/${this.user.id}/patients`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${this.user.token}`
                },
                body: JSON.stringify(patient)
            })

            this.getPatients();
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
}

export default PatientStore;