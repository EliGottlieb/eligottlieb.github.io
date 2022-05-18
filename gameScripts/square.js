// Square Class 
class Square {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
    }
    static copySquare(sqs) {
        return new Square (sqs.x, sqs.y, sqs.width)
    }
  }