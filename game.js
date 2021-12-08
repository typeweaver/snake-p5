let direction = "up";
const frames = 60;
let gameTick = 0;
let difficulty = 10;
const fieldSize = [400, 400];
let snakeBody = [];
let applePos = [];
const gridSize = 20;

function moveSnake() {
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
    const isEaten = matchPosAppleSnake(applePos, [snakeBody[0]]);
    if (isEaten) {
        setNewApple();
    } else {
        snakeBody.pop();
    }
}

function drawSnake() {
    background("Black");
    fill("LimeGreen");
    for (const bodyPart of snakeBody) {
        square(bodyPart[0], bodyPart[1], gridSize);
    }
}

function drawApple() {
    fill("Red");
    square(applePos[0], applePos[1], gridSize);
}

function setNewApple() {
    let validPos = false;
    let newApplePos;
    do {
        const xCoord = Math.floor(Math.random() * fieldSize[0]);
        const yCoord = Math.floor(Math.random() * fieldSize[1]);
        newApplePos = [xCoord - (xCoord % gridSize), yCoord - (yCoord % gridSize)];
        validPos = !matchPosAppleSnake(newApplePos, snakeBody);
    } while (!validPos)
    applePos = newApplePos;
}

function matchPosAppleSnake(applePos, snakeBody) {
    const match = snakeBody.find(function (bodyPart) {
        return bodyPart[0] === applePos[0] && bodyPart[1] === applePos[1];
    });
    return Boolean(match);
}

function setup() {
    const width = Math.floor(fieldSize[0] - (fieldSize[0] % gridSize));
    const height = Math.floor(fieldSize[1] - (fieldSize[1] % gridSize));
    createCanvas(width, height);

    snakeBody = [[Math.floor(width / 2), Math.floor(height / 2)]];

    setNewApple();

    frameRate(frames);
}

function draw() {
    if (gameTick % difficulty === 0) {
        moveSnake();
        drawSnake();
        drawApple();
    }
    gameTick++;
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        direction = "up";
    } else if (keyCode === DOWN_ARROW) {
        direction = "down";
    } else if (keyCode === LEFT_ARROW) {
        direction = "left";
    } else if (keyCode === RIGHT_ARROW) {
        direction = "right";
    }
}