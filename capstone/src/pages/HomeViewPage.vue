<template>
    <section>
      <h1>Swap. Style. Sustain.</h1>
      <p>
        Welcome to ClosetSwap – a platform where you can list your clothes, discover new styles, and swap fashion with others in the community. It’s sustainable, social, and stylish.
      </p>
      <div>
        <RouterLink to="/signup">
          <button>Sign Up</button>
        </RouterLink>
        <RouterLink to="/login">
          <button>Log In</button>
        </RouterLink>
      </div>

      <div>
        <button @click="logout">Log Out</button>
      </div>
    </section>
  </template>

<script setup>
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = getAuth()

const logout = async () =>{
  try {
    await signOut(auth)
    router.push('/')
  } catch (err) {
    console.error('Error signing out...', err)
  }
}
</script>