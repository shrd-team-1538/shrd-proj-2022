import {describe, it, expect, beforeAll} from 'vitest';
import axios from 'axios';
import { afterEach } from 'node:test';

describe('Auth Api', async () => {
    beforeAll(async () => {
        try {
            const response = await axios.get('http://localhost');
        } catch (error) {
            console.log("API not available");
        }
    });

    // afterEach(async () => {
    //     try {
    //         const response = await axios.delete('http://localhost/api/auth/users/2', {
    //             headers: {
    //                 'Authorixation': 'Bearer $2b$10$z/2z2ZCI/.CKNPzo.lmzdOe/RR67O.tF1DJifFpQARQkdXPqdfHk6'
    //             }
    //         });
    //     } catch (error) {
            
    //     }
    // });

    it('Can create User', async () => {
            const userData = {
                "username": "user1234",
                "password": "Uu9@$klllll",
                "email": "example@user.com"
            }
    
            const response = await axios.post('/api/auth/user', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(err => {});
            expect(response).toBeDefined();
            expect(response.status).toBe(201);
    });
});