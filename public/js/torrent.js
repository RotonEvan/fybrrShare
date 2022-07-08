const socket = io.connect();
const client = new WebTorrent();

window.onload = function() {
    const roomID = location.pathname.substring(location.pathname.length - 4);
    console.log(roomID);
    window.roomID = roomID;
    document.querySelector('.roomID').innerText += roomID;
    const username = prompt("Give Username:");
    socket.emit('joinRoom', { username, roomID });
    window.username = username;
    window.socket = socket;
    window.client = client;
}

const trackers = {
    announce: ['wss://tracker.btorrent.xyz', 'wss://tracker.openwebtorrent.com'],
};

const files_input = document.getElementById('files-input');
files_input.addEventListener('input', (e) => {
    const files = e.target.files;
    console.log(files);
    document.querySelector('.send-file-btn').disabled = false;
})

// send.addEventListener('click', (e) => {
//     e.preventDefault();

//     // Get message text

//     const files = document.getElementById("file").files;

//     client.seed(files, trackers, function(torrent) {
//         console.log('Client is seeding ' + torrent.magnetURI)
//         socket.emit('sendMessage', torrent.magnetURI);
//     })


//     // if (!msg) {
//     //     return false;
//     // }

//     // Emit message to server
//     // socket.emit('sendMessage', msg);
//     // document.querySelector('#message').value = "";
// })

socket.on('sendToClient', (torrentID) => {
    console.log("Torrent received " + torrentID)

    client.add(torrentID, trackers, (torrent) => {
        console.log(torrent);
        let check = setInterval(() => { //for checking progress every 1000ms
            document.querySelector('#progress').value = torrent.progress * 100;
            if (torrent.progress == 1) {
                torrent.files.forEach(file => {
                    file.getBlobURL(function(err, url) {
                        if (err) throw err
                        const a = document.createElement('a')
                        a.download = file.name
                        a.href = url
                        a.textContent = 'Download ' + file.name
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                });
                clearInterval(check);
                document.querySelector('#progress').value = 0;
            }

        }, 1000);
    })
})