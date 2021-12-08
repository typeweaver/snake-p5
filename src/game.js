const frames = 60;
const gridSize = 20;
const fieldSize = [innerWidth - gridSize, innerHeight - gridSize];
let gameTick = 0;
let difficulty = 10; // lower is harder
let direction = "up";
let snakeBody = [];
let applePos = [];
let score = 0;
let start;

function setup() {
    const width = fieldSize[0] - (fieldSize[0] % gridSize);
    const height = fieldSize[1] - (fieldSize[1] % gridSize);
    createCanvas(width, height);
    initNewGame();
    frameRate(frames);
}

function initNewGame() {
    start = false;
    snakeBody = [[(width / 2) - ((width / 2) % gridSize), (height / 2) - ((height / 2) % gridSize)]];
    setNewApple();
}

function keyPressed() {
    start = true;
    if (keyCode === UP_ARROW) {
        direction = "up";
    } else if (keyCode === DOWN_ARROW) {
        direction = "down";
    } else if (keyCode === LEFT_ARROW) {
        direction = "left";
    } else if (keyCode === RIGHT_ARROW) {
        direction = "right";
    } else if (keyCode === 27) {
        alert("Pause");
    }
}

function draw() {
    if (gameTick % difficulty === 0) {
        moveSnake();
        drawSnake();
        drawApple();
    }
    gameTick++;
}

function drawApple() {
    fill("Red");
    square(applePos[0], applePos[1], gridSize);
}

function drawSnake() {
    background("Black");
    fill("LimeGreen");
    for (const bodyPart of snakeBody) {
        square(bodyPart[0], bodyPart[1], gridSize);
    }
}

function setNewApple() {
    let validPos = false;
    let newApplePos;
    do {
        const xCoord = Math.random() * width;
        const yCoord = Math.random() * height;
        newApplePos = [xCoord - (xCoord % gridSize), yCoord - (yCoord % gridSize)];
        validPos = !collidingWithSnake([newApplePos], snakeBody);
    } while (!validPos)
    applePos = newApplePos;
}

function moveSnake() {
    if (start) {
        // pushing snake forward: add new first element regarding direction
        const currentFirstCoord = snakeBody[0];
        if (direction === "up") {
            snakeBody.unshift([currentFirstCoord[0], currentFirstCoord[1] - gridSize]);
        } else if (direction === "down") {
            snakeBody.unshift([currentFirstCoord[0], currentFirstCoord[1] + gridSize]);
        } else if (direction === "left") {
            snakeBody.unshift([currentFirstCoord[0] - gridSize, currentFirstCoord[1]]);
        } else {
            snakeBody.unshift([currentFirstCoord[0] + gridSize, currentFirstCoord[1]]);
        }

        // Check if snake eats apple with new pos
        const isEaten = collidingWithSnake([applePos], [snakeBody[0]]);
        if (isEaten) {
            setNewApple();
            score++;
        } else if (checkGameOver()) {
            alert("Gameover.. Score: " + score);
            initNewGame();
        } else {
            snakeBody.pop();
        }
    }
}

function collidingWithSnake(positionsToBeChecked, snakeBody) {
    for (const positionToBeChecked of positionsToBeChecked) {
        const colliding = snakeBody.find(function (bodyPart) {
            return bodyPart[0] === positionToBeChecked[0] && bodyPart[1] === positionToBeChecked[1];
        });
        if (colliding) return true;
    }
    return false;
}

function collidingWithBorders() {
    const posToBeChecked = snakeBody[0];
    return posToBeChecked[0] < 0 || posToBeChecked[1] < 0 || posToBeChecked[0] >= width || posToBeChecked[1] >= height;
}

function checkGameOver() {
    // snake is passing borders
    if (collidingWithBorders()) return true;
    // snake is colliding with itself
    return snakeBody.length > 2 && collidingWithSnake([snakeBody[0]], snakeBody.slice(1));
}