<template>
<div class="container">
    <h1 class="heading-main">
        Solver - ваш лучший <br> <span class="red">помощник</span>
    </h1>
    <p class="text-main">
        Solver - это программа-форум для решения проблем компьютеров. Она позволяет задать вопрос и получить ответ от людей, столкнувшихся с такой же проблемой, как и ваша.
    </p>
    <div class="row-2-buttons">
        <button @click="router.push('/signup')" class="btn-main btn-red">
            ЗАРЕГИСТРИРОВАТЬСЯ
        </button>
        <button @click="router.push('/signin')" class="btn-main btn-white">
            ВОЙТИ
        </button>
    </div>
    <div class="row-text-left">
        <div class="column">
            <h1 class="heading-secondary">Работайте с компьютером максимально эффективно</h1>
            <p class="text-secondary text-left">
                Работайте, не отвлекаясь на проблемы, а если они возникнут - мы поможем. Больше не нужно ходить в сервис и платить деньги.
            </p>
            <button @click="router.push('/signup')" class="btn-main btn-red">НАЧАТЬ РАБОТУ</button>
        </div>
        <img class="image-right" src="https://t4.ftcdn.net/jpg/02/36/62/99/360_F_236629968_cvZT3xpLsf26tuvcJOLaU8xIR1GfPrus.jpg" alt="Картинка компьютера">
    </div>
    <div class="row-text-right">
        <img src="https://t4.ftcdn.net/jpg/02/36/62/99/360_F_236629968_cvZT3xpLsf26tuvcJOLaU8xIR1GfPrus.jpg" alt="картинка компьютера" class="image-left">
        <div class="column-right">
            <h1 class="heading-secondary">Найдите именно то, <br> что вам нужно</h1>
            <p class="text-secondary text-right">
                Работайте, не отвлекаясь на проблемы, а если они возникнут - мы поможем. Больше не нужно ходить в сервис и платить деньги.
            </p>
        </div>
    </div>
    <div class="col-showcase">
        <h1 class="heading-secondary">Решение для любой проблемы</h1>
        <div class="row-showcase">
            <div class="card">
                <h1 class="text-tetriary">Ответы в Realtime режиме</h1>
                <img src="https://www.shutterstock.com/image-vector/downtime-icon-flat-style-uptime-260nw-1355115581.jpg" alt="">
            </div>
            <div class="card">
                <h1 class="text-tetriary">Статьи на разные темы</h1>
                <img src="https://www.shutterstock.com/image-vector/downtime-icon-flat-style-uptime-260nw-1355115581.jpg" alt="">
            </div>
            <div class="card">
                <h1 class="text-tetriary">Простота в использовании</h1>
                <img src="https://www.shutterstock.com/image-vector/downtime-icon-flat-style-uptime-260nw-1355115581.jpg" alt="">
            </div>
        </div>
    </div>
    <div class="footer">
        <hr>
        <p>Данная программа не имеет лицензии и создана исключительно для ШРД. Сайт будет удален после показа.</p>
    </div>
</div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>
<style scoped lang="less">
.heading-main {
    font-size: 3.75rem;
    color: rgb(35, 35, 35);
    text-align: center;
    font-weight: 700;
    line-height: 1;
    margin: 0;
    margin-top: 5rem;
}

.red {
    color: rgb(549, 50, 44);
}

.text-main {
    font-size: 1.125rem;
    line-height: 1.75rem;
    color: rgb(86, 84, 84);
    margin: 0;
    display: inline;
    text-align: center;
    width: 40%;
    margin-top: 2rem;
}
.row-2-buttons {
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    width: 20%;
    justify-content: center;
    align-items: center;
}

.btn-main {
        padding: 0.5rem 1rem;
        border: 2px solid #F9322C;
        outline: none;
        line-height: 1;
        cursor: pointer;
        text-decoration: none;
        transition-property: all;
        transition-duration: 400ms;
        font-weight: 700;
        font-size: .875rem;
        line-height: 1.25rem;
        letter-spacing: 1px;
    }
.btn-red {
    background: #F9322C;
    color: #ffffff;
    &:hover {
        background: #ffffff;
        color: #F9322C;
    }
}
.btn-white {
    margin-left: 1.5rem;
    background: #ffffff;
    color: #F9322C;
    &:hover {
        background: #F9322C;
        color: #ffffff;
    }
}

.row-text-left {
    display: flex;
    justify-content: space-between;
    width: 75%;
    margin-top: 8rem;
}
.row-text-right {
    display: flex;
    justify-content: space-between;
    width: 75%;
    margin-top: 12rem;
}

@keyframes rotate-right {
    from {
        transform: rotate(-2deg);
    }
    to {
        transform: rotate(2deg);
    }
}

.image-right {
    border-radius: 1rem;
    transform: rotate(-2deg);
    animation-name: rotate-right;
    animation-duration: 8000ms;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;

}

.image-left {
    border-radius: 1rem;
    animation-name: rotate-right;
    animation-duration: 8000ms;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

.text-secondary {
    width: 80%;
    color: rgb(86, 84, 84);
    line-height: 1.625rem;
    margin-top: 1.25rem;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-bottom: 2rem;
}

.text-right {
    text-align: right;
}

.text-left {
    text-align: left;
}
.column-right {
    text-align: right;
    align-items: end;
    display: flex;
    justify-content: start;
    flex-direction: column;
}


.col-showcase {
    margin-top: 12rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: start;
    text-align: left;
    width: 85%;
}

.row-showcase {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
    width: 100%;
}
.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
.text-tetriary {
    color: rgb(35, 35, 35);
    font-weight: 700;
    font-size: 1.4rem;
}
.footer {
    margin-top: 16rem;
    width: 100%;
    text-align: center;
    color: rgb(86, 84, 84);
}
</style>