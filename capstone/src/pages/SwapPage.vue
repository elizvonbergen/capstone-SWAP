<template>
  <div class="swapReqContainer">
    <div v-if="listing" class="swapReq">
      <p><b>You are requesting:</b> <i>{{ listing.name }}</i></p>
      <img :src="listing.imageUrl" style="max-width:30%" />
    </div>

    <div v-if="userItems.length" class="swapOffer">
      <p v-if="successMessage" class="popup"> 
        {{ successMessage }}
      </p>
      <h1>Swap Request</h1>
      <label>Select an item to offer:</label>
      <select v-model="selectedItemId">

        <option v-for="item in userItems" 
                :value="item.id" 
                :key="item.id"
                :disabled="item.isApproved == true">
                <!-- prevents approved items from showing as an option -->
          {{ item.name }}
          {{ item.isApproved == true ? '(swap in progress)' : '' }}
        </option>
      </select>

      <button @click="sendRequest"> Send Request </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db, auth } from '../firebase/firebase'
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'

const route = useRoute()
const listingId = route.params.listingId
const listing = ref(null)
const userItems = ref([])
const selectedItemId = ref(null)
const successMessage = ref('')

onMounted(async () => {
  const listingDoc = await getDoc(doc(db, 'listings', listingId))
  if (listingDoc.exists()) {
    listing.value = listingDoc.data()
  }

  const currentUser = auth.currentUser
  if (!currentUser) { return }

  //get current user's items
    //to propose an item of theirs to swap with
  const listingQuery = query(collection(db, 'listings'), where('ownerId', '==', currentUser.uid))
  const snapshot = await getDocs(listingQuery)
  userItems.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})

const sendRequest = async () => {
  const currentUser = auth.currentUser
  if (!currentUser || !selectedItemId.value) { return }

  //check for identical request
  const existingQuery = query(
    collection(db, 'swapRequests'),
    where('senderListingId', '==', selectedItemId.value),
    where('receiverListingId', '==', listingId)
  )

  const existingSnapshot = await getDocs(existingQuery)

  if (!existingSnapshot.empty) {
    successMessage.value = 'You have already sent this same request!'
    return
  }

  //add request to db
  await addDoc(collection(db, 'swapRequests'), {
    senderId: currentUser.uid,
    senderListingId: selectedItemId.value,
    receiverId: listing.value.ownerId,
    receiverListingId: listingId,
    status: 'pending',
    timestamp: serverTimestamp(),
    deletionRequestedBy: '',
    deletionApproved: false,
})
// show message upon successful send
successMessage.value = 'Swap request sent successfully!'
}

</script>