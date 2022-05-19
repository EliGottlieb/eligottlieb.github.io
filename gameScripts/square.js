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
    Equals(sq) {
        return(sq.x == this.x && sq.y == this.y && sq.width == this.width)
    }
    toString() {
        return "" + this.x + this.y + this.width
    }
  }