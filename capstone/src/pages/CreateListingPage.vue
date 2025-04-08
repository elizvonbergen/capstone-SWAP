<template>
    <div>
        <h1>Create New Listing</h1>
        <form @submit.prevent="submitListing">  <!-- form for new item -->
            <input v-model="name" placeholder="Clothing Name" />
            <input v-model="imageUrl" placeholder="Image" />
            <textarea v-model="description" placeholder="Description"></textarea>
            <button type="submit">Post Listing</button>
            <p v-if="error"> {{ error }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const name = ref('')
const description = ref('')
const imageUrl = ref('')
const error = ref('')
const router = useRouter()

const submitListing = async() => {
    const user = auth.currentUser

    if (!user) {
        error.value = 'Error!'
    }

    try {
        const docRef = addDoc(collection(db, 'listings'), {
            name: name.value,
            description: description.value,
            imageUrl: imageUrl.value,
            ownerId: user.uid,
            createdAt: serverTimestamp(),
        })
        //push to details for new listing
        router.push(`/clothing/${docRef.id}`)
    } catch (err) {
        console.error(err)
        error.value = 'Failed to create listing. Please try again.'
    }
}

</script>