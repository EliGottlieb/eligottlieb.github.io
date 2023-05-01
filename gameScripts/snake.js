// Snake Class
class Snake {
  constructor(x) {
    if (x = 0){
      this.squares = [
        /* new Square(x * squareWidth, y * squareWidth, squareWidth),
        new Square(x + xOffset + squareWidth, y, squareWidth),
        new Square(x + xOffset * 2 + squareWidth * 2, y, squareWidth) */
        new Square(300, 0, 20),
        new Square(325, 0, 20),
        new Square(350, 0, 20)
      ]
    }
    else if (x = 1) {
      this.squares = [
        new Square(0, 0, 20),
        new Square(25, 0, 20),
        new Square(50, 0, 20)
      ]
    }
    this.head = this.squares[this.squares.length - 1];
    this.oldTail = null;
    this.oldTailxDir = 0;
    this.oldTailyDir = 0;
    this.xDir = [1, 1, 1];
    this.yDir = [0, 0, 0];
    this.color = color(128, 80, 200)
    this.randomizeColor()
    this.count = 0;
    this.distance
  }

  randomizeColor() {
    let colors = [0, 0, 0]
    let firstColor = Math.floor(Math.random() * 3)
    colors[firstColor] = 255;
    let secondColor = (firstColor + 1) % 3
    colors[secondColor] = Math.floor(Math.random() * 256)
    this.color = color(colors[0], colors[1], colors[2])
  }

  // Return a deep copy of Snake sn
  static copy(sn) {
    let newsnake = new Snake()
    let tempsquares = []
    let tempsquare = new Square()
    for (let i = 0; i < sn.squares.length; i++) {
      tempsquare = new Square()
      tempsquare = Square.copySquare(sn.squares[i])
      tempsquares[i] = tempsquare
    }
    newsnake.squares = tempsquares
    newsnake.head = tempsquares[tempsquares.length - 1]
    if (sn.oldTail != null) {
      tempsquare = new Square()
      tempsquare = Square.copySquare(sn.oldTail)
      newsnake.oldTail = tempsquare;
    }
    else {
      newsnake.oldTail = null
    }
    newsnake.oldTailxDir = JSON.parse(JSON.stringify(sn.oldTailxDir));
    newsnake.oldTailyDir = JSON.parse(JSON.stringify(sn.oldTailyDir));
    newsnake.xDir = JSON.parse(JSON.stringify(sn.xDir));
    newsnake.yDir = JSON.parse(JSON.stringify(sn.yDir));
    newsnake.count = JSON.parse(JSON.stringify(sn.count));
    return newsnake
  }

  move() {
    // Update old tail
    // Make a deep copy
    let oldTail = this.squares[0];
    this.oldTail = new Square(oldTail.x, oldTail.y, oldTail.width);
    // Update all squares in array
    for (let i = 0; i < this.squares.length; i++) {
      let sq = this.squares[i];
      sq.x += this.xDir[i] * (xOffset + squareWidth);
      sq.y += this.yDir[i] * (yOffset + squareWidth);
    }
    // Update head
    this.head = this.squares[this.squares.length - 1];
    // Update directions
    this.oldTailxDir = this.xDir[0];
    this.oldTailyDir = this.yDir[0];
    for (let i = 0; i < this.xDir.length; i++) {
      if (i == this.xDir.length - 1) {
        continue;
      }
      this.xDir[i] = this.xDir[i + 1];
      this.yDir[i] = this.yDir[i + 1];
    }
  }
}
