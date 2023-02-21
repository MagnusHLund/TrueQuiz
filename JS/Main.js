const question = document.querySelector('#question');
const menu = document.querySelector('#menu');
const text = document.querySelector('.welcomeText');
let questionTracker = 0;
async function getData() {
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple`);
    const data = await response.json();
    console.log(data);
    // Checks if the elements textcontent isn't empty 
    if (menu.textContent !== "") {
        // Makes textContent empty 
        menu.textContent = "";
    }
    startGame(data);
    function startGame(data) {
        nextQuestion(data);
    }
    function nextQuestion(data) {
        if (questionTracker >= 9) {
            location.reload();
        }
        var timeleft = 158765;
        var downloadTimer = setInterval(function () {
            if (timeleft <= 0) {
                clearInterval(downloadTimer);
                document.getElementById("countdown").innerHTML = "Loading next question...";
                nextQuestion(data);
            } else {
                document.getElementById("countdown").innerHTML = timeleft + " seconds left!";
            }
            timeleft -= 1;
        }, 1000);
        console.log(`Correct Answer: ${data.results[questionTracker].correct_answer}`);
        text.textContent = "";
        question.textContent = "";
        text.innerHTML = `${data.results[questionTracker].question}`;
        for (let a = 0; a < 3; a++) {
            let answer = document.createElement('button');
            answer.innerHTML = `${data.results[questionTracker].incorrect_answers[a]}`;
            answer.id = `${a}`;
            question.appendChild(answer);
        }
        questionTracker += 1;
    }
}
