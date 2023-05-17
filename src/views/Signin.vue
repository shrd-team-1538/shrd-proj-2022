<template>
    <div class="container">
        <div class="column-signup">
            <h1 class="header">Зарегистрироваться</h1>
            <form @submit.prevent class="flex-form">
                <div class="form-wrapper grow-3">
                    <div class="form-wrapper">
                        <label for="username" class="label">Имя пользователя:</label>
                        <input v-model="username" id="username" type="text" class="input">
                    </div>
                    <div class="form-wrapper">
                        <label for="password" class="label">Пароль:</label>
                        <input v-model="password" id="password" type="password" class="input">
                        <RouterLink to="/signup" class="have-account">У меня нет аккаунта</RouterLink>
                    </div>
                </div>
                <button type="submit" class="submit" @click="signin">Войти</button>
            </form>
        </div>
    </div>
</template>
<script lang="ts" setup>
import router from '../router';
import {authStore} from '../stores/auth';
import { ref, Ref } from 'vue';
let username: Ref<string> = ref('');
let password: Ref<string> = ref('');
const store = authStore();

const signin = async () => {
    const result = await store.login({
        name: username.value,
        password: password.value
    });
    console.log(result);
    if (!result) return alert("Произошла ошибка");
    await router.push("/home");
}
</script>
<style scoped lang="less">
.header {
    text-align: center;
    align-self: center;
    color: rgb(35, 35, 35)
}

.container {
    background: #F5F5F5;
}
.column-signup {
    width: 50%;
    background: #FFFFFF;
    border-radius: 1rem;
    padding: 2rem 4rem;
    height: calc(100vh - 4rem);
    display: flex;
    flex-direction: column;

}
.flex-form {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
    flex-grow: 1;
}

.submit {
    align-self: end;
    justify-self: flex-end;
}

.form-wrapper {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: flex-start;
}
.have-account {
    margin-top: 1rem;
    font-weight: 600;
    font-size: 1.2rem;
    cursor: pointer;
    color: rgb(35, 35, 35);
    text-decoration: none;
}

.grow-3 {
    flex-grow: 0.3;
}

.input {
    border: 2px solid #868484;
    outline: none;
    padding: 0.5rem 1rem;
    margin-top: 0.7rem;
    border-radius: 0.25rem;
    width: 60%;
}   

.label {
    color: #f9322c;
    font-weight: 500;
    font-size: 1.125rem;
}

.submit {
    background: #f9322c;
    font-size: 1.3rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: white;
    border: 3px solid #f9322c;
    padding: 0.5rem 1rem;
    transition-property: all;
    transition-duration: 400ms;
    cursor: pointer;
    &:hover {
        background-color: #FFFFFF;
        color: #f9322c;
    }
}
</style>