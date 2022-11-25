<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./stores/user";

const userStore = useUserStore();

const route = useRoute();

const selectedKeys = ref([]);

watch(
    () => route.name,
    () => {
        selectedKeys.value = [route.name];
    }
);
</script>

<template>
    <a-layout>
        <a-layout-header v-if="!userStore.loadingSession">
            <a-menu
                v-model:selectedKeys="selectedKeys"
                theme="dark"
                mode="horizontal"
                :style="{ lineHeight: '64px' }"
            >
                <a-menu-item v-if="userStore.userData" key="home">
                    <router-link to="/">Home</router-link>
                </a-menu-item>
                <a-menu-item v-if="!userStore.userData" key="login">
                    <router-link to="/login">Login</router-link>
                </a-menu-item>
                <a-menu-item v-if="!userStore.userData" key="register">
                    <router-link to="/register">Register</router-link>
                </a-menu-item>
                <a-menu-item
                    @click="userStore.logoutUser"
                    v-if="userStore.userData"
                    key="logout"
                >
                    Logout
                </a-menu-item>
            </a-menu>
        </a-layout-header>

        <a-layout-content style="padding: 0 50px">
            <div class="container">
                <div v-if="userStore.loadingSession">Loading...</div>
                <router-view></router-view>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<style>
.container {
    background-color: #fff;
    padding: 24px;
    min-height: calc(100vh - 64px);
}
.text-center{
  text-align: center;
}
</style>
