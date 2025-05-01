<template>
    <h1 class="centered">Current Swap Requests</h1>

    <div class="requestSection"><h2>Received Requests</h2>
    <div v-if="receivedRequests.length" class="requestList">
    <li v-for="req in receivedRequests" :key="req.id" class="requestCard">
        <p class="requestText">{{ req.senderUsername }}'s {{ req.senderItem?.name || '...' }} for your {{ req.receiverItem?.name || '...' }}</p>
        <p class="requestStatus">Status: {{ req.status }}</p>

        <div v-if="req.status == 'pending'" class="buttonGroup"> <!-- if status is pending approval/denial -->
            <button
                @click="updateStatus(req.id, 'approved')"
                :disabled="req.status !== 'pending'"
                class="approveBtn">
                Approve</button>
            <button
                @click="updateStatus(req.id, 'denied')"
                :disabled="req.status !== 'pending'"
                class="denyBtn">
                Deny</button>
        </div>

        <div v-if="req.status == 'approved'" class="messageLink"> <!-- if status is approved -->
            <routerLink :to="{ name: 'Messages', params: { requestId: req.id } }">
                Message {{ req.senderUsername }}
            </routerLink>
        </div> 

        <div class="buttonGroup">
            <!-- if status is approved AND no delete request yet -->
            <button v-if="req.status == 'approved' && !req.deletionRequestedBy"
            @click="requestSwapDeletion(req.id)"
            class="completeBtn"> Mark Swap as Completed</button>
            
            <!-- if status is approved and deletion started and user is NOT the one who submitted request -->
            <button v-if="req.status == 'approved' && req.deletionRequestedBy && req.deletionRequestedBy !== auth.currentUser"
            @click="approveDeletion(req.id)"
            class="completeBtn"> Mark Swap as Complete </button>
        </div>
    </li>
    </div>
    <div v-else class="emptyState">
        <p>No swap requests received yet.</p>
    </div></div>

    <div class="requestSection"><h2>Sent Requests</h2>
    <div v-if="sentRequests.length" class="requestList">
    <li v-for="req in sentRequests" :key="req.id" class="requestCard">
        <p class="requestText">{{ req.senderItem?.name || '...' }} for {{ req.receiverUsername }}'s {{ req.receiverItem?.name || '...' }}</p>
        <p class="requestStatus">Status: {{ req.status }}</p>

        <div v-if="req.status == 'approved'" class="messageLink"> <!-- if status is approved -->
            <routerLink :to="{ name: 'Messages', params: { requestId: req.id } }">
                Message {{ req.receiverUsername }}
            </routerLink>
        </div>
        <div v-if="req.status == 'denied' || req.status == 'pending'" class="buttonGroup">
            <button @click="deleteRequest(req.id)" class="denyBtn"> Delete </button>
        </div>
    </li>
    </div>
    <div v-else class="emptyState">
        <p>No swap requests sent yet.</p>
    </div></div>


</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '../firebase/firebase'
import { collection, query, where, getDocs, doc, getDoc, orderBy, updateDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore'

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

//delete request (that user sent)
const deleteRequest = async (requestId) => {
    try {
        const requestRef = doc(db, 'swapRequests', requestId)
        await deleteDoc(requestRef)

        //remove from array (local)
        sentRequests.value = sentRequests.value.filter(req => req.id !== requestId)
    } catch (err) {
        console.error('Error deleting request: ', err)
    }
}

//request deletion (swap was completed)
const requestSwapDeletion = async (requestId) => {
    const currentUser = auth.currentUser
    await updateDoc(doc(db, 'swapRequests', requestId), {
        deletionRequestedBy: currentUser.uid,
        deletionApproved: true,
    })
}

//delete swap
    //NOTE: this moves them to a collection of completed swaps
const approveDeletion = async (requestId) => {
    const swapRef = doc(db, 'swapRequests', requestId)
    const swapSnap = await getDoc(swapRef)

    const swapData = swapSnap.data()

    //log to completed collection
    await setDoc(doc(db, 'swapCompleted', requestId), {
        ...swapData,
        completedAt: serverTimestamp()
    })

    //delete two listings from db

    //delete swap request
    await deleteDoc(swapRef)
    alert("Swap confirmed as completed!")
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