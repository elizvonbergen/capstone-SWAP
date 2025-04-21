<template>
  <div class="signup">
    <h1>Sign Up</h1>
    <form @submit.prevent="signup"> <!-- login form -->
      <input v-model="name" placeholder="First Name" />
      <input v-model="username" placeholder="Username" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">Sign Up</button>
      <p v-if="error">{{ error }}</p>

       <div v-if="errorMessage.length"> <!-- error popup for invalid username -->
        <ul>
          <li v-for="(message, index) in errorMessage" :key="index" class="popup">
            {{ message }}
          </li>
        </ul>
       </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const errorMessage = ref([])
const router = useRouter()

const signup = async () => {
  errorMessage.value = []

  try {
    //regex for valid user/pass
    const userRegex = /^(?=.*?[a-zA-Z0-9])[a-zA-Z0-9_]{6,20}$/
    const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!?@#$%&]).{6,}$/

    //check if username exists already
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('username', '==', username.value))
    const querySnapshot = await getDocs(q)

    //error messages for invalid input
    if (!querySnapshot.empty) {
      errorMessage.value.push('Username already taken!')
    }
    if(!userRegex.test(username.value)) {
      errorMessage.value.push('Username must be between 6-20 characters and contain only underscores and at least one letter or number.')
    }
    if (!passRegex.test(password.value)) {
      errorMessage.value.push('Password must be longer than 6 characters and contain at least one upper case letter and one special symbol.')
    }

    if (errorMessage.value.length > 0) { return } //stop signup if errors

    //create user if no errors
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