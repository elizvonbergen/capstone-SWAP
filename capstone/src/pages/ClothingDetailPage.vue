<template>
  <div class="listingDetails">
    <div class="listingDetailsImg">
      <img v-bind:src="listingInfo?.imageUrl">
    </div>

    <div class="listingDetailsInfo">
      <h1>{{ listingInfo?.name }}</h1>
      <p id="owner"><b>Posted by:</b> <i>{{ ownerUsername }}</i></p>
      <p id="listedDate"><b>Listing added:</b> {{ formattedDate }}</p>
      <p><b>Description:</b> {{ listingInfo?.description }}</p>
      <!-- button shown for swap req if NOT the owner -->
      <button v-if="showSwapButton" @click="swapRequestForm"> Request Swap </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db, auth } from '../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
const listingId = route.params.listingId
const listingInfo = ref(null)
const showSwapButton = ref(false)
const ownerUsername = ref("")

const swapRequestForm = () => {
  router.push(`/swap/${listingId}`)
}

const formattedDate = computed(() => { //formats timestamp to date
  if (listingInfo.value?.createdAt) {
    const timestamp = listingInfo.value?.createdAt
    const date = new Date(timestamp.seconds * 1000) //timestamp to date
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${month}/${day}/${year}` //formats MM/DD/YYYY
  }
  return ''
})

async function getUserById(userId) {
  try {
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.warn("No user")
      return null
    }
  } catch (err) {
    console.error("Error:", err)
    return null
  }
}

onMounted(async () => {
  //get listing info
  const listingDoc = await getDoc(doc(db, 'listings', listingId))
  if (listingDoc.exists()) {
    listingInfo.value = listingDoc.data()

    if (auth.currentUser && auth.currentUser.uid !== listingInfo.value.ownerId) {
      showSwapButton.value = true
    }
  }

  //get owner username
  if (listingInfo.value?.ownerId) {
    const user = await getUserById(listingInfo.value.ownerId)
    if(user) {
      ownerUsername.value = user.username
    }
  }
}
)

</script>