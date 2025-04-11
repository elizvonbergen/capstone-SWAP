<template>
    <div>
        <h1>Create New Listing</h1>
        <form @submit.prevent="submitListing">  <!-- form for new item -->
            <input v-model="name" placeholder="Clothing Name" />
            <input type="file" @change="onChangeFile" name="file" />
            <img v-if="file" :src="filePreviewUrl" alt="Preview" style="max-width: 30%;" /> <!-- img preview-->
            <textarea v-model="description" placeholder="Description"></textarea>
            <button type="submit">Post Listing</button>
        </form>

        <div v-if="imageErrorMessage" class="popup"> {{ imageErrorMessage }} </div> <!-- error popup for invalid images-->
        <div v-if="errorMessage.length" class="popup"> <!-- error popup for empty values -->
        <ul>
          <li v-for="(message, index) in errorMessage" :key="index">
            {{ message }}
          </li>
        </ul>
       </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, storage } from '../firebase/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const name = ref('')
const description = ref('')
const file = ref(null)
const imageErrorMessage = ref('')
const errorMessage = ref([])
const router = useRouter()

const onChangeFile = (event) => {   //checks for valid image files
    const selected = event.target.files[0]

    if (selected && selected.type.startsWith('image/')) {
        imageErrorMessage.value = ('')
        file.value = selected
    } else {
        imageErrorMessage.value = ('Please select a valid image.')
        file.value = null
    }
}

const filePreviewUrl = computed(() => { //generates preview url for file
    return file.value ? URL.createObjectURL(file.value) : null
})

const submitListing = async() => {
    const user = auth.currentUser
    errorMessage.value = []

    //error messages
    if (!user) {
        errorMessage.value.push('Must be logged in.')
    } if (!name.value) {
        errorMessage.value.push('Must add a title.')
    } if (!description.value) {
        errorMessage.value.push('Must add a description.')
    } if (!file.value) {
        errorMessage.value.push('Must upload a valid image.')
    }

    if (errorMessage.value.length > 0) { return }

    try {
        imageErrorMessage.value = ''
        let imageUrl = ''
        if (file.value) {
            const imageRef = storageRef(storage, `listingImages/${Date.now()}`)
            const uploadResult = await uploadBytes(imageRef, file.value)
            imageUrl = await getDownloadURL(uploadResult.ref)
        }

        //add to db
        const docRef = await addDoc(collection(db, 'listings'), {
            name: name.value,
            description: description.value,
            imageUrl,
            ownerId: user.uid,
            createdAt: serverTimestamp(),
            isApproved: false,
        })
        //push to details for new listing
        router.push(`/listings/${docRef.id}`)
    } catch (err) {
        console.error(err)
        imageErrorMessage.value = ('Failed to create listing. Please try again.')
        return
    }
}

</script>