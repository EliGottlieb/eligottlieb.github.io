function drawSquare(square, clr) {
  fill(clr);
  noStroke();
  rect(square.x, square.y, square.width, square.width);
}

function drawRect(x, y, w, h, clr) {
  fill(clr);
  noStroke();
  rect(x, y, w, h);
}

function drawSnake(sn) {
  drawSquare(sn.oldTail, color(255, 255, 255));
  drawOffset(sn.oldTail, sn.oldTailxDir, sn.oldTailyDir, color(255, 255, 255));
  drawSquare(sn.head, sn.color);
  drawOffset(sn.squares[sn.squares.length - 2], sn.xDir[sn.xDir.length - 2], sn.yDir[sn.yDir.length - 2], sn.color);
}

function drawSnakeComplete(sn) {
  // Draw Squares
  for (let i = 0; i < sn.squares.length; i++) {
    let tempsq = sn.squares[i];
    drawSquare(tempsq, sn.color);
  }
  // Fill offsets
  for (let i = 0; i < sn.squares.length - 1; i++) {
    drawOffset(sn.squares[i], sn.xDir[i], sn.yDir[i], sn.color);
  }
}

function drawOffset(sq, xDir, yDir, clr) {
  if (xDir != 0) {
    if (xDir == -1) {
      // This square going left
      drawRect(sq.x - xOffset, sq.y, xOffset, squareWidth, clr);
    } else {
      // This square going right
      drawRect(sq.x + squareWidth, sq.y, xOffset, squareWidth, clr);
    }
  } else {
    if (yDir == -1) {
      // This square going up
      drawRect(sq.x, sq.y - yOffset, squareWidth, yOffset, clr);
    } else {
      // This square going down
      drawRect(sq.x, sq.y + squareWidth, squareWidth, yOffset, clr);
    }
  }
}

function drawPlayAgainButton() {
  let playAgainRectWidth = 200;
  let playAgainRectHeight = 50;
  let playAgainx = (width - playAgainRectWidth) / 2;
  let playAgainy = (height - playAgainRectHeight) / 2;
  fill(color(255, 0, 0));
  stroke(0);
  strokeWeight(4);
  rect(playAgainx, playAgainy, playAgainRectWidth, playAgainRectHeight);
  textSize(32);
  fill(0);
  text('Play Again', playAgainx + 25, playAgainy + 35);
}

function windowResized() {
  document.getElementById("play").style.display = "none"
  document.getElementById("pause").style.display = "flex"
  let dimensions = calculateCanvasSize();
  resizeCanvas(dimensions.canvasWidth, dimensions.canvasHeight);
  background(255);
  drawSnakeComplete(realsnake);
  apple.square = apple.getRandomSquare();
  drawSquare(apple.square, color(255, 0, 0));
}