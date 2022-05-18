var squareWidth = 20;
var xOffset = 5;
var yOffset = 5;
var fr;
var realsnake;
var apple;
var gameOver = false;
var inputUsed = false;
var userInput = false;
var isDrawBrain = true;
var score = 0;
var userhighscore = 0;
var genCount = 1;
var randomize_slider;
var speed_slider;

var appleReward = 10
var deathReward = -10
var safeReward = 0
var training = 0;
var sets = 0;
var hiddenLayerSize;
var qlearner;


///////////////// Util Functions /////////////////////
function checkCollisions(sn) {
  let gO = false;
  let xtile = (squareWidth + xOffset);
  let ytile = (squareWidth + yOffset);
  // Define collisions
  let hitRightWall = ((sn.head.x + squareWidth + xtile > width) && (sn.xDir[sn.xDir.length - 1] == 1))
  let hitLeftWall = ((sn.head.x - xtile < 0) && (sn.xDir[sn.xDir.length - 1] == -1))
  let hitBottomWall = ((sn.head.y + squareWidth + ytile > height) && (sn.yDir[sn.yDir.length - 1] == 1))
  let hitTopWall = ((sn.head.y - ytile < 0) && (sn.yDir[sn.yDir.length - 1] == -1))
  let hittingSelf = false;
  for (let i = 0; i < sn.squares.length - 1; i++) {
    let tempsq = sn.squares[i];
    if ((tempsq.x == sn.head.x) && (tempsq.y == sn.head.y)) {
      hittingSelf = true;
      break;
    }
  }
  if (hitRightWall || hitLeftWall || hitBottomWall || hitTopWall || hittingSelf) {
    gO = true;
  }
  gameOver = gO
}

function checkEatingApple(sn, sim) {
  if ((sn.head.x == apple.square.x) && (sn.head.y == apple.square.y)) {
    if (sim) {
      return true;
    }
    sn.squares.unshift(new Square(sn.oldTail.x, sn.oldTail.y, squareWidth))
    sn.xDir.unshift(sn.oldTailxDir);
    sn.yDir.unshift(sn.oldTailyDir);
    apple.square = apple.getRandomSquare();
    drawSquare(apple.square, color(255, 0, 0));
    score++;
    document.getElementById("score-counter").innerText = score;
    if (userInput) {
      if (score > highscore) {
        highscore = score
        document.getElementById("highscore").innerText = score;
      }
    }
    if (score > parseInt(window.localStorage.getItem("highscore"))) {
      window.localStorage.setItem("highscore", score)
      document.getElementById("highscore").innerText = score;
    }
    return true;
  }
  return false;
}

function calculateCanvasSize() {
  // Extra width and height will be split automatically when canvas is centered
  let extraWidth = (window.innerWidth % (xOffset + squareWidth)) + xOffset;
  let canvasWidth = window.innerWidth - extraWidth;
  let extraHeightBuffer = 3 * (squareWidth + yOffset);
  let extraHeight = (window.innerHeight % (yOffset + squareWidth)) + yOffset + extraHeightBuffer;
  let canvasHeight = window.innerHeight - extraHeight;
  return { canvasWidth, canvasHeight };
}

function snakeContains(x, y) {
  for (let i = 0; i < realsnake.squares.length; i++) {
    let tempsq = realsnake.squares[i];
    if (tempsq.x == x && tempsq.y == y) return true;
  }
  return false;
}

function goUp(sn) {
  sn.xDir[sn.xDir.length - 1] = 0;
  sn.yDir[sn.yDir.length - 1] = -1;
}
function goDown(sn) {
  sn.xDir[sn.xDir.length - 1] = 0;
  sn.yDir[sn.yDir.length - 1] = 1;
}
function goLeft(sn) {
  sn.xDir[sn.xDir.length - 1] = -1;
  sn.yDir[sn.yDir.length - 1] = 0;
}
function goRight(sn) {
  sn.xDir[sn.xDir.length - 1] = 1;
  sn.yDir[sn.yDir.length - 1] = 0;
}
function doAction(action, sn) {
  switch (action) {
    case 'up':
      goUp(sn);
      break;
    case 'down':
      goDown(sn);
      break;
    case 'left':
      goLeft(sn);
      break;
    case 'right':
      goRight(sn);
      break;
  }
}

function onRightEdge() {
  if (realsnake.head.x + squareWidth >= width) return true;
  else return false;
}

function onBottomEdge() {
  if (realsnake.head.y + squareWidth >= height) return true;
  else return false;
}
///////////////// End Util Functions /////////////////////////////////////////

//////////////// P5 Functions /////////////////////////////////////////////////
function setup() {
  // Setup for buttons and sliders
  document.getElementById("jimmybrain").style.display = "none"
  setButtons()
  createSliders()

  if (userInput) {
    highscore = 0;
    document.getElementById("highscore").innerText = highscore
    slider_div.style("display", "none")
    document.getElementById("jimmyinfo").style.display = "none"
    frameRate(30)
    framerate = 30;
  }
  else {
    // Set headers from storage
    hiddenLayerSize = hls_slider.value()
    document.getElementById("jimmyinfo").style.display = "flex"
    document.getElementById("highscore").innerText = parseInt(window.localStorage.getItem("highscore"))
    document.getElementById("set-counter").innerText = "- Sets: " + parseInt(window.localStorage.getItem("sets"))
    document.getElementById("training-counter").innerText = "- Training: " + parseInt(window.localStorage.getItem("training"))

    // Create qlearner and set brain to brain informaiton saved in storage
    qlearner = new QLearner(realsnake, apple);
    downloadBrain()
  }
  
  // Create canvas
  let dimensions = calculateCanvasSize();
  createCanvas(dimensions.canvasWidth, dimensions.canvasHeight);
  restartGame();
}

function draw() {
  if (!userInput) {
    // Prepare for simulation, read sliders
    if(hls_slider.value() != hiddenLayerSize) {
      hiddenLayerSize = hls_slider.value()
      resetJimmy()
    }
    let oldState = qlearner.getCurrentState();;
    let oldStateArray= oldState.toArray()
    let bestaction = null;
    framerate = framerate_slider.value()
    frameRate(framerate)
    qlearner.randomize = randomize_slider.value()

    // Initialize sim information
    var actionList = ['up', 'down', 'left', 'right']
    var rewardList = [safeReward, safeReward, safeReward, safeReward]
    var newstates = [0, 0, 0, 0]
    var dones = [false, false, false, false]
    var savedsnake;

    for (let i = 0; i < actionList.length; i++) {
      // Reassign the "active" snake as the reset savedsnake
      savedsnake = Snake.copy(realsnake)
      qlearner.snake = savedsnake

      // Perform the action
      doAction(actionList[i], savedsnake)

      // checkEatingApple but with the sim parameter as true as to not move the apple
      if (checkEatingApple(savedsnake, true)) {
        rewardList[i] = appleReward
      }

      // Check is the simulated move results in a death
      if (actionList[i] == 'up' && oldStateArray[0] == 1) {
        rewardList[i] = deathReward
      }
      else if (actionList[i] == 'down' && oldStateArray[1] == 1) {
        rewardList[i] = deathReward
      }
      else if (actionList[i] == 'left' && oldStateArray[2] == 1) {
        rewardList[i] = deathReward
      }
      else if (actionList[i] == 'right' && oldStateArray[3] == 1) {
        rewardList[i] = deathReward
      }

      if(rewardList[i] == deathReward) {
        dones[i] = true;
      }

      // Move savedsnake based on the action in order to calculate distance
      savedsnake.move()
      newstates[i] = qlearner.getCurrentState()
      let distanceIndex = 12;
      if (newstates[i].toArray()[distanceIndex] < oldState.toArray()[distanceIndex]) {
        rewardList[i]++;
      }
    }

    // Reset qlearner's snake to realsnake 
    qlearner.snake = realsnake

    // Get best action and do the action
    bestaction = qlearner.bestAction(oldState);
    doAction(bestaction, realsnake);
    qlearner.updateBrain(oldState, newstates, rewardList, dones);

    // Check apple and collisions
    checkEatingApple(realsnake, false)
    checkCollisions(realsnake, false)
    if (gameOver) {
      genCount++;
      restartGame();
      return;
    }

    // Update the game
    realsnake.move();
    drawSnake();
    inputUsed = false;
  }
  else {
    // Check if eating apple
    checkEatingApple(realsnake, false)

    // Check for collisions
    checkCollisions(realsnake, false)
    if (gameOver) {
      drawPlayAgainButton();
      return;
    }

    // Update the game
    realsnake.move()
    drawSnake();
    inputUsed = false;
  }
}

function restartGame() {
  // Reset snake and apple
  realsnake = new Snake();
  apple = new Apple();

  if (!userInput) {
    savedsnake = new Snake();
    // Re-save snake and apple
    qlearner.snake = realsnake;
    qlearner.apple = apple;

    // Update generation counter in storage and HTML element
    let globalgencount = parseInt(window.localStorage.getItem("age"))
    globalgencount++;
    window.localStorage.setItem("age", globalgencount)
    document.getElementById("generation-counter").innerText = "Jimmy's: " + globalgencount;

    // Upload brain to save learning progress
    uploadBrain()
  }

  // Reset score to 0 and redraw 
  resetscore = 0;
  score = resetscore
  document.getElementById("score-counter").innerText = resetscore;
  background(255);
  drawSnakeComplete();
  drawSquare(apple.square, color(255, 0, 0));
  gameOver = false;
}

function keyPressed() {
  if (!userInput || gameOver) return;
  switch (keyCode) {
    case UP_ARROW:
      if ((realsnake.yDir[realsnake.yDir.length - 1] != 0) || inputUsed) break;
      goUp(realsnake);
      inputUsed = true;
      break;
    case DOWN_ARROW:
      if ((realsnake.yDir[realsnake.yDir.length - 1] != 0) || inputUsed) break;
      goDown(realsnake);
      inputUsed = true;
      break;
    case LEFT_ARROW:
      if ((realsnake.xDir[realsnake.xDir.length - 1] != 0) || inputUsed) break;
      goLeft(realsnake);
      inputUsed = true;
      break;
    case RIGHT_ARROW:
      if ((realsnake.xDir[realsnake.xDir.length - 1] != 0) || inputUsed) break;
      goRight(realsnake);
      inputUsed = true;
      break;
  }
}

function mouseReleased() {
  if (gameOver) {
    let playAgainRectWidth = 200;
    let playAgainRectHeight = 50;
    let playAgainx = (width - playAgainRectWidth) / 2;
    let playAgainy = (height - playAgainRectHeight) / 2;
    if ((mouseX >= playAgainx) && (mouseX <= (playAgainx + playAgainRectWidth)) &&
      (mouseY >= playAgainy) && (mouseY <= (playAgainy + playAgainRectHeight))) {
      restartGame();
    }
  }
}
///////////////////////// End P5 Functions ///////////////////////////