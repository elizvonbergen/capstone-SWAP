import { createApp } from 'vue'
import App from './Homepage.vue'
import * as VueRouter from 'vue-router'

//import pages below
import HomeViewPage from './pages/HomeViewPage.vue'
import TradePage from './pages/TradePage.vue'
import ClothingPage from './pages/ClothingPage.vue'
import ClothingDetailPage from './pages/ClothingDetailPage.vue'
import LoginPage from './pages/LoginPage.vue'
import SignupPage from './pages/SignupPage.vue'
import ProfilePage from './pages/ProfilePage.vue'

//routing for different views
createApp(App)
.use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [{
        path: '/',
        component: HomeViewPage, 
    }, {
        path: '/trade',
        component: TradePage,
    }, {
        path: '/clothing',
        component: ClothingPage,
    }, {
        path: '/clothing/:clothingId',
        component: ClothingDetailPage,
    }, {
        path: '/signup',
        component: SignupPage,
    }, { 
        path: '/login',
        component: LoginPage,
    }, {
        path: '/profile/:userId',
        component: ProfilePage,
    }
    ]
}))
.mount('#app')