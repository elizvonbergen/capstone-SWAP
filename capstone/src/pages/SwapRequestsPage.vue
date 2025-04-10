<template>
    <h1>Current Swap Requests</h1>

    <h2>Received Requests</h2>
    <div v-if="receivedRequests.length">
    <li v-for="req in receivedRequests" :key="req.id">
        <p>{{ req.senderUsername }}'s {{ req.senderItem?.name || '...' }} for your {{ req.receiverItem?.name || '...' }}</p>
        <p>Status: {{ req.status }}</p>
        <div>
            <button
                @click="updateStatus(req.id, 'approved')"
                :disabled="req.status !== 'pending'">
                Approve</button>
            <button
                @click="updateStatus(req.id, 'denied')"
                :disabled="req.status !== 'pending'">
                Deny</button>
        </div>
    </li>
    </div>
    <div v-else>
        <p>No swap requests received yet.</p>
    </div>

    <h2>Sent Requests</h2>
    <div v-if="sentRequests.length">
    <li v-for="req in sentRequests" :key="req.id">
        <p>{{ req.senderItem?.name || '...' }} for {{ req.receiverUsername }}'s {{ req.receiverItem?.name || '...' }}</p>
        <p>Status: {{ req.status }}</p>
    </li>
    </div>
    <div v-else>
        <p>No swap requests sent yet.</p>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '../firebase/firebase'
import { collection, query, where, getDocs, doc, getDoc, orderBy, updateDoc } from 'firebase/firestore'

const sentRequests = ref([])
const receivedRequests = ref([])

//get listing info
const fetchItem = async (listingId) => {
    const docSnap = await getDoc(doc(db, 'listings', listingId))
    return docSnap.exists() ? {
        id: docSnap.id,
        ... docSnap.data()
    } : null
}

//get username info
const fetchUsername = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId))
    return userDoc.exists() ? userDoc.data().username : 'Unknown'
}

//update request status
const updateStatus = async (requestId, newStatus) => {
    try {
        const requestRef = doc(db, 'swapRequests', requestId)
        await updateDoc(requestRef, { status: newStatus })

        //update local data for user
        const request = receivedRequests.value.find(r => r.id === requestId)
        if (request) {
            request.status = newStatus
        }

        if (newStatus === 'approved' && request?.receiverListingId) {
            const listingRef = doc(db, 'listings', request.receiverListingId)
            await updateDoc(listingRef, { isApproved: true })
        }
    } catch (err) {
        console.error('Error updating request status. ', err)
    }
}

onMounted(async () => {
    const currentUser = auth.currentUser
    if (!currentUser) { return }

    const requestsRef = collection(db, 'swapRequests')

    //get sent requests
    const sentQuery = query(requestsRef, where('senderId', '==', currentUser.uid), orderBy('timestamp', 'desc'))
    const sentSnapshot = await getDocs(sentQuery)
    for (const docSnap of sentSnapshot.docs) {
        const data = docSnap.data()
        const senderItem = await fetchItem(data.senderListingId)
        const receiverItem = await fetchItem(data.receiverListingId)
        const receiverUsername = await fetchUsername(data.receiverId)

        sentRequests.value.push({
            id: docSnap.id,
            ...data,
            senderItem,
            receiverItem,
            receiverUsername,
        })
    }

    //get received requests
    const receivedQuery = query(requestsRef, where('receiverId', '==', currentUser.uid), orderBy('timestamp', 'desc'))
    const receivedSnapshot = await getDocs(receivedQuery)
    for (const docSnap of receivedSnapshot.docs) {
        const data = docSnap.data()
        const senderItem = await fetchItem(data.senderListingId)
        const receiverItem = await fetchItem(data.receiverListingId)
        const senderUsername = await fetchUsername(data.senderId)

        receivedRequests.value.push({
            id: docSnap.id,
            ...data,
            senderItem,
            receiverItem,
            senderUsername,
        })
    }
})
</script>