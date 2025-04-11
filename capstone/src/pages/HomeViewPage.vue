<template>
    <section>
      <h1>Swap. Style. Sustain.</h1>
      <p>
        Welcome to ClosetSwap – a platform where you can list your clothes, discover new styles, and swap fashion with others in the community. It’s sustainable, social, and stylish.
      </p>
    </section>

    <section>
      <h2>Newest Listings</h2>
      <ul>
        <li v-for="item in userListings" :key="item.id">
          <p><RouterLink :to="`/listings/${item.id}`">{{ item.name }}</RouterLink></p>
          <p><RouterLink :to="`/profile/${item.ownerId}`">{{ item.ownerUsername }}</RouterLink></p>
          <p>{{ item.description }}</p>
          <img v-bind:src="item.imageUrl" style="max-width:30%">
        </li>
      </ul> 
    </section>
  </template>

<script setup>
import { onMounted, ref } from 'vue'
import { db } from '../firebase/firebase'
import { collection, getDocs, query, orderBy, limit, doc, getDoc, where } from 'firebase/firestore'

const userListings = ref([])

onMounted(async () => {
    //get all listings, max of 10 to show at once
    const listingsRef = collection(db, 'listings')
    const listingsQuery = query(
      listingsRef,
      where('isApproved', '!=', true),
      orderBy('createdAt', 'desc'),
      limit(10)
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