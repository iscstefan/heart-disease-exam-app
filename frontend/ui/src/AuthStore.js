import { EventEmitter } from 'fbemitter';
import constants from './constants.js';
const SERVER = constants.server_url;


class AuthStore {
    constructor() {
        this.user = null;

        this.emitter = new EventEmitter();
    }

    // async signIn() {
    //     try {
    //         const response = await fetch(`${SERVER}/auth/google/callback`, {
    //             method: 'get',
    //             credentials: 'include'
    //         });

    //         if (response.status !== 200) {
    //             this.emitter.emit('AUTH_FAILED');
    //         }

    //     } catch (err) {
    //         console.warn(err);
    //         this.emitter.emit('AUTH_FAILED');
    //     }
    // }

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
            } else {
                this.emitter.emit('AUTH_FAILED');
            }
        } catch (err) {
            this.emitter.emit('AUTH_FAILED');
        }
    }

    // async logOut() {
    //     try {
    //         await fetch(`${SERVER}/logout`, {
    //             method: 'get',
    //             credentials: 'include'
    //         });

    //     } catch (err) {
    //         this.emitter.emit('AUTH_FAILED');
    //     }
    // }
}

const authStore = new AuthStore();

export default authStore;
