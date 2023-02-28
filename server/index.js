const http = require('http').createServer();
const https = require('https');
const io = require('socket.io')(http, {
    cors: {
        origin: [
            "http://localhost:5500", 
            "http://localhost:8080",
            "https://cdn.socket.io/socket.io-3.0.0.js"
        ]
    }
});

io.on('connection', (socket) => {
    console.log(`a user connected with id: ${socket.id}`);

    socket.on('change-name', (nameText, room) => {
        if (room === '') {
            console.log(`${socket.id} changed name to ${nameText}`);
            socket.id = nameText;
            io.emit('update-name', nameText);

        } else {
            socket.to(room);
            console.log(`${socket.id} changed name to ${nameText}`);
            io.emit('update-name', nameText);

        }
    });

    /* Quiz URL;
     Base URL:
     https://opentdb.com/api.php?amount=10

     Base URL with category:
     https://opentdb.com/api.php?amount=10&category=21

     Base URL with difficulty:
     https://opentdb.com/api.php?amount=10&difficulty=easy

     Base URL with category and difficulty:
     https://opentdb.com/api.php?amount=10&category=20&difficulty=easy
    */
    socket.on('api-request', (url) => {
        console.log("starting game...");
        console.log(`Sending request to: ${url}`);
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                io.emit('submit-apiResult', data);
            });
        }).on('error', (err) => {
            console.error(err);
        });
    });

});
http.listen(8080, () => console.log('listening on http://localhost:8080'));
