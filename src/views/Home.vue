<script setup>
import {useUserStore} from '../stores/user'
import { useDatabaseStore } from '../stores/database';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const dataBaseStore = useDatabaseStore()
const router = useRouter()

dataBaseStore.getUrls()

const url = ref('')

const handleSubmit = () => {
    //TODO: Validacopnes de la url...    
    dataBaseStore.addUrl(url.value)
}
</script>

<template>
    <div>
        <h1>Home</h1>
        <p>{{userStore.userData?.email}}</p>

        <form @submit.prevent="handleSubmit">
            <input type="text" placeholder="Ingrese URL" v-model="url">
            <button type="submit">Agregar</button>
        </form>

        <p v-if="dataBaseStore.loadingDoc">Loading...</p>
        <ul v-else>
            <li v-for="item in dataBaseStore.documents" :key="item.id">
                {{item.id}}
                <br>
                {{item.name}}
                <br>
                {{item.short}}
                <br>
                <button @click="dataBaseStore.deleteUrl(item.id)">Eliminar</button>
                <button @click="router.push(`/editar/${item.id}`)">Editar</button>
            </li>
        </ul>
    </div>
</template>