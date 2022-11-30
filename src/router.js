import {createRouter, createWebHistory} from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Editar from './views/Editar.vue'
import Perfil from './views/Perfil.vue'
import {useUserStore} from './stores/user'

const requiereAuth = async(to, from, next) => {
    const userStore = useUserStore()
    userStore.loadingSession = true
    const user = await userStore.currentUser()
    if(user){
        next()
    }else{
        next('/login')
    }
    userStore.loadingSession = false
}

const routes = [
    {path: '/', component: Home, beforeEnter: requiereAuth, name: 'home'},
    {path: '/perfil', component: Perfil, beforeEnter: requiereAuth, name: 'perfil'},
    {path: '/editar/:id', component: Editar, beforeEnter: requiereAuth, name: 'editar'},
    {path: '/login', component: Login, name: 'login'},
    {path: '/register', component: Register, name: 'register'},
]

export const router = createRouter({
    routes,
    history: createWebHistory()
})