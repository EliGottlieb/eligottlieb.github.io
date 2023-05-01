let qLearningRate = 0.9;
let qDiscountFactor = 0.85;

class QLearner {
    constructor(x, apple) {
        this.brain = new Network(inputLayerSize, hiddenLayerSize, hiddenLayerSize, 4);
        this.targetbrain = this.brain
        this.snake = new Snake(x);
        this.apple = apple;
        this.availableActions = ['up', 'down', 'left', 'right'];
        this.experienceRelay = {};
        this.states = {};
        this.randomize = 1;
        this.moves = 0;
    }

    getCurrentState(opponent) {
        // Get direction of snake
        let xDir = this.snake.xDir[this.snake.xDir.length - 1];
        let yDir = this.snake.yDir[this.snake.yDir.length - 1];
        let directionStates = []
        if (xDir != 0) {
            if (xDir == 1) {
                // Snake going right
                directionStates = [0, 0, 0, 1];
            } else {
                // Snake going left
                directionStates = [0, 0, 1, 0];
            }
        } else {
            if (yDir == 1) {
                // Snake going down
                directionStates = [0, 1, 0, 0];
            } else {
                // Snake going up
                directionStates = [1, 0, 0, 0];
            }
        }

        // Get position of fruit relative to head
        var head = this.snake.head;
        var food = this.apple.square;
        var foodLeft = 0;
        var foodRight = 0;
        var foodUp = 0;
        var foodDown = 0;
        if (food.x < head.x) {
            foodLeft = 1;
        } else if (food.x > head.x) {
            foodRight = 1;
        }
        if (food.y < head.y) {
            foodUp = 1;
        } else if (food.y > head.y) {
            foodDown = 1;
        }

        // Get distance to apple from head
        this.snake.distance = Math.sqrt(Math.pow(food.x - head.x, 2) + Math.pow(food.y - head.y, 2))
        let foodStates = [foodUp, foodDown, foodLeft, foodRight];

        // Get danger to snake
        var dangerUp = 0;
        var dangerDown = 0;
        var dangerLeft = 0;
        var dangerRight = 0;

        // Check near walls
        if (head.x == 0) dangerLeft = 1;
        if (head.y == 0) dangerUp = 1;
        if (onRightEdge(this.snake)) dangerRight = 1;
        if (onBottomEdge(this.snake)) dangerDown = 1;

        // Check near snake
        if (opponent != null)
            for (let i = 0; i < opponent.squares.length; i++) {
                dist =  Math.abs(head.x - opponent.squares[i].x) + Math.abs(head.y - opponent.squares[i].y)
                if (dist > 1)
                    continue;
                elseif (head.x - opponent.squares[i].x == 1)
                    dangerLeft = 1;
                elseif (head.x - opponent.squares[i].x == -1)
                    dangerRight = 1;
                elseif (head.y - opponent.squares[i].y == 1)
                    dangerUp = 1;
                elseif (head.y - opponent.squares[i].y == -1)
                    dangerDown = 1;
            }

        // Check near itself
        for (let i = 0; i < this.snake.squares.length; i++) {
            let squ = this.snake.squares[i]
            if (((head.x - squareWidth - xOffset) == squ.x) && (head.y == squ.y)) {
                dangerLeft = 1;
            }
            if (((head.x + squareWidth + xOffset) == squ.x) && (head.y == squ.y)) {
                dangerRight = 1;
            }
            if (((head.y + squareWidth + yOffset) == squ.y) && (head.x == squ.x)) {
                dangerDown = 1;
            }
            if (((head.y - squareWidth - yOffset) == squ.y) && (head.x == squ.x)) {
                dangerUp = 1;
            }
        }
        let dangerStates = [dangerUp, dangerDown, dangerLeft, dangerRight];
        let trappedState = [0,0,0,0]
        return new State(dangerStates, directionStates, foodStates, trappedState);
    }

    bestAction(state) {
        this.moves++;
        // Forbid the snake from turning around while using random motion
        let badActionIndex;
        let availableActions = []
        if (state.directionStates[0] == 1) {
            badActionIndex = 1;
        } else if (state.directionStates[1] == 1) {
            badActionIndex = 0;
        } else if (state.directionStates[2] == 1) {
            badActionIndex = 3;
        } else if (state.directionStates[3] == 1) {
            badActionIndex = 2;
        }
        for (let i = 0; i < this.availableActions.length; i++) {
            if (i == badActionIndex) continue;
            availableActions.push(this.availableActions[i]);
        }
        // End forbidding junky code

        // Choose a random direction sometimes
        if (Math.random() < this.randomize) {
            let random = Math.floor(Math.random() * (availableActions.length + 1));
            return availableActions[random];
        }

        // Get outputs of the Network and find the chosen action
        let outputs = this.brain.predict(state.toArray())
        var m = outputs[0]
        var index = 0;
        for (let i = 1; i < outputs.length; i++) {
            if (outputs[i] > m) {
                index = i
                m = outputs[i]
            }
        }
        if (index == 0) {
            return 'up'
        }
        if (index == 1) {
            return 'down'
        }
        if (index == 2) {
            return 'left'
        }
        return 'right'
    }

    updateBrain(state0, futurestates, futurerewards, dones) {
        // state0 is current state, the rest of the arrays corresponding to 'up', 'down', 'left', 'right' indecies respectively
        let newQs = []

        // Calculate q values for each batch of new state, reward, and done values
        for (let i = 0; i < futurestates.length; i++) {
            let newValue;
            if (dones[i]) {
                newValue = futurerewards[i];
                newQs.push(sigmoid(futurerewards[i]))
            } else {
                newValue = futurerewards[i] + qDiscountFactor * max(this.brain.predict(futurestates[i].toArray())) - max(this.brain.predict(state0.toArray()));
                newQs.push(sigmoid(max(this.brain.predict(state0.toArray())) + qLearningRate * newValue));
            }
            
        }

        // Now that we have q values for each move off of the current state, store them in memory
        let stateString = state0.toString()
        this.states[stateString] = state0
        let entry = this.experienceRelay[stateString]
        if (entry != null) {
            for (let i = 0; i < entry.length; i++) {
                if (entry[i] != 0)
                    entry[i] = (entry[i] + newQs[i]) / 2.0
                else
                    entry[i] = newQs[i]
            }
            this.experienceRelay[stateString] = entry
        }
        else {
            entry = newQs
            this.experienceRelay[stateString] = entry
        }

        // Check to see if the network should train, 60 unique states saved or 250 moves since last train
        if (Object.keys(this.experienceRelay).length > 60 || this.moves > 250) {
            // Update global set counter
            let globaltrainingcount = parseInt(window.localStorage.getItem("training"))
            globaltrainingcount += Object.keys(this.experienceRelay).length
            document.getElementById("training-counter").innerText = " Trained: " + globaltrainingcount;
            window.localStorage.setItem("training", globaltrainingcount)
            
            // Update global training counter
            let globalsetcount = parseInt(window.localStorage.getItem("sets"))
            globalsetcount++;
            document.getElementById("set-counter").innerText = " Sets: " + globalsetcount;
            window.localStorage.setItem("sets", globalsetcount)
            
            // Train network on each pair of state and qVals
            for (let i = 0; i < Object.keys(this.experienceRelay).length; i++) {
                let tempkey = Object.keys(this.experienceRelay)[i]
                let tempstate = this.states[tempkey].toArray()
                let qvals = this.experienceRelay[tempkey]
                this.brain.train(tempstate, qvals)
            }

            this.snake.randomizeColor()

            // Reset memory
            this.experienceRelay = {}
            this.moves = 0;
        }
    }

    max(arr) {
        let max = arr[0]
        for (let i = 1; i < arr.length; i++) {
            if (max < arr[i]) {
                max = arr[i]
            }
        }
        return max
    }
}

class State {
    constructor(dangerStates, directionStates, foodStates, trappedState) {
        this.dangerStates = dangerStates;
        this.directionStates = directionStates;
        this.foodStates = foodStates;
        this.trappedState = trappedState
    }
    toArray() {
        let arr = []
        for (let i = 0; i < this.dangerStates.length; i++) {
            arr.push(this.dangerStates[i])
        }
        for (let i = 0; i < this.directionStates.length; i++) {
            arr.push(this.directionStates[i])
        }
        for (let i = 0; i < this.foodStates.length; i++) {
            arr.push(this.foodStates[i])
        }
        for (let i = 0; i < this.trappedState.length; i++) {
            arr.push(this.trappedState[i])
        }
        return arr
    }
    toString() {
        let state = ""
        for (let i = 0; i < this.dangerStates.length; i++) {
            state += this.dangerStates[i] + ","
        }
        for (let i = 0; i < this.directionStates.length; i++) {
            state += this.directionStates[i] + ","
        }
        for (let i = 0; i < this.foodStates.length; i++) {
            state += this.foodStates[i] + ","
        }
        for (let i = 0; i < this.trappedState.length; i++) {
            state += this.trappedState[i] + ","
        }
        return state;
    }
}