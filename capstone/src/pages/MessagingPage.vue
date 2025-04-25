<template>
    <h1>Message</h1>

    <div class="messages">
      <div v-for="msg in messages" :key="msg.id" :class="{'mine': msg.senderId === user?.uid}">
        <p>{{ msg.text }}</p>
        <p><small>{{ msg.senderUsername }}
           {{ new Date(msg.timestamp?.seconds * 1000).toLocaleString() }}</small></p>
      </div>
    </div>

    <div class="inputBox">
      <input v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage"/>
      <button @click="sendMessage">Send</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '../firebase/firebase'
import { collection, query, orderBy, addDoc, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { useRoute } from 'vue-router'

const route = useRoute()
const messages = ref([])
const newMessage = ref('')
const user = auth.currentUser

//get username
const getUsername = async (userId) => {
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        return userData.username
    } else {
        console.error('No user found.')
        return null
    }
}

onMounted(() => {
  const requestId = route.params.requestId
  if (!requestId) {
    console.error('Missing requestId in route params')
    return
  }

  const messagesRef = collection(db, 'swapRequests', requestId, 'messages')
  const q = query(messagesRef, orderBy('timestamp'))

  onSnapshot(q, async (snapshot) => {
    messages.value = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data()
        const senderUsername = await getUsername(data.senderId)
        return { id: doc.id, ...data, senderUsername }
    }))
  })
})

//send message
const sendMessage = async () => {
  const requestId = route.params.requestId
  if (!requestId || !newMessage.value.trim()) return

  const messagesRef = collection(db, 'swapRequests', requestId, 'messages')
  await addDoc(messagesRef, {
    senderId: user.uid,
    text: newMessage.value,
    timestamp: serverTimestamp()
  })
  newMessage.value = ''
}

</script>