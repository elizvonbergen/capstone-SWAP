<template>
    <h1>Sign Up</h1>
    <form @submit="signup">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">Sign Up</button>
      <p v-if="error">{{ error }}</p>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')

const signup = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
  } catch (err) {
    console.error(err)
  }
}
</script>