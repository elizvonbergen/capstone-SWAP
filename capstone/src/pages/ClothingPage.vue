<template>
    <section>
      <h1>Current Listings</h1>
      <input v-model="searchQuery" placeholder="Search by name..." /> <!-- search function -->
      <ul>
        <li v-for="item in searchListings" :key="item.id">
          <p><RouterLink :to="`/listings/${item.id}`">{{ item.name }}</RouterLink></p>
          <p><RouterLink :to="`/profile/${item.ownerId}`">{{ item.ownerUsername }}</RouterLink></p>
          <p>{{ item.description }}</p>
          <img v-bind:src="item.imageUrl" style="max-width:30%">
        </li>
      </ul> 
    </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { db } from '../firebase/firebase'
import { collection, getDocs, query, orderBy, doc, getDoc, where } from 'firebase/firestore'

const userListings = ref([])
const searchQuery = ref('')

const searchListings = computed(() => { //computes listings to show based on user search input
  return userListings.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

onMounted(async () => {
    //get all listings
    const listingsRef = collection(db, 'listings')
    const listingsQuery = query(
      listingsRef,
      where('isApproved', '!=', true),
      orderBy('createdAt', 'desc'),
    )
    const querySnapshot = await getDocs(listingsQuery)

    for (const listingDoc of querySnapshot.docs){
      const listingData = listingDoc.data()
      const ownerId = listingData.ownerId

      let username = ''

      //get owner username
      try {
        const userDoc = await getDoc(doc(db, 'users', ownerId))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          username = userData.username || 'Unknown'
        }
      } catch (error) {
        console.error('Cannot get user: ', error)
      }

      //push listings to userListings array
      userListings.value.push({
        id: listingDoc.id,
        ...listingData,
        ownerUsername: username,
    })
    }
  }
)
</script>