const basket = document.getElementById('basket');
const applesContainer = document.querySelector('.game-container');
const scoreBoard = document.getElementById('score');
const timeBoard = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

let score = 0;
let time = 30;
let gameActive = false;
let appleInterval;
let timer;
let baseSpeed = 4; 
let endGameCleanup; 

function startGame() {
    if (gameActive) return;
    gameActive = true;

    score = 0;
    time = 30;
    baseSpeed = 3; 
    scoreBoard.textContent = score;
    timeBoard.textContent = time;

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
        baseSpeed += 0.05;
    }, 1000);

    appleInterval = setInterval(createApple, 800);
}

function endGame() {
    gameActive = false;
    clearInterval(timer);
    clearInterval(appleInterval);
    if (endGameCleanup) endGameCleanup();
    document.querySelectorAll('.apple, .golden').forEach(a => a.remove());
}

playAgainBtn.addEventListener('click', () => {
    if (gameActive) {
        clearInterval(timer);
        clearInterval(appleInterval);
        if (endGameCleanup) endGameCleanup();
        document.querySelectorAll('.apple, .golden').forEach(a => a.remove());
    }
    startGame();
});

function createApple() {
    const apple = document.createElement('div');
    const isGolden = Math.random() < 0.2;
    if (isGolden) apple.classList.add('golden');
    else {
        apple.classList.add('apple');
        const shine = document.createElement('div');
        shine.classList.add('shine');
        apple.appendChild(shine);
    }
    apple.style.top = '-30px';
    apple.style.left = Math.random() * (applesContainer.offsetWidth - 30) + 'px';
    applesContainer.appendChild(apple);

    let speed = baseSpeed; 
    let speedIncrement = 0.03; 

    const fallInterval = setInterval(() => {
        let appleTop = parseInt(apple.style.top);
        apple.style.top = appleTop + speed + 'px';

        const basketRect = basket.getBoundingClientRect();
        const appleRect = apple.getBoundingClientRect();

        if (
            appleRect.bottom >= basketRect.top &&
            appleRect.left < basketRect.right &&
            appleRect.right > basketRect.left
        ) {
            score += isGolden ? 5 : 1;
            scoreBoard.textContent = score;
            apple.remove();
            clearInterval(fallInterval);
        }

        if (appleTop > applesContainer.offsetHeight) {
            apple.remove();
            clearInterval(fallInterval);
        }

        speed += speedIncrement;
    }, 20);
}

startBtn.addEventListener('click', startGame);












