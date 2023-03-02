const socket = io('ws://localhost:3000');
var countdown = document.querySelector('#countdown');
let quizPoints = 0;

countdown.style.display = 'none';


document.querySelector('#changeName').onclick = () => {
    const nameText = document.querySelector('#changeNameText').value;
    const roomCode = document.querySelector('#roomCode').value;
    if (!nameText == '' && !roomCode == '') {
        socket.emit('change-name', nameText, roomCode);
    } else {
        console.log("Couldn't join, please fill the form!");
    }
}
document.querySelector('#startGame').onclick = () => {
    let selectCategory = document.querySelector('#category').value;
    let selectDifficulty = document.querySelector('#difficulty').value;
    const lobbyCode = document.querySelector('#roomCode').value;

    if (selectCategory !== "") {
        selectCategory = `&category=${selectCategory}`;
    }
    if (selectDifficulty !== "") {
        selectDifficulty = `&difficulty=${selectDifficulty}`;
    }
    const apiURL = `https://opentdb.com/api.php?amount=10${selectCategory}${selectDifficulty}&type=multiple`

    if (!lobbyCode == '') {
        socket.emit('api-request', apiURL, lobbyCode);
    } else {
        console.log("Not a valid lobby code");
    }
}
socket.addEventListener('message', (event) => {
    console.log(event); // Prints "Number of connected clients: X"
});
socket.on('update-name', text => {

    const lobbyCode = document.querySelector('#roomCode').value;
    let lobbyCodeText = document.querySelector('.lobbyCode');
    lobbyCodeText.textContent = "Lobby code:";
    lobbyCodeText.textContent += lobbyCode;

    const para = document.createElement('p');
    para.innerHTML = text;
    document.querySelector('#names').appendChild(para)

});

socket.on('submit-apiResult', apiData => {

    let questionTracker = 0;
    const question = document.querySelector('#question');
    const menu = document.querySelector('#menu');
    const text = document.querySelector('.welcomeText');
    const configSetting = document.querySelector('.quiz-options-container');


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
        let hasAnswered = false;
        console.log(`current points ${quizPoints}`);
        if (questionTracker >= 10) {
            location.reload();
        }
        countdown.style.display = 'block';
        var timeleft = 15;
        var downloadTimer = setInterval(function () {
            if (timeleft <= 0) {
                if (!hasAnswered) {
                    quizPoints -= 2;
                    console.log("You didn't answer in time -2 points");
                }
                clearInterval(downloadTimer);
                document.getElementById("countdown").innerHTML = "Loading next question...";
                nextQuestion(jsonData);
            } else {
                document.getElementById("countdown").innerHTML = timeleft + " seconds left!";
            }
            timeleft--;
        }, 1000);
        text.textContent = "";
        question.textContent = "";
        text.innerHTML = `${jsonData.results[questionTracker].question}`;

        // Arrays of possible combinations
        // NOTE: incorrectAnswers is an array, and correctAnswer is a normal string
        const incorrectAnswers = jsonData.results[questionTracker].incorrect_answers;

        // This is for getting the correct answer, some questions include the letter ', which is converted to &#039;
        // to revert this you can use innerHTML to change it back &#039; => '
        const tempCorrectAnswer = jsonData.results[questionTracker].correct_answer; // => &#039;For&#039; loops
        const tempElement = document.createElement("div");
        tempElement.innerHTML = tempCorrectAnswer;
        const correctAnswer = tempElement.textContent; // => 'for' loops




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
                button.className = "quizButton";

                if (patern[i] === correctAnswer) {
                    button.innerHTML = `${patern[i]}`;
                    button.id = `q${i}`;
                    question.appendChild(button);

                } else {
                    button.innerHTML = `${patern[i]}`;
                    button.id = `q${i}`;
                    question.appendChild(button);
                }
            }
            document.querySelector('#q0').onclick = () => {
                const answer = document.querySelector('#q0').textContent;
                checkAnswer(answer);
            }
            document.querySelector('#q1').onclick = () => {
                const answer = document.querySelector('#q1').textContent;
                checkAnswer(answer);
            }
            document.querySelector('#q2').onclick = () => {
                const answer = document.querySelector('#q2').textContent;
                checkAnswer(answer);
            }
            document.querySelector('#q3').onclick = () => {
                const answer = document.querySelector('#q3').textContent;
                checkAnswer(answer);
            }


            function checkAnswer(answer) {
                if (!hasAnswered) {
                    if (answer == correctAnswer) {
                        console.log(`${answer} is correct`);
                        quizPoints++;
                    }
                    else {
                        console.log(`${answer} is incorrect`);
                        quizPoints--;
                    }
                    hasAnswered = true;
                } else {
                    console.log("Already answered, wait for the next question");
                }
            }
        }
        questionTracker += 1;
    }
});
