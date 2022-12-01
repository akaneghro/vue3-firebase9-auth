import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { defineStore } from "pinia";
import { auth, db, storage } from "../firebaseConfig";
import { router } from "../router";
import { useDatabaseStore } from "./database";

export const useUserStore = defineStore("user", {
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false,
    }),
    getters: {},
    actions: {
        async registerUser(email, password) {
            this.loadingUser = true;
            try {
                const { user } = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                this.userData = { email: user.email, uid: user.uid };
                router.push("/");
            } catch (e) {
                console.log(e.code);
                return e.code;
            } finally {
                this.loadingUser = false;
            }
        },
        async updateUser(displayName, imagen) {
            this.loadingUser = true;
            try {
                if (imagen) {
                    const storageRef = ref(
                        storage,
                        `perfiles/${auth.currentUser.uid}`
                    );
                    await uploadBytes(storageRef, imagen.originFileObj);
                    const photoURL = await getDownloadURL(storageRef);
                    await updateProfile(auth.currentUser, {
                        photoURL: photoURL,
                    });
                }

                await updateProfile(auth.currentUser, {
                    displayName: displayName,
                });

                this.setUser(auth.currentUser);
            } catch (e) {
                console.log(e.message);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        async setUser(user) {
            try {
                const docRef = doc(db, "users", user.uid);

                this.userData = {
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                };

                await setDoc(docRef, this.userData);
            } catch (e) {
                console.log(e.message);
            }
        },
        async loginUser(email, password) {
            this.loadingUser = true;
            try {
                const { user } = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                await this.setUser(user);
                router.push("/");
            } catch (e) {
                console.log(e.code);
                return e.code;
            } finally {
                this.loadingUser = false;
            }
        },
        async logoutUser() {
            const databaseStore = useDatabaseStore();
            databaseStore.$reset();
            try {
                router.push("/login");
                await signOut(auth);
            } catch (e) {
                console.log(e.message);
            }
        },
        currentUser() {
            //creo promesa porque la función onAuthStateChanged no devuelve promesa y no se puede controlar
            return new Promise((res, rej) => {
                const unsuscribe = onAuthStateChanged(
                    auth,
                    async (user) => {
                        if (user) {
                            this.userData = {
                                email: user.email,
                                uid: user.uid,
                                displayName: user.displayName,
                                photoURL: user.photoURL,
                            };
                        } else {
                            this.userData = null;
                            const databaseStore = useDatabaseStore();
                            databaseStore.$reset();
                        }
                        res(user);
                    },
                    (e) => rej(e)
                );
                unsuscribe();
            });
        },
    },
});
