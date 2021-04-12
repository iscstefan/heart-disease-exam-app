import { EventEmitter } from 'fbemitter';
import constants from './constants.js';
const SERVER = constants.server_url;

class DiagnosticStore {
    constructor(user) {
        this.userDiagnostics = [];
        this.user = user;
        this.emitter = new EventEmitter();
    }

    async getUserDiagnostics() {
        try {
            const response = await fetch(`${SERVER}/users/${this.user.id}/diagnostics`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${this.user.token}`
                }
            });
            const data = await response.json();
            this.userDiagnostics = data;

            if (response.status === 200) {
                this.emitter.emit('GET_DIAGNOSTICS_SUCCESS');
            } else {
                this.emitter.emit('GET_DIAGNOSTICS_FAILED');
            }

        } catch (err) {
            console.warn(err);
            this.emitter.emit('GET_DIAGNOSTICS_FAILED');
        }
    }

    async predict(diagnostic) {
        try {
            const diagnosticCopy = Object.assign({}, diagnostic);
            diagnosticCopy.sex = (diagnostic.sex === 'F') ? 0 : 1;
            const response = await fetch(`${SERVER}/diagnostics`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(diagnosticCopy)
            })
            if (response.status === 201) {
                const data = await response.json();
                console.log(data)
                this.diagnostic = data.prediction;
                this.emitter.emit('PREDICT_SUCCESS');
            } else {
                this.emitter.emit('PREDICT_ERROR');
            }
        } catch (err) {
            console.warn(err);
            this.emitter.emit('PREDICT_ERROR');
        }
    }

    async delete(diagnosticId, patientId) {
        try {
            await fetch(`${SERVER}/users/${this.user.id}/patients/${patientId}/diagnostics/${diagnosticId}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${this.user.token}`
                }
            })

            this.getUserDiagnostics();
        } catch (err) {
            console.warn(err);
        }
    }
}

export default DiagnosticStore;