<template>
<div class="container">
    <div class="container-col">
        <div class="row">
        <input v-model="query" class="search" placeholder="Найти вопрос" type="text" name="find" id="find">
        <button @click="search" class="btn-search">
            Найти
        </button>
    </div>
    <h1 class="default-title">Самые обсуждаемые вопросы</h1>
    <div class="questions">
        <div @click="router.push(`/questions/${q.id}`)" v-for="q in popularQuestions" class="question">
            <h2 class="q-info">{{ q.name }}</h2>
            <h2 class="q-info">Автор: {{q.user.name}}</h2>
            <h2 class="q-info">Создан: {{(new Date(q.createdAt)).toLocaleDateString()}}</h2>
        </div>
    </div>
    <h1 class="default-title">Новые статьи</h1>
    <div class="posts">
        <div class="post"></div>
    </div>
    <h1 v-if="searched" class="default-title">Результаты поиска</h1>
    <div v-if="searched" class="found"></div>
        <div @click="router.push(`/questions/${f.id}`)" v-for="f in found" class="found-q question">
            <h2 class="q-info">{{ f.name }}</h2>
            <h2 class="q-info">{{ f.text }}</h2>
            <h2 class="q-info">Автор: {{ f.user.name }}</h2>
            <h2 class="q-info">Создан: {{ (new Date(f.createdAt)).toLocaleDateString() }}</h2>
        </div>
        <p class="not-found" v-if="searched && found.length === 0">Вопросов не найдено</p>
    </div>
</div>
</template>
<script setup lang="ts">
import axios, { AxiosError, AxiosResponse } from "axios";
import { ref, onMounted, Ref} from "vue";
import type {Question} from '../../shrd/src/entity/Question';
import { useRouter } from "vue-router";
import type {Post} from '../../shrd/src/entity/Post'
// @ts-ignore
interface JSONed extends Question {
    createdAt: string;
}
let popularQuestions: Ref<JSONed[]> = ref([]);
let query: Ref<string> = ref('');
let found: Ref<JSONed[]> = ref([]);
let searched: Ref<boolean> = ref(false);
let newPosts: Ref<Post[]> = ref([]);
const router = useRouter();
onMounted(async () => {
    try {
        const res: AxiosResponse<Question[]> = await axios.get('/api/questions/popular');
        console.log(res.data);
        popularQuestions.value = res.data;
    } catch (error) {
        console.log(error);
    }
})

const search = async () => {
    try {
        searched.value = true;
        const res = await axios.get('/api/questions/search', {
            params: {
                q: query.value
            }
        });
        console.log(res.data);
        found.value = res.data;
    } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                found.value = [];
            }
        }
    }
    try {
        const res: AxiosResponse<Post[]> = await axios.get('/api/posts/new');
    } catch (error) {
        
    }
}
</script>
<style scoped lang="less">
.search {
    outline: none;
    border: 2px solid #F9322C;
    border-radius: 0.3rem;
    padding: 0.5rem 1rem;
    color:#F9322C;
    flex-grow: 0.8;
    transition-property: all;
    transition-duration: 400ms;
    font-weight: 500;
    &:focus {
        background-color: #F9322C;
        color: #ffffff;
        &::placeholder {
            color: #ffffff;
        }
    }
}
.row {
    margin-top: 2rem;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
}
.btn-search {
    padding: 0.5rem 1rem;
    background: #ffffff;
    color: #F9322C;
    font-size: 1rem;
    font-weight: 600;
    border: 2px solid #F9322C;
    border-radius: 0.3rem;
    transition-property: all;
    transition-duration: 400ms;
    cursor: pointer;
    &:hover {
        background: #F9322C;
        color: #ffffff;
    }
}
.container-col {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: column;
    width: 60%;
}

@media (max-width: 890px) {
    .search {
        flex-grow: 0.5;
    }
}
@media (max-width: 600px) {
    .search {
        flex-grow: 0;
    }
    .container-col {
        width: 80%;
    }
}

@media (max-width: 370px) {
    .container-col {
        width: 90%;
    }
}
.default-title {
    font-size: 1.75rem;
    color: rgb(35, 35, 35);
    text-align: left;
    font-weight: 700;
    line-height: 1;
    margin: 0;
    margin-top: 2rem;
}
.questions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3rem;
    margin-top: 2rem;
}
.question {
    background: #ffffff;
    text-align: center;
    padding:1rem;
    color: #353535;
    border-radius: 1rem;
    cursor: pointer;
    transition-property: all;
    transition-duration: 300ms;
    box-shadow: 0rem 0.5rem 0.8rem #00000066;
    border: 2px solid #F9322C;
    &:hover {
        transform: scale(1.1, 1.1);
        background: #f9322c;
        color: #ffffff
    }
}
.q-info {
    font-size: 1.1rem;
    font-weight: 400;
}
.found-q {
    margin-top: 2rem;
    text-align: left;
}
</style>