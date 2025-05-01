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
import SwapRequestsPage from './pages/SwapRequestsPage.vue'
import MessagingPage from './pages/MessagingPage.vue'

//routing for different views
const routes = [{
        path: '/',
        component: HomeViewPage,
        meta: {
            title: 'Home'
        }
    }, {
        path: '/swap/:listingId',
        component: SwapPage,
        meta: {
            title: 'Create Swap Request'
        }
    }, {
        path: '/listings',
        component: ClothingPage,
        meta: {
            title: 'Listings'
        }
    }, {
        path: '/newlisting',
        component: CreateListingPage,
        meta: {
            title: 'Create New Listing'
        }
    }, {
        path: '/listings/:listingId',
        component: ClothingDetailPage,
        meta: {
            title: 'Details'
        }
    }, {
        path: '/signup',
        component: SignupPage,
        meta: {
            title: 'Sign Up'
        }
    }, { 
        path: '/login',
        component: LoginPage,
        meta: {
            title: 'Log In'
        }
    }, {
        path: '/profile/:userId',
        component: ProfilePage,
        props: true,
        meta: {
            title: 'Profile'
        }
    }, {
        path: '/swaprequests',
        component: SwapRequestsPage,
        meta: {
            title: 'Swap Requests'
        }
    }, {
        path: '/messages/:requestId',    
        name: 'Messages',
        component: MessagingPage,
        meta: {
            title: 'Messaging'
        } 
    }
]

//create router using routes
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL || '/'),
    routes
})

//load document title on each route
router.beforeEach((to) => {
    document.title = to.meta?.title ?? 'Default'
})

export default router