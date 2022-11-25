import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth } from '../firebaseConfig'
import { router } from '../router'
import { useDatabaseStore } from './database'

export const useUserStore = defineStore('user', {
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false,
    }),
    getters: {
        
    },
    actions: {
        async registerUser(email, password){
            this.loadingUser = true
            try{
                const {user} = await createUserWithEmailAndPassword(auth, email, password)
                this.userData = {email: user.email, uid: user.uid}
                router.push('/')
            } catch (e) {
                console.log(e.code)
                return e.code
            } finally {
                this.loadingUser = false
            }
        },
        async loginUser(email, password){
            this.loadingUser = true
            try {
                const {user} = await signInWithEmailAndPassword(auth, email, password)
                this.userData = {email: user.email, uid: user.uid}
                router.push('/')
            } catch (e) {
                console.log(e.code)
                return e.code
            } finally {
                this.loadingUser = false
            }
        },
        async logoutUser(){
            const databaseStore = useDatabaseStore()
            databaseStore.$reset()
            try {
                await signOut(auth)
                this.userData = null
                router.push('/login')
            } catch (e) {
                console.log(e)
            }
        },
        currentUser(){
            //creo promesa porque la función onAuthStateChanged no devuelve promesa y no se puede controlar
            return new Promise((res, rej) => {
                const unsuscribe = onAuthStateChanged(auth, (user) => {
                    if(user){
                        this.userData = {email: user.email, uid: user.uid}
                    }else{
                        this.userData = null
                    }
                    res(user)
                }, e => rej(e))
                unsuscribe()
            })
        }
    }
})