let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 10; // Initial speed value
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let volume = 0.5; // Initial volume value

const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
const soundRange = document.getElementById('soundRange');
const soundValue = document.getElementById('soundValue');
const soundControl = document.getElementById('soundControl');
const soundSettings = document.getElementById('soundSettings');
const soundButton = document.getElementById('soundButton');

function updateSpeedBar() {
    speedValue.textContent = speed;
}

function updateSoundBar() {
    soundValue.textContent = soundRange.value;
}

function updateSound() {
    foodSound.volume = volume;
    gameOverSound.volume = volume;
    moveSound.volume = volume;
    musicSound.volume = volume;
}

function toggleSoundControls() {
    soundSettings.classList.toggle('hidden');
}

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Check if snake collides with itself or walls
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array and food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.currentTime = 0; // Reset music to start
        musicSound.play();
        score = 0;
        speedRange.disabled = false; // Re-enable speed control
        soundRange.disabled = false; // Re-enable sound control
        return;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        document.getElementById('scoreBox').innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    const board = document.getElementById('board');
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
musicSound.play();
let hiscore = localStorage.getItem("hiscoreBox");
let hiscoreval;
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
}

document.getElementById('hiscoreBox').innerHTML = "HiScore: " + hiscoreval;

window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    if (!inputDir.x && !inputDir.y) {
        speedRange.disabled = true; // Disable speed control once the game starts
        soundRange.disabled = true; // Disable sound control once the game starts
    }

    inputDir = { x: 0, y: 1 }; // Start the game by moving down initially
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});

speedRange.addEventListener('input', (e) => {
    if (!inputDir.x && !inputDir.y) {
        speed = e.target.value;
        updateSpeedBar();
    }
});

soundRange.addEventListener('input', (e) => {
    volume = e.target.value / 100;
    updateSoundBar();
    updateSound();
});

soundButton.addEventListener('click', toggleSoundControls);

// Initialize speed and sound displays
updateSpeedBar();
updateSoundBar();
updateSound();
