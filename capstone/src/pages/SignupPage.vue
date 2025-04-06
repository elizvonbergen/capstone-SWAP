<template>
    <h1>Sign Up</h1>
    <form @submit.prevent="signup">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">Sign Up</button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const signup = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    router.push('/profile') // redirect after signup
  } catch (err) {
    console.error(err)
  }
}
</script>