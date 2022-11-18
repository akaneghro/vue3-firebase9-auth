import {createRouter, createWebHistory} from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Editar from './views/Editar.vue'
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
    {path: '/', component: Home, beforeEnter: requiereAuth},
    {path: '/editar/:id', component: Editar, beforeEnter: requiereAuth},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
]

export const router = createRouter({
    routes,
    history: createWebHistory()
})