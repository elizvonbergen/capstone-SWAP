import { createApp } from 'vue'
import App from './Homepage.vue'
import router from './router'

//import firebase authentication
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebase'

//checks if user is logged in
let isUserchecked = false

router.beforeEach((to, from, next) => {
    if ((to.path === '/newlisting')) {
        alert('You are not logged in!')
        next(from)
    }
    if (!isUserchecked) {
        onAuthStateChanged(auth, (user) => {
            isUserchecked = true

            //redirects to profile if user tries to go to login/signup
            if ((to.path === '/login' || to.path === '/signup') && user) {
                next(`/profile/${user.uid}`) // redirect to own profile
            } else {
                next()
            }
        })
    } else {
        const user = auth.currentUser

        if ((to.path === '/login' || to.path === '/signup')&& user) {
            next(`/profile/${user.uid}`)
        } else {
            next()
        }
    }
})

createApp(App).use(router).mount('#app')