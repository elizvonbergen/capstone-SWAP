<template>
    <h1>Clothing Details</h1>
    <h2>Name: {{ listingInfo?.name }}</h2>
    <p>Description: {{ listingInfo?.description }}</p>
    <img v-bind:src="listingInfo?.imageUrl" style="max-width: 30%;">
    <p>Date added: {{ formattedDate }}</p>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const listingId = route.params.listingId
const listingInfo = ref(null)

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

onMounted(async () => {
  //get listing info
  const listingDoc = await getDoc(doc(db, 'listings', listingId))
  if (listingDoc.exists()) {
    listingInfo.value = listingDoc.data()
  }
}
)

</script>