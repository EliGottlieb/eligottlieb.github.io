

onmessage = function (e) {
    //console.log(e.data)
    let info = e.data;
    class Queue {
        constructor() {
            this.elements = {};
            this.head = 0;
            this.tail = 0;
        }
        enqueue(element) {
            this.elements[this.tail] = element;
            this.tail++;
        }
        dequeue() {
            const item = this.elements[this.head];
            delete this.elements[this.head];
            this.head++;
            return item;
        }
        peek() {
            return this.elements[this.head];
        }
        length() {
            return this.tail - this.head;
        }
        isEmpty() {
            return this.length === 0;
        }
    } 
    class Square {
        constructor(x, y, width) {
            this.x = x;
            this.y = y;
            this.width = width;
        }
        static copySquare(sqs) {
            return new Square(sqs.x, sqs.y, sqs.width)
        }
        Equals(sq) {
            return (sq.x == this.x && sq.y == this.y && sq.width == this.width)
        }
        toString() {
            return "" + this.x + this.y + this.width
        }
    }
    //console.log(e.data)
    let sn = info.snake;
    let xOffset = info.xOffset;
    let yOffset = info.yOffset
    let squareWidth = info.squareWidth
    let canvasHeight = info.canvasHeight
    let canvasWidth = info.canvasWidth

    let q = new Queue();
    q.enqueue(sn.head);

    // Space to the next square in the x and y direction
    let oneHorizontalTile = xOffset + squareWidth;
    let oneVerticalTile = yOffset + squareWidth;

    // Set to hold all available squares
    let availableSquaresSet = new Set();
    while (q.tail - q.head != 0) {
        let current = q.dequeue();
        let alreadyVisited = false;
        alreadyVisited = availableSquaresSet.has(current.toString())
        if (alreadyVisited) {
            //console.log("Current has already been looked at")
            continue;
        }
        if (checkCollisionsForBFS(sn, current, canvasHeight, canvasWidth)) {
            //console.log("Danger")
            continue;
        }
        availableSquaresSet.add(current.toString());
        // sn.squares.length
        if (availableSquaresSet.size >= sn.squares.length) {
            postMessage(true)
            return true;
        }
        let leftSquare = new Square(current.x - oneHorizontalTile, current.y, squareWidth);

        q.enqueue(leftSquare);
        let upSquare = new Square(current.x, current.y - oneVerticalTile, squareWidth);
        q.enqueue(upSquare);
        let rightSquare = new Square(current.x + oneHorizontalTile, current.y, squareWidth);
        q.enqueue(rightSquare);
        let downSquare = new Square(current.x, current.y + oneVerticalTile, squareWidth);
        q.enqueue(downSquare);
    }
    postMessage(true)
    return false;
}
/* onmessage = (e) => {
    let sn = e.data[0];
    let xOffset = e.data[1];
    let yOffset = e.data[2]
    let squareWidth = e.data[3];
    let q = new Queue();
    q.enqueue(sn.head);

    // Space to the next square in the x and y direction
    let oneHorizontalTile = xOffset + squareWidth;
    let oneVerticalTile = yOffset + squareWidth;

    // Set to hold all available squares
    let availableSquaresSet = new Set();
    while (q.tail - q.head != 0) {
        let current = q.dequeue();
        let alreadyVisited = false;
        alreadyVisited = availableSquaresSet.has(current.toString())
        if (alreadyVisited) {
            //console.log("Current has already been looked at")
            continue;
        }
        if (checkCollisionsForBFS(sn, current)) {
            //console.log("Danger")
            continue;
        }
        availableSquaresSet.add(current.toString());
        // sn.squares.length
        if (availableSquaresSet.size >= (((canvasHeight * canvasWidth) / squareWidth) - sn.squares.length) / 10) {
            postMessage(true)
            return true;
        }
        let leftSquare = new Square(current.x - oneHorizontalTile, current.y, squareWidth);

        q.enqueue(leftSquare);
        let upSquare = new Square(current.x, current.y - oneVerticalTile, squareWidth);
        q.enqueue(upSquare);
        let rightSquare = new Square(current.x + oneHorizontalTile, current.y, squareWidth);
        q.enqueue(rightSquare);
        let downSquare = new Square(current.x, current.y + oneVerticalTile, squareWidth);
        q.enqueue(downSquare);
    }
    postMessage(true)
    return false; 
}*/
function checkCollisionsForBFS(sn, sq, canvasHeight, canvasWidth) {
    // Define wall collisions
    let hitRightWall = (sq.x >= canvasWidth)
    let hitLeftWall = (sq.x < 0)
    let hitBottomWall = (sq.y >= canvasHeight);
    let hitTopWall = (sq.y < 0);
  
    // Define snake collisions
    let hittingSelf = false;
    for (let i = 0; i < sn.squares.length - 1; i++) {
      let tempsq = sn.squares[i];
      if ((tempsq.x == sq.x) && (tempsq.y == sq.y)) {
        hittingSelf = true;
        break;
      }
    }
    if (hitRightWall || hitLeftWall || hitBottomWall || hitTopWall || hittingSelf) {
      return true;
    }
    return false;
  }