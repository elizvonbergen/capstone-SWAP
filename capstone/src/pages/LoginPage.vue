<template>
    <h1>Log In</h1>
    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">Log In</button>
      <p v-if="error">{{ error }}</p>

      <div v-if="errorMessage.length" class="popup"> <!-- error popup for invalid username -->
        <ul>
          <li v-if="errorMessage" class="error-popup">
            {{ errorMessage }}
          </li>
        </ul>
       </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const errorMessage = ref('')

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    if (user && user.uid) {
      router.push(`/profile/${user.uid}`)
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Login failed. Please try again.'
  }
}
</script>