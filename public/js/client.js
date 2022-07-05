const send = document.querySelector('.send')
const username = "fybrr" || prompt("Give Username:");
const room = 123 || prompt("give room:");

const socket = io.connect();

socket.emit('joinRoom', { username, room });

const client = new WebTorrent();

const trackers = {
    announce: ['wss://tracker.btorrent.xyz', 'wss://tracker.openwebtorrent.com'],
};

send.addEventListener('click', (e) => {
    e.preventDefault();

    // Get message text

    const files = document.getElementById("file").files;

    client.seed(files, trackers, function(torrent) {
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
        let check = setInterval(() => {
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

    // client.on('torrent', (torrent) => {
    //     console.log(torrent);
    //     // const file1 = torrent.files.find(function(file) {
    //     //     return file.name.endsWith('.jpg')
    //     // })
    //     let check = setInterval(() => {
    //         document.querySelector('#progress').value = torrent.progress * 100;
    //         if (torrent.progress == 1) {
    //             torrent.files.forEach(file => {
    //                 file.getBlobURL(function(err, url) {
    //                     if (err) throw err
    //                     const a = document.createElement('a')
    //                     a.download = file.name
    //                     a.href = url
    //                     a.textContent = 'Download ' + file.name
    //                     document.body.appendChild(a);
    //                     a.click();
    //                     a.remove();
    //                 })
    //             });
    //             clearInterval(check);
    //         }

    //     }, 1000);
    //     // file1.appendTo('body')
    // })
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