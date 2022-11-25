<template>
    <a-form
        name="addform"
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
                >Agregar URL</a-button
            >
        </a-form-item>
    </a-form>
</template>

<script setup>
import { reactive } from "vue";
import { useDatabaseStore } from "../stores/database";
import { message } from "ant-design-vue";

const databaseStore = useDatabaseStore();

const formState = reactive({
    url: '',
});

const onFinish = async () => {
    const error = await databaseStore.addUrl(formState.url);

    if (!error) {
        formState.url = ''
        message.success("URL agregada");
    } else {
        switch (error) {
            //TODO: mirar errores comunes que llegan desde firebase
            default:
                message.error("Error desconocido desde Firebase");
        }
    }
};
</script>
