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
onmessage = (e) => {
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
}