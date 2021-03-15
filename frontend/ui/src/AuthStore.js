import { EventEmitter } from 'fbemitter';
const SERVER = 'http://localhost:8080';


class AuthStore {
    constructor() {
        this.user = null;

        this.emitter = new EventEmitter();
    }

    async signIn() {
        try {
            const response = await fetch(`${SERVER}/auth/google/callback`, {
                method: 'get',
                credentials: 'include'
            });

            if (response.status !== 200) {
                this.emitter.emit('AUTH_FAILED');
            }

        } catch (err) {
            console.warn(err);
            this.emitter.emit('AUTH_FAILED');
        }
    }

    async checkAuth() {
        try {
            const response = await fetch(`${SERVER}/checkauth`, {
                method: 'get',
                credentials: 'include'
            });

            if (response.status === 200) {
                const data = await response.json();

                this.user = data;

                this.emitter.emit('AUTH_SUCCESS');
            }
        } catch (err) {
            this.emitter.emit('AUTH_FAILED');
        }
    }
}

const authStore = new AuthStore();

export default authStore;
