<script setup>
import { reactive } from "vue";
import { useUserStore } from "../stores/user";
import {message} from 'ant-design-vue'

const userStore = useUserStore();

const formState = reactive({
    email: "",
    password: "",
    repassword: ""
});

const validatePass = async(_rule, value) => {
    if(value === ''){
        return Promise.reject('Repita contraseña')
    }
    if(value !== formState.password){
        return Promise.reject('No coinciden las contraseñas')
    }
    return Promise.resolve()
}

const onFinish = async (values) => {
    const error = await userStore.registerUser(formState.email, formState.password);
    
    if(!error){
        message.success('Registro correcto. Revisa tu correo.')
    } else {
        switch(error){
            case "auth/email-already-in-use":
                message.error('Correo ya registrado')
                break;
            default:
                message.error("Error desconocido desde Firebase")
        }
    }
};
const onFinishFailed = (errorInfo) => {
    console.log("Failed: ", errorInfo);
};
</script>

<template>
    <h1 class=".text-center">Registro</h1>
    <a-row>
        <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
            <a-form
                name="register"
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
                <a-form-item
                    name="repassword"
                    label="Repita contraseña"
                    :rules="[
                        {
                            validator: validatePass
                        },
                    ]"
                >
                    <a-input-password v-model:value="formState.repassword" />
                </a-form-item>
                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :disabled="userStore.loadingUser"
                        :loading="userStore.loadingUser"
                        >Registrar</a-button
                    >
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>