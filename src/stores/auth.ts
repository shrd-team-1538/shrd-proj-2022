import { defineStore } from "pinia"
import axios, {AxiosError, AxiosResponse} from "axios"
interface userInfo {
    name: string,
    password: string
}
interface authResponse {
    token: string
}
export const authStore = defineStore('auth', {
    actions: {
        async login(info: userInfo): Promise<boolean> {
            try {
                const res: AxiosResponse<authResponse> = await axios.post('/api/login', info);
                localStorage.setItem('token', res.data.token);
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        async signup(info: userInfo): Promise<{ok: boolean, conflict: boolean}>   {
            try {
                const res: AxiosResponse<authResponse> = await axios.post('/api/user', info, {

                });
                localStorage.setItem('token', res.data.token);
                return {ok: true, conflict: false};
            } catch (error) {
                console.log(error);
                if (error instanceof AxiosError) {
                    return error.response?.status === 409 ? {ok: false, conflict: true} : {ok: false, conflict: false};
                }
                return {ok: false, conflict: false};
            }
        }
    }
})