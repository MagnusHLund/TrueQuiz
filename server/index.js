const http = require('http').createServer();
const https = require('https');
const io = require('socket.io')(http, {
    cors: {
        origin: [
            "http://localhost:5500",
        ]
    }
});

io.on('connection', (socket) => {
    console.log(`a user connected with id: ${socket.id} in room ${Array.from(socket.rooms)}`);

    socket.on('change-name', (nameText, room) => {

        socket.join(room);
        socket.displayName = nameText;
        // socket.to(room);
        console.log(`${socket.id} changed name to ${socket.displayName} and joined room ${Array.from(socket.rooms)}`);
        io.to(room).emit('update-name', nameText);
    });

    /* Quiz URL;
     Base URL:
     https://opentdb.com/api.php?amount=10
 
     There are 2 type of questions, True / False or multiple choice, in this project we use multiple choice:
     https://opentdb.com/api.php?amount=10&type=multiple
 
     Base URL with category:
     https://opentdb.com/api.php?amount=10&category=21&type=multiple
 
     Base URL with difficulty:
     https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple
 
     Base URL with category and difficulty:
     https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple
    */

    socket.on('api-request', (url, room) => {
        console.log(room);
        console.log("starting game...");
        console.log(`Sending request to: ${url}`);
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                io.to(room).emit('submit-apiResult', data);
                // io.emit('submit-apiResult', data);
            });
        }).on('error', (err) => {
            console.error(err);
        });
    });
});
http.listen(3000, () => console.log('listening on http://localhost:3000'));
