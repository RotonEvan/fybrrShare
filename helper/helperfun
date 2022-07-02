const users = []
function newUser(id, username, room) {
    const user = { id, username, room }
    users.push(user)
    return user;
}

function getIndividualRoomUsers(room) {
    return users.filter(user => user.room === room)
}

function getActiveUser(id) {
    return users.find(user => user.id === id)
}

module.exports = { newUser, getActiveUser, getIndividualRoomUsers }