<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDatabaseStore } from "../stores/database";
import { message } from "ant-design-vue";

const route = useRoute();

const databaseStore = useDatabaseStore();

const formState = reactive({
    url: "",
});

const onFinish = async () => {
    const error = await databaseStore.updateUrl(route.params.id, formState.url);

    if (!error) {
        formState.url = "";
        message.success("URL editada");
    } else {
        switch (error) {
            //TODO: mirar errores comunes que llegan desde firebase
            default:
                message.error("Error desconocido desde Firebase");
        }
    }
};

onMounted(async () => {
    formState.url = await databaseStore.getUrl(route.params.id);
});
</script>

<template>
    <div>
        <h1>Editar id: {{route.params.id}}</h1>
        <a-form
            name="editform"
            autocomplete="off"
            layout="vertical"
            :model="formState"
            @finish="onFinish"
        >
            <a-form-item
                name="url"
                label="Ingrese una URL"
                :rules="[
                    {
                        required: true,
                        whitespace: true,
                        pattern: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
                        message: 'Ingrese una URL válida',
                    },
                ]"
            >
                <a-input v-model:value="formState.url"></a-input>
            </a-form-item>

            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="databaseStore.loading"
                    :loading="databaseStore.loading"
                    >Editar URL</a-button
                >
            </a-form-item>
        </a-form>
    </div>
</template>
