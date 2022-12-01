<script setup>
import { useUserStore } from "../stores/user";
import { useDatabaseStore } from "../stores/database";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

databaseStore.getUrls();

const confirm = async (id) => {
    const error = await databaseStore.deleteUrl(id);

    if (!error) {
        message.success("Se eleiminó con éxito");
    } else {
        message.error(error);
    }
};

const copiar = (id) => {
    if (!navigator.clipboard) {
        message.error("No se ha podido copiar al portapapeles");
    } else {
        const path = `${window.location.origin}/${id}`;
        navigator.clipboard.writeText(path).then(() => {
            message.success("Copiado con éxito");
        });
    }
};
</script>

<template>
    <div>
        <h1>Home</h1>
        <p>{{ userStore.userData?.email }}</p>

        <AddForm></AddForm>

        <p v-if="databaseStore.loadingDoc">Loading...</p>

        <a-space direction="vertical" v-else style="width: 100%">
            <a-card
                v-for="item in databaseStore.documents"
                :key="item.id"
                :title="item.short"
                style="width: 100%"
            >
                <template #extra>
                    <a-space>
                        <a-button @click="copiar(item.id)">Copiar</a-button>
                        <a-button
                            type="primary"
                            @click="router.push(`/editar/${item.id}`)"
                            >Editar</a-button
                        >
                        <a-popconfirm
                            title="Deseas eliminar la URL?"
                            ok-text="Si"
                            cancel-text="No"
                            @confirm="confirm(item.id)"
                        >
                            <a-button
                                danger
                                :disabled="databaseStore.loading"
                                :loading="databaseStore.loading"
                                >Eliminar</a-button
                            >
                        </a-popconfirm>
                    </a-space>
                </template>
                <p>{{ item.name }}</p>
            </a-card>
        </a-space>
    </div>
</template>
