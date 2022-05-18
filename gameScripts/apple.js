
// Class Apple
class Apple {
    constructor() {
      this.square = this.getRandomSquare();
    }
    getRandomSquare() {
      let x = 0;
      let y = 0;
      do {
        let numSqauresx = Math.ceil(width / (squareWidth + xOffset));
        let xCoord = Math.floor(Math.random() * numSqauresx);
        let numSqauresy = Math.ceil(height / (squareWidth + yOffset));
        let yCoord = Math.floor(Math.random() * numSqauresy);
        x = xCoord * (squareWidth + xOffset);
        y = yCoord * (squareWidth + yOffset);
      } while(snakeContains(x, y));
      return new Square(x, y, squareWidth);
    }
}