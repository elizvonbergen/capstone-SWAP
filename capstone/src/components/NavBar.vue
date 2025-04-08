<template>
    <nav v-if="!isLoginOrSignup" class="navbar">
        <ul>
            <li><RouterLink to="/"> Home </RouterLink></li>

            <!-- if not logged in... -->
            <li v-if="!user"><RouterLink to="/login"> Login </RouterLink></li>
            <li v-if="!user"><RouterLink to="/signup"> Sign Up </RouterLink></li>

            <!-- if logged in... -->
            <li v-if="user"><RouterLink :to="`/profile/${user.uid}`"> Profile </RouterLink></li>
            <li v-if="user"><button @click="logout">Log Out</button></li>
        </ul>
    </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter, useRoute } from 'vue-router'

const user = ref(null)
const router = useRouter()
const route = useRoute()
const auth = getAuth()
const isLoginOrSignup = ref(false)

onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {  //if logged in
            user.value = currentUser
        } else {    //else not logged in
            user.value = null
        }
    })

    //check if login or signup page (don't display)
    isLoginOrSignup.value = route.path === '/login' || route.path === '/signup'

    //watch for route changes
    watch(
        () => route.path,
        (newPath) => {
            isLoginOrSignup.value = newPath === '/login' || newPath === '/signup'
        })
    })

const logout = async () =>{
  try {
    await signOut(auth)
    router.push('/')
  } catch (err) {
    console.error('Error signing out...', err)
  }
}
</script>