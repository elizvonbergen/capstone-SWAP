<template>
  <section class="profile">
    <h1>{{  userProfile?.name || 'User' }}</h1>
    <p>Username: {{ userProfile?.username }}</p>
    <p v-if="isOwner">Email: {{ userProfile?.email }}</p>
    <RouterLink to="/newlisting"><button v-if="isOwner">Add New Listing</button></RouterLink>
  </section>

  <section>
    <div>
      <h2>Listings</h2>
      <ul class="listingContainer">
        <li v-for="item in activeListings" :key="item.id" class="listing">
          <img v-bind:src="item.imageUrl">
          <div class="listingInfo">
            <p class="itemName">{{ item.name }}</p>
            <p class="itemDesc">{{ item.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { auth, db } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'

const route = useRoute()
const userId = route.params.userId
const userProfile = ref(null)
const userListings = ref([])
const isOwner = ref(false)

const activeListings = computed(() => //list of active listings ONLY
  userListings.value.filter(item => item.isActive == true))

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

    //get listings of user
    const listingsRef = collection(db, 'listings')
    const listingsQuery = query(listingsRef, where('ownerId', '==', userId))
    const querySnapshot = await getDocs(listingsQuery)

    //push listings to userListings array
    querySnapshot.forEach(doc => {
      const listing = {
        id: doc.id,
        ...doc.data(),
      }
      console.log('Fetched: ', listing)
      userListings.value.push(listing)
    })
  })
})
</script>