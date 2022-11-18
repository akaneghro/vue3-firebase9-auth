<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDatabaseStore } from '../stores/database';

const route = useRoute()

const databaseStore = useDatabaseStore()

const url = ref('')

const handleSubmit = () => {
    //TODO: validaciones de la url...
    databaseStore.updateUrl(route.params.id, url.value)
}

onMounted(async () => {
    url.value = await databaseStore.getUrl(route.params.id)
})
</script>

<template>
    <div>
        <h1>Editar</h1>
        <form @submit.prevent="handleSubmit">
            <input type="text" placeholder="Ingrese URL" v-model="url">
            <button type="submit">Editar</button>
        </form>
    </div>
</template>