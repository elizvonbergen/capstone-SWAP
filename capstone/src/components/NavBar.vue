<template>
    <nav v-if="!isLoginOrSignup" class="navbar">
        <div class="navLeft">
                <p id="logoName">ClosetSwap</p>
        </div>

        <div class="navRight">
        <ul>
                <li><RouterLink to="/"> Home </RouterLink></li>
                <li><RouterLink to="/listings"> Listings </RouterLink></li>

                <!-- if not logged in... -->
                <li v-if="!user"><RouterLink to="/signup"> Sign Up </RouterLink></li>
                <li v-if="!user"><button><RouterLink to="/login"> Login </RouterLink></button></li>

                <!-- if logged in... -->
                <li v-if="user"><RouterLink :to="`/profile/${user.uid}`"> Profile </RouterLink></li>
                <li v-if="user"><RouterLink :to="`/swaprequests`"> Swap Requests </RouterLink></li>
                <li v-if="user"><button @click="logout">Log Out</button></li>
        </ul>
        </div>
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

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  padding: 1rem 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
/* left side: SITE NAME */
.navLeft {
    display: flex;
    gap: 1.5rem;
} #logoName {
    color:#3dc47c;
    font-family: 'Gill Sans', sans-serif;
    font-weight: 700;
    font-size: 26px;
    padding-left: 20px;
    align-items: center;
}

/* right side: LINKS */
.navRight ul {
  display: flex;
  align-items: center;
  gap: 2em;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 16px;
}

.navRight a {
  color: #ecf0f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.navRight a:hover {
  color: #1abc66;
}

.navRight button {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background: #41566b;
  border: 0.5px solid #ecf0f1;
  padding: 0.5rem 1rem;
  color: #ecf0f1;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.navRight button:hover {
  background-color: #51be84;
  border-color: #51be84;
  color:#2c3e50;
}
</style>