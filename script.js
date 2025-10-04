const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreEl = document.getElementById('score');
const startButton = document.getElementById('start-game');
const stopButton = document.getElementById('stop-game');

let playerPosition = 175;
let missedCount = 0;
const maxMisses = 8;
let score = 0;
let fallingInterval = null;


// move players with arrow keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= 15;
    } else if (e.key === 'ArrowRight' && playerPosition < 350) {
        playerPosition += 15;
    }
    player.style.left = playerPosition + 'px';
});

// creating the falling objects
function createFallingObjects(){
    let objectPosition = 0;
    const object = document.createElement('div');
    object.classList.add('falling-object');
    object.style.left = Math.random()*370+'px';
    gameContainer.appendChild(object);

    const objectInterval = setInterval(()=>{
        objectPosition +=5;
        object.style.top = objectPosition + 'px';

        const playerRect = player.getBoundingClientRect();
        const objectRect = object.getBoundingClientRect();

        // collision detection
        if (
            objectRect.bottom >= playerRect.top &&
            objectRect.left <= playerRect.right &&
            objectRect.right >= playerRect.left
        ) {
            score++;
            scoreEl.textContent = `Score: ${score}`;
            object.remove();
            clearInterval(objectInterval);
        }

        if (objectPosition > 600) {
            missedCount++;
            object.remove();
            clearInterval(objectInterval);
        }

        if (missedCount >= maxMisses) {
            gameOver();
            clearInterval(objectInterval);
        }
    }, 30);
}

// start game
function startGame() {
    score = 0;
    missedCount = 0;
    scoreEl.innerHTML = "Score: " + score;

    if (fallingInterval !== null) {
        clearInterval(fallingInterval);
    }

    fallingInterval = setInterval(createFallingObjects, 1500);
}

// stop game
function stopGame() {
    if (fallingInterval !== null) {
        clearInterval(fallingInterval);
        fallingInterval = null;
    }
    alert("Game stopped!");
}

// game over function
function gameOver() {
    if (fallingInterval !== null) {
        clearInterval(fallingInterval);
        fallingInterval = null;
    }
    alert("GameOver! Your score: " + score);
}

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);













