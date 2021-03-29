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