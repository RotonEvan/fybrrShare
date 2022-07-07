
const username = prompt("Give Username:");

const socket = io.connect();

socket.emit('joinRoom', { username, roomID });

const client = new WebTorrent();

const trackers = {
    announce: ['wss://tracker.btorrent.xyz', 'wss://tracker.openwebtorrent.com'],
};

send.addEventListener('click', (e) => {
    e.preventDefault();

    // Get message text

    const files = document.getElementById("file").files;

    client.seed(files, trackers, function (torrent) {
        console.log('Client is seeding ' + torrent.magnetURI)
        socket.emit('sendMessage', torrent.magnetURI);
    })


    // if (!msg) {
    //     return false;
    // }

    // Emit message to server
    // socket.emit('sendMessage', msg);
    // document.querySelector('#message').value = "";
})

socket.on('sendToClient', (torrentID) => {
    console.log("Torrent received " + torrentID)

    client.add(torrentID, trackers, (torrent) => {
        console.log(torrent);
        let check = setInterval(() => {           //for checking progress every 1000ms
            document.querySelector('#progress').value = torrent.progress * 100;
            if (torrent.progress == 1) {
                torrent.files.forEach(file => {
                    file.getBlobURL(function (err, url) {
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

