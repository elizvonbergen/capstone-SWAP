import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router'
import TradePage from './pages/TradePage.vue'
import ClothingPage from './pages/ClothingPage.vue'
import ClothingDetailPage from './pages/ClothingDetailPage.vue'

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
    }]
}))
.mount('#app')