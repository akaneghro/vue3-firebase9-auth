<script setup>
import { reactive } from "vue";
import { useUserStore } from "../stores/user";
import {message} from 'ant-design-vue'

const userStore = useUserStore();

const formState = reactive({
    email: "",
    password: "",
});

const onFinish = async (values) => {
    const error = await userStore.loginUser(formState.email, formState.password);

    if(!error){
        message.success('Login correcto')
    } else {
        switch(error){
            case "auth/user-not-found":
                message.error('No existe el correo introducido')
                break;
            case "auth/wrong-password":
                message.error("Error de contraseña")
                break;
            default:
                message.error("Error desconocido desde Firebase")
        }
    }
};
const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
</script>

<template>
    <h1 class=".text-center">Login</h1>
    <a-row>
        <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
            <a-form
                name="login"
                autocomplete="off"
                layout="vertical"
                :model="formState"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
            >
                <a-form-item
                    name="email"
                    label="Ingresa tu correo"
                    :rules="[
                        {
                            required: true,
                            type: 'email',
                            whitespace: true,
                            message: 'Ingresa un correo válido',
                        },
                    ]"
                >
                    <a-input v-model:value="formState.email" />
                </a-form-item>
                <a-form-item
                    name="password"
                    label="Ingresa contraseña"
                    :rules="[
                        {
                            required: true,
                            min: 6,
                            whitespace: true,
                            message:
                                'Ingresa una contraseña de mínimo 6 carácteres',
                        },
                    ]"
                >
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>
                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :disabled="userStore.loadingUser"
                        :loading="userStore.loadingUser"
                        >Ingresar</a-button
                    >
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>
