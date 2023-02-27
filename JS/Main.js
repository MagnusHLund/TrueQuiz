
const socket = io('ws://localhost:8080');
var question = document.querySelector('#question');
var menu = document.querySelector('#menu');
var text = document.querySelector('.welcomeText');
var questionTracker = 0;



socket.on('update-name', text => {

    const para = document.createElement('p');
    para.innerHTML = text;
    document.querySelector('#names').appendChild(para)

});
document.querySelector('#changeName').onclick = () => {
    const nameText = document.querySelector('#changeNameText').value;
    socket.emit('change-name', nameText);
}
document.querySelector('#startGame').onclick = () => {
    socket.emit('api-request');
}
socket.on('submit-apiResult', apiData => {
    const jsonData = JSON.parse(apiData);
    console.log(jsonData);
    if (menu.textContent !== "") {
        // Makes textContent empty 
        menu.textContent = "";
    }
    startGame(jsonData);
    function startGame(jsonData) {
        nextQuestion(jsonData);
    }
    function nextQuestion(jsonData) {
        if (questionTracker >= 9) {
            location.reload();
        }
        var timeleft = 15;
        var downloadTimer = setInterval(function () {
            if (timeleft <= 0) {
                clearInterval(downloadTimer);
                document.getElementById("countdown").innerHTML = "Loading next question...";
                nextQuestion(jsonData);
            } else {
                document.getElementById("countdown").innerHTML = timeleft + " seconds left!";
            }
            timeleft -= 1;
        }, 1000);
        console.log(`Correct Answer: ${jsonData.results[questionTracker].correct_answer}`);
        text.textContent = "";
        question.textContent = "";
        text.innerHTML = `${jsonData.results[questionTracker].question}`;
        for (let a = 0; a < 3; a++) {
            let answer = document.createElement('button');
            answer.innerHTML = `${jsonData.results[questionTracker].incorrect_answers[a]}`;
            answer.id = `${a}`;
            question.appendChild(answer);
        }
        questionTracker += 1;
    }
});