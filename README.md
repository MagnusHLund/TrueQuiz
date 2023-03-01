# TrueQuiz - Real-time Quiz Battle
TrueQuiz is a real-time quiz battle project that uses WebSockets and Socket.io
to connect multiple clients and allow them to compete against each other in a trivia-style game.
This project is built with Node.js and JavaScript and requires Node.js to be installed on the user's computer.

# Note
This project is relatively new, and is under heavy development.

# Installation
Make sure Node.js is installed on your computer. You can download it from the official website: https://nodejs.org/

Clone the repository or download the zip file and extract it to your desired location.

Open a terminal or command prompt and navigate to the directory where you have extracted the files.

Navigate to the TRUEQUIZ\server directory.

Install the required dependencies by running the following command:
``npm install``

# Usage
To run the server, navigate to the TRUEQUIZ\server directory and run the following command:
``node .``

Once the server is running, you can open the frontend by either:

Opening the index.html file located in the TRUEQUIZ\app directory in your browser.

Using a live server extension for your browser to serve the index.html file. Some popular extensions include Live Server for Visual Studio Code or Web Server for Chrome.

Once you have the frontend open in your browser, you can start create or join an game by filling out the "Lobby code" and "Username", then you can wait for multiple people to join your room. Finally you can start the game by clicking the "Start Game" button. You can then share the URL with other players so they can join the game.

Each player will need to enter a username and room code to join the game. Once all players have joined, the game will start and players will be presented with multiple-choice questions. The player with the highest score at the end of the game will be declared the winner.
