import { createRouter, createWebHistory } from 'vue-router'

//import pages
import HomeViewPage from './pages/HomeViewPage.vue'
import SwapPage from './pages/SwapPage.vue'
import ClothingPage from './pages/ClothingPage.vue'
import ClothingDetailPage from './pages/ClothingDetailPage.vue'
import LoginPage from './pages/LoginPage.vue'
import SignupPage from './pages/SignupPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import CreateListingPage from './pages/CreateListingPage.vue'

//routing for different views
const routes = [{
        path: '/',
        component: HomeViewPage, 
    }, {
        path: '/swap/:listingId',
        component: SwapPage,
    }, {
        path: '/listings',
        component: ClothingPage,
    }, {
        path: '/newlisting',
        component: CreateListingPage
    }, {
        path: '/listings/:listingId',
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
        props: true,
    }
]

//create router using routes
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL || '/'),
    routes
})

export default router