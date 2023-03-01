
const socket = io('ws://localhost:3000');
var question = document.querySelector('#question');
var menu = document.querySelector('#menu');
var text = document.querySelector('.welcomeText');
var configSetting = document.querySelector('.quiz-options-container');
var countdown = document.querySelector('#countdown');
var questionTracker = 0;

countdown.style.display = 'none';

document.querySelector('#changeName').onclick = () => {
    const nameText = document.querySelector('#changeNameText').value;
    socket.emit('change-name', nameText);
}
document.querySelector('#startGame').onclick = () => {
    let selectCategory = document.querySelector('#category').value;
    let selectDifficulty = document.querySelector('#difficulty').value;

    if (selectCategory !== "") {
        selectCategory = `&category=${selectCategory}`;
    }
    if (selectDifficulty !== "") {
        selectDifficulty = `&difficulty=${selectDifficulty}`;
    }
    const apiURL = `https://opentdb.com/api.php?amount=10${selectCategory}${selectDifficulty}&type=multiple`
    socket.emit('api-request', apiURL);
}
socket.on('update-name', text => {

    const para = document.createElement('p');
    para.innerHTML = text;
    document.querySelector('#names').appendChild(para)
});
socket.on('submit-apiResult', apiData => {
    const jsonData = JSON.parse(apiData);
    console.log(jsonData);

    if (jsonData.response_code === 1) {
        console.log("reloaded");
        location.reload();
    }
    if (menu.textContent !== "") {
        // Makes textContent empty 
        menu.textContent = "";
        configSetting.textContent = "";
    }
    startGame(jsonData);
    function startGame(jsonData) {
        nextQuestion(jsonData);
    }
    function nextQuestion(jsonData) {
        if (questionTracker >= 9) {
            location.reload();
        }
        countdown.style.display = 'block';
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
        text.textContent = "";
        question.textContent = "";
        text.innerHTML = `${jsonData.results[questionTracker].question}`;

        // Arrays of possible combinations
        // NOTE: incorrectAnswers is an array, and correctAnswer is a normal string
        const incorrectAnswers = jsonData.results[questionTracker].incorrect_answers;
        const correctAnswer = jsonData.results[questionTracker].correct_answer;

        // 4 different paterns, so the possible answers are mixed
        const array1 = new Array(incorrectAnswers[1], incorrectAnswers[2], incorrectAnswers[0], correctAnswer);
        const array2 = new Array(incorrectAnswers[1], incorrectAnswers[0], correctAnswer, incorrectAnswers[2]);
        const array3 = new Array(incorrectAnswers[2], correctAnswer, incorrectAnswers[1], incorrectAnswers[0]);
        const array4 = new Array(correctAnswer, incorrectAnswers[0], incorrectAnswers[1], incorrectAnswers[2]);

        // Random numbers that gets number between 1-4
        min = Math.ceil(1);
        max = Math.floor(5);
        const random = Math.floor(Math.random() * (max - min) + min);

        // Switch case to which patern to use
        switch (random) {
            case 1:
                displayPatern(array1);
                break;
            case 2:
                displayPatern(array2);
                break;
            case 3:
                displayPatern(array3);
                break;
            case 4:
                displayPatern(array4);
                break;
            default:
                console.log("No patern  found");
                break;
        }
        // Function for displaying the patern,
        // a button is created for every answer
        // The button is assigned an id for css reasons
        function displayPatern(patern) {
            for (let i = 0; i < patern.length; i++) {

                let button = document.createElement('button');
                button.id = "quizButton";
                if (patern[i] === correctAnswer) {
                    button.innerHTML = `${patern[i]}`;
                    button.className = "correctAnswer";
                    question.appendChild(button);
                } else {
                    button.innerHTML = `${patern[i]}`;
                    button.className = "incorrectAnswer";
                    question.appendChild(button);
                }
            }
        }
        questionTracker += 1;
    }
});