import { defineStore } from "pinia"
import axios, {AxiosResponse} from "axios"
interface userInfo {
    name: string,
    password: string
}
export const authStore = defineStore('auth', {
    actions: {
        async login(info: userInfo): Promise<boolean> {
            try {
                const res: AxiosResponse<unknown> = await axios.post('/api/login', info, {});
            } catch (error) {
                
            }
        }
    }
})