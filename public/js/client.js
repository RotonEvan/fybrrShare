const send = document.querySelector('.send')
const username = "fybrr" || prompt("Give Username:");
const room = 123 || prompt("give room:");

const socket = io.connect();

socket.emit('joinRoom', { username, room });

send.addEventListener('click', (e) => {
    e.preventDefault();

    // Get message text

    let msg = document.querySelector('#message').value;

    if (!msg) {
        return false;
    }

    // Emit message to server
    socket.emit('sendMessage', msg);
    document.querySelector('#message').value = "";
})

socket.on('sendToClient', (message) => {
    console.log("message received " + message)
})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

