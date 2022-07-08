const socket = io.connect();
const client = new WebTorrent();

window.onload = function () {
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

let localID;
socket.on("socketID", (socketid, peersObj) => {
    localID = socketid;
    peers = peersObj;
    Object.keys(peers).forEach(peername => {
        if (peername !== username) {
            chart.series[0].addPoint([username, peername], true);
        }
    });
})

const trackers = {
    announce: ['wss://tracker.btorrent.xyz', 'wss://tracker.openwebtorrent.com'],
};

let allFiles = {};
let torrentURIlist = [];
let filesProgress = {};
const files_input = document.getElementById('files-input');
files_input.addEventListener('input', (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    files.forEach(file => {
        const uuid = uuidv4();
        allFiles[file.name] = uuid;
        const template = document.querySelector('template[data-template="file-template"]')
        let clone = template.content.cloneNode(true);
        clone.querySelector('.card').id = uuid;
        clone.querySelector('.card-title').id = 'title-' + uuid;
        clone.querySelector('.card-text').id = 'text-' + uuid;
        clone.querySelector('.progress-bar').id = 'progress-' + uuid;
        clone.querySelector('.card-title').innerHTML = file.name;
        clone.querySelector('.card-text').innerHTML = 'Sending to everyone'
        clone.querySelector('.progress-bar').style.width = '0%'
        document.querySelector('.files-list').appendChild(clone.querySelector('.card'));

    });


    client.seed(e.target.files, trackers, function (torrent) {    // we need FileList since we are sending the list of files not array
        console.log('Client is seeding ' + torrent.magnetURI)
        // socket.emit('sendMessage', torrent.magnetURI);
        torrentURIlist.push(torrent.magnetURI);
        torrent.files.forEach(file => {
            // let check = setInterval(() => {
            //     const id = allFiles[file.name];
            //     document.querySelector("#progress-" + id).style.width = file.progress * 100 + "%";

            //     if (file.progress === 1) {
            //         document.querySelector('#text-' + id).innerHTML = "Sent to everyone";
            //         document.querySelector('#title-' + id).innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>'
            //         clearInterval(check);
            //     }
            // }, 1000);
            filesProgress[file.name] = roomSize;
        });
    })

    document.querySelector('.send-file-btn').disabled = false;
})

const send = document.querySelector('.send-file-btn')
send.addEventListener('click', (e) => {
    e.preventDefault();

    // Get message text
    torrentURIlist.forEach(element => {
        socket.emit('sendMessage', element, username, localID);
    });
    send.disabled = true;
    torrentURIlist = [];
})

socket.on("sendProgress", (progress, filename) => {
    const id = allFiles[filename];
    document.querySelector("#progress-" + id).style.width = progress;

    if (progress === '100%') {
        filesProgress[filename] -= 1;
        if (filesProgress[filename] == 1) {
            document.querySelector('#text-' + id).innerHTML = "Sent to everyone";
            document.querySelector('#title-' + id).innerHTML += "&nbsp" + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>'

        }
    }


});

let peers = {};
socket.on("updateRoom", (newPeer, roomSize, newPeerID) => {
    window.roomSize = roomSize;
    if (newPeer !== username) {
        peers[newPeer] = newPeerID;
        chart.series[0].addPoint([username, newPeer], true);
    }
})

socket.on('sendToClient', (torrentID, peer, senderid) => {
    console.log("Torrent received " + torrentID)

    client.add(torrentID, trackers, (torrent) => {
        console.log(torrent);
        torrent.files.forEach(file => {
            const uuid = uuidv4();
            allFiles[file.name] = uuid;
            const template = document.querySelector('template[data-template="file-template"]')
            let clone = template.content.cloneNode(true);
            clone.querySelector('.card').id = uuid;
            clone.querySelector('.card-title').id = 'title-' + uuid;
            clone.querySelector('.card-text').id = 'text-' + uuid;
            clone.querySelector('.progress-bar').id = 'progress-' + uuid;
            clone.querySelector('.card-title').innerHTML = file.name;
            clone.querySelector('.card-text').innerHTML = 'Receiving from ' + peer;
            clone.querySelector('.progress-bar').style.width = '0%'
            document.querySelector('.files-list').appendChild(clone.querySelector('.card'));

            let check = setInterval(() => { //for checking progress every 1000ms

                document.querySelector("#progress-" + uuid).style.width = file.progress * 100 + "%";
                socket.emit("sendProgress", file.progress * 100 + "%", file.name, senderid);
                if (file.progress === 1) {
                    document.querySelector('#text-' + uuid).innerHTML = "Received from " + peer;
                    document.querySelector('#title-' + uuid).innerHTML += "&nbsp" + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>'
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
                    clearInterval(check);
                }

            }, 1000);
        });
    })
})