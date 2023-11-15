const URL = import.meta.env.VITE_API_URL

export async function registerUser(data) {

    const response = await fetch(`${URL}/users`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data)
    })

    return await response.json()
}

export async function loginUser(data) {
    const response = await fetch(`${URL}/auth/login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data)
    })

    return await response.json()
}

export async function authenticateUser(){
    const response = await fetch(`${URL}/auth/jwt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: null
    })

    return await response.json()
}

export async function queryUsers(query){
    const response = await fetch(`${URL}/users/${query}`)
    return await response.json()
}


export async function sendChatRequest(senderId, receiverId){
    const response = await fetch(`${URL}/chats/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({senderId, receiverId})
    })

    return response.json()
}

export async function getChatsByUser(userId){
    const response = await fetch(`${URL}/chats/user/${userId}`)
    return await response.json()
}


export async function getChatById(chatId, userId, addUserToReadBy){
    const response = await fetch(`${URL}/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId, addUserToReadBy})
    })
    return await response.json()
}

export async function sendMessage(message, userId, chatId, images, files){
    const response = await fetch(`${URL}/chats/${chatId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message,
            userId,
            images,
            files
        })
    })

    return await response.json()
}

export async function getUserById(userId){
    const response = await fetch(`${URL}/users/get-one/${userId}`)
    return response.json()
}

export async function createNewChat(users){
    const response = await fetch(`${URL}/chats`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({users})
    })

    return await response.json()
}

export async function getPreviousBatch(batchNumber, chatId){
    const response = await fetch(`${URL}/chats/${chatId}/batches/${batchNumber}`)
    return await response.json()
}

export async function deleteMessage(messageId, chatId){
    const response = await fetch(`${URL}/chats/${chatId}/messages/${messageId}`, {
        method: 'DELETE'
    })
    return await response.json()
}

export async function updateUser(userId, data){
    const response = await fetch(`${URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type':"application/json"
        },
        body: JSON.stringify(data)
    })
    return await response.json()
}

export async function logoutUser(){
    const response = await fetch(`${URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        body: null,
        headers: {
            'Content-Type':'application/json'
        }
    })
}