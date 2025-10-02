const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreEl = document.getElementById('score');

let playerPosition = 175;
let missedCount = 0;
const maxMisses = 8;
let score = 0;

document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowLeft'&&playerPosition>0) {
        playerPosition -= 15;
    }else if(e.key === 'ArrowRight' && playerPosition < 350) {
        playerPosition += 15;
    }
    player.style.left = playerPosition + 'px'
});


// creating objects
function createFallingObjects() {
    let objectPosition = 0;
    const object = document.createElement('div')
    object.classList.add('falling-object');
    object.style.left = Math.random()*370 + 'px'
    object.style.top = "0px";
    gameContainer.appendChild(object);

    const objectInterval = setInterval(()=>{
        objectPosition += 5;
        object.style.top = objectPosition + 'px';

    const playerRect = player.getBoundingClientRect()
    const objectRect = object.getBoundingClientRect()

    if(
        objectRect.bottom >= playerRect.top &&
        objectRect.left <= playerRect.right &&
        objectRect.right >= playerRect.left
    ) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
        object.remove();
        clearInterval(objectInterval);
    }
    // chick if the object is missed
    if(objectPosition > 600){
        missedCount++;
        object.remove();
        clearInterval(objectInterval);
    }

    //check for game over
    if(missedCount >= maxMisses) {
     gameOver();   
    }
    }, 50);
}

function gameOver() {
    alert('Game over! You missed many objects');
    window.location.reload();
}
setInterval(createFallingObjects,1500);


















