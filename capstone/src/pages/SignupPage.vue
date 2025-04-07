<template>
    <h1>Sign Up</h1>
    <form @submit.prevent="signup">
      <input v-model="name" placeholder="First Name" />
      <input v-model="username" placeholder="Username" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">Sign Up</button>
      <p v-if="error">{{ error }}</p>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const signup = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    //save user info in firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: name.value,
      username: username.value,
      email: email.value,
      createdAt: new Date(),
    })

    if (user && user.uid) {
      router.push(`/profile/${user.uid}`) //push to own profile after login
    }
  } catch (err) {
    console.error(err)
  }
}
</script>