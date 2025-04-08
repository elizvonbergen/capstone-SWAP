<template>
    <h1>{{  userProfile?.name || 'User' }}</h1>
    <p>Username: {{ userProfile?.username }}</p>
    <p v-if="isOwner">Email: {{ userProfile?.email }}</p>
  <div>
    <h2>Listings</h2>
    <ul>
      <li v-for="item in userListings" :key="item.id"> {{ item.title }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { auth, db } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const userId = route.params.userId
const userProfile = ref(null)
const userListings = ref([])
const isOwner = ref(false)

onMounted(async () => {
  //check if user is profile owner
  onAuthStateChanged(auth, async (user) => {
    if (user && user.uid === userId) {
      isOwner.value = true
    }

    //get profile
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      userProfile.value = userDoc.data()
    }

    //TODO !!!!! get listings
  }
)
}
)
</script>