<template>
    <h1>Sign Up</h1>
    <form @submit.prevent="signup">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">Sign Up</button>
      <p v-if="error">{{ error }}</p>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const signup = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    if (user && user.uid) {
      router.push(`/profile/${user.uid}`)
    }
  } catch (err) {
    console.error(err)
  }
}
</script>