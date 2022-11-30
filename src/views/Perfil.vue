<template>
    <h1>Perfil de usuario</h1>
    <div class="text-center mb-2">
        <a-avatar :src="userStore.userData.photoURL" :size="150"></a-avatar>
    </div>
    <a-row>
        <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
            <a-form
                name="perfil"
                autocomplete="off"
                layout="vertical"
                :model="userStore.userData"
                @finish="onFinish"
            >
                <a-form-item name="emailPerfil" label="Tu correo:">
                    <a-input
                        disabled
                        v-model:value="userStore.userData.email"
                    />
                </a-form-item>
                <a-form-item
                    name="displayName"
                    label="Ingresa tu nickname"
                    :rules="[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Ingresa un nick válido',
                        },
                    ]"
                >
                    <a-input v-model:value="userStore.userData.displayName" />
                </a-form-item>

                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture"
                    :before-upload="beforeUpload"
                    :max-count="1"
                    @change="handleChange"
                >
                    <a-button class="mb-2">Subir foto</a-button>
                </a-upload>

                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :disabled="userStore.loadingUser"
                        :loading="userStore.loadingUser"
                        >Actualizar información</a-button
                    >
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { message } from "ant-design-vue";
import { ref } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

const fileList = ref([]);

const beforeUpload = (file) => {
    fileList.value = [...fileList.value, file];
    return false;
};

const handleRemove = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
};

const handleChange = ({ file, fileList }) => {
    if (file.status !== "uploading") {
        console.log(file, fileList);

        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("Solo imágenes PNG o JPEG!");
            handleRemove(file)
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Máximo 2Mb");
            handleRemove(file)
        }
    }
};

const onFinish = async () => {

    const error = await userStore.updateUser(userStore.userData.displayName);

    if (fileList.value[0]){
        const error = await userStore.updateImg(fileList.value[0])

        if (!error) {
            message.success("Se subió la imagen");
        } else {
            message.error("Ocurrió un error");
        }
    }

    if (!error) {
        message.success("Se actualizó la información");
    } else {
        message.error("Ocurrió un error");
    }
};
</script>

<style>
.mb-2{
    margin-bottom: 2rem;
}
</style>