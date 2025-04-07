import { createApp } from 'vue'
import App from './Homepage.vue'
import router from './router'

//import firebase authentication
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebase'

let isUserchecked = false
router.beforeEach((to, from, next) => {
    if (!isUserchecked) {
        onAuthStateChanged(auth, (user) => {
            isUserchecked = true

            if (to.path === '/profile' && !user) {
                next('/login') // redirect to login if not
            } else {
                next()
            }
        })
    } else {
        const user = auth.currentUser
        if (to.path === '/profile' && !user) {
            next('/login')
        } else {
            next()
        }
    }
})

createApp(App).use(router).mount('#app')