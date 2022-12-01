import { createRouter, createWebHistory } from "vue-router";
import { useDatabaseStore } from "./stores/database";
import { useUserStore } from "./stores/user";
import Editar from "./views/Editar.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import NotFound from "./views/NotFound.vue";
import Perfil from "./views/Perfil.vue";
import Register from "./views/Register.vue";

const requiereAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await userStore.currentUser();
    if (user) {
        next();
    } else {
        next("/login");
    }
    userStore.loadingSession = false;
};

const redirection = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;

    const databaseStore = useDatabaseStore();

    const name = await databaseStore.getUrl(to.params.pathMatch[0]);

    if (!name) {
        next();
        userStore.loadingSession = false;
    } else {
        window.location.href = name;
        next();
    }
};

const routes = [
    { path: "/", component: Home, beforeEnter: requiereAuth, name: "home" },
    {
        path: "/perfil",
        component: Perfil,
        beforeEnter: requiereAuth,
        name: "perfil",
    },
    {
        path: "/editar/:id",
        component: Editar,
        beforeEnter: requiereAuth,
        name: "editar",
    },
    { path: "/login", component: Login, name: "login" },
    { path: "/register", component: Register, name: "register" },
    {
        path: "/:pathMatch(.*)*",
        component: NotFound,
        beforeEnter: redirection,
        name: "notfound",
    },
];

export const router = createRouter({
    routes,
    history: createWebHistory(),
});
