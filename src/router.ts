import {createRouter, createWebHistory} from 'vue-router';

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'Home',
            path: '/',
            component: () => import('./views/Home.vue')
        },
        {
            name: 'Signup',
            path: '/signup',
            component: () => import('./views/Signup.vue')
        },
        {
            name: 'Login',
            path: '/signin',
            component: () => import('./views/Signin.vue')
        },
        {
            name: 'Panel',
            path: '/home',
            component: () => import('./views/Panel.vue')
        }
    ]
})