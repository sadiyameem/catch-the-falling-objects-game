const basket = document.getElementById('basket');
const applesContainer = document.querySelector('.game-container');
const scoreBoard = document.getElementById('score');
const timeBoard = document.getElementById('time');
const livesBoard = document.getElementById('lives');
const startBtn = document.getElementById('startBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const gameWrapper = document.getElementById('gameWrapper');

// Game Over popup elements
const gameOverPopup = document.getElementById('gameOverPopup');
const finalScore = document.getElementById('finalScore');
const closePopupBtn = document.getElementById('closePopupBtn');

// High score (resets on page refresh)
const highScoreBoard = document.getElementById('highScore');
let highScore = 0; // always starts at 0
highScoreBoard.textContent = highScore;

let score = 0;
let time = 30;
let lives = 3;
let gameActive = false;
let appleInterval;
let timer;
let baseSpeed = 6; // start faster
let endGameCleanup; 

function startGame() {
    if (gameActive) return;
    gameActive = true;

    score = 0;
    time = 30;
    lives = 3;
    baseSpeed = 6; // faster starting speed
    scoreBoard.textContent = score;
    timeBoard.textContent = time;
    livesBoard.textContent = "❤️".repeat(lives);

    basket.style.left = (applesContainer.offsetWidth / 2 - basket.offsetWidth / 2) + 'px';

    function moveBasket(e) {
        const containerRect = applesContainer.getBoundingClientRect();
        const basketWidth = basket.offsetWidth;
        let x = e.clientX - containerRect.left - basketWidth / 2;
        if (x < -basketWidth / 2) x = -basketWidth / 2;
        if (x > containerRect.width - basketWidth / 2) x = containerRect.width - basketWidth / 2;
        basket.style.left = x + 'px';
    }
    document.addEventListener('mousemove', moveBasket);
    endGameCleanup = () => document.removeEventListener('mousemove', moveBasket);

    timer = setInterval(() => {
        time--;
        timeBoard.textContent = time;
        if (time <= 0) endGame();
        baseSpeed += 0.1;
    }, 1000);

    appleInterval = setInterval(createFallingObject, 400); // apples appear more often
}

function endGame() {
    gameActive = false;
    clearInterval(timer);
    clearInterval(appleInterval);
    if (endGameCleanup) endGameCleanup();
    document.querySelectorAll('.apple, .golden, .raindrop').forEach(a => a.remove());
    gameWrapper.classList.remove("blurred");

    // Show Game Over popup
    finalScore.textContent = score;
    gameOverPopup.style.display = 'block';

    // Update high score
    if(score > highScore){
        highScore = score;
        highScoreBoard.textContent = highScore;
    }
}

playAgainBtn.addEventListener('click', () => {
    if (gameActive) {
        clearInterval(timer);
        clearInterval(appleInterval);
        if (endGameCleanup) endGameCleanup();
        document.querySelectorAll('.apple, .golden, .raindrop').forEach(a => a.remove());
        gameWrapper.classList.remove("blurred");
    }
    startGame();
});

// Close popup button
closePopupBtn.addEventListener('click', () => {
    gameOverPopup.style.display = 'none';
});

function createFallingObject() {
    const obj = document.createElement('div');
    const rand = Math.random();

    let isGolden = false;
    let isRaindrop = false;

    if (rand < 0.15) {
        obj.classList.add('raindrop');
        isRaindrop = true;
    } else if (rand < 0.35) {
        obj.classList.add('golden');
        isGolden = true;
    } else {
        obj.classList.add('apple');
        const shine = document.createElement('div');
        shine.classList.add('shine');
        obj.appendChild(shine);
    }

    obj.style.top = '-30px';
    obj.style.left = Math.random() * (applesContainer.offsetWidth - 30) + 'px';
    applesContainer.appendChild(obj);

    let speed = baseSpeed;
    let speedIncrement = 0.05; // falls faster over time

    const fallInterval = setInterval(() => {
        let objTop = parseInt(obj.style.top);
        obj.style.top = objTop + speed + 'px';

        const basketRect = basket.getBoundingClientRect();
        const objRect = obj.getBoundingClientRect();

        if (
            objRect.bottom >= basketRect.top &&
            objRect.left < basketRect.right &&
            objRect.right > basketRect.left
        ) {
            if (isRaindrop) {
                loseLife();
                gameWrapper.classList.add("blurred");
                setTimeout(() => gameWrapper.classList.remove("blurred"), 2000);
            } else {
                score += isGolden ? 5 : 1;
                scoreBoard.textContent = score;
            }
            obj.remove();
            clearInterval(fallInterval);
        }

        if (objTop > applesContainer.offsetHeight) {
            if (!isRaindrop) loseLife();
            obj.remove();
            clearInterval(fallInterval);
        }

        speed += speedIncrement;
    }, 20);
}

// Lose life function
function loseLife() {
    lives--;
    livesBoard.textContent = "❤️".repeat(lives);
    if (lives <= 0) {
        endGame();
    }
}

startBtn.addEventListener('click', startGame);




















