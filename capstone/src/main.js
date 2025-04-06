import { createApp } from 'vue'
import App from './Homepage.vue'
import * as VueRouter from 'vue-router'

//import pages below
import TradePage from './pages/TradePage.vue'
import ClothingPage from './pages/ClothingPage.vue'
import ClothingDetailPage from './pages/ClothingDetailPage.vue'
//import LoginPage from './pages/LoginPage.vue'
//import SignupPage from './pages/SignupPage.vue'

//routing for different views
createApp(App)
.use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [{
        path: '/trade',
        component: TradePage,
    }, {
        path: '/clothing',
        component: ClothingPage,
    }, {
        path: '/clothing/:clothingId',
        component: ClothingDetailPage,
    }, //{                                  //commented out for simplified future development
        //path: '/signup',
        //component: SignupPage,
    //}, { 
        //path: '/login'
        //component: LoginPage,
    //},
    ]
}))
.mount('#app')