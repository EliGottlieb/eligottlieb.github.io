const s = (p) => {
    let canvasWidth = 720
    let canvaseLength = 400


    function drawBrain() {
        // Hold neuron objects
        input_neurons = []
        h1_neurons = []
        h2_neurons = []
        output_neurons = []

        // Hold connection objects
        input_h1_connections = []
        h1_h2_connections = []
        h2_output_connections = []

        // The space between rows, columns, and the diameter of nodes
        let rowGap = 4
        let colGap = 170
        let diameter = 16

        // The starting x, y, and vertical label distance
        let inputX = 120
        let inputY = 50
        let labelY = 30

        // Label the input node column
        p.textStyle(BOLD);
        p.strokeWeight(0.3)
        p.stroke(10)
        p.fill(0)
        let inputLabel = "Input Nodes"
        p.text(inputLabel, inputX - (p.textWidth(inputLabel) / 2), labelY)
        p.stroke(10)

        // Prepare labels for the input node rows
        let inputlabels = ["Danger Up", "Danger Down", "Danger Left", "Danger Right", "Facing Up", "Facing Down", "Facing Left", "Facing Right", "Food Up", "Food Down", "Food Left", "Food Right", "Trapped Up", "Trapped Down", "Trapped Left", "Trapped Right"]

        // Draw the input nodes and create the labels
        var x = inputX
        var y = inputY
        let mid;
        for (let i = 0; i < qlearner.brain.input_nodes; i++) {
            if (qlearner.brain.input_nodes / 2 == i) {
                mid = y - ((diameter / 2) + (rowGap / 2))
            }
            else if (Math.floor(qlearner.brain.input_nodes / 2) == i) {
                mid = y
            }
            p.strokeWeight(1)
            let temp = new Neuron(x, y, diameter)
            temp.display()
            input_neurons.push(temp)
            p.fill(0)
            p.strokeWeight(0.3)
            p.text(inputlabels[i], x - (textWidth(inputlabels[i] + diameter/2)), y + 4);
            y += (diameter + rowGap)
        }

        // Get display info for hidden layers [diameter, circleGap]
        let yDif = ((qlearner.brain.input_nodes - 1) * diameter + (qlearner.brain.input_nodes - 1) * rowGap)
        let hiddenDisplayInfo = getHiddenDisplayInfo(yDif, qlearner.brain.hidden_nodes_1, (1.0 * rowGap / diameter), diameter)
        let hiddenDiameter = hiddenDisplayInfo[0]
        let hiddenRowGap = hiddenDisplayInfo[1]
        let hiddenY = mid
        let shift
        if (qlearner.brain.hidden_nodes_1 % 2 == 0) {
            shift = ((qlearner.brain.hidden_nodes_1 / 2) - 1) * hiddenRowGap + 0.5 * hiddenRowGap + ((qlearner.brain.hidden_nodes_1 / 2) - 1) * hiddenDiameter + 0.5 * hiddenDiameter
        }
        else {
            shift = (Math.floor(qlearner.brain.hidden_nodes_1 / 2) * hiddenDiameter) + (Math.floor(qlearner.brain.hidden_nodes_1 / 2) * hiddenRowGap)
        }
        hiddenY -= shift
        hiddenY = Math.max(inputY, hiddenY)

        // Shift the x over, and label the hidden layer 1 node column
        x += colGap
        y = hiddenY
        let bias_h1 = qlearner.brain.bias_h1.toArray()
        let h1label = "Hidden Layer 1"
        p.fill(0)
        p.stroke(10)
        p.text(h1label, x - (p.textWidth(h1label) / 2), labelY)
        p.strokeWeight(1)

        // Draw the hidden layer 1 nodes and fill in with biases
        for (let i = 0; i < qlearner.brain.hidden_nodes_1; i++) {
            let temp = new Neuron(x, y, hiddenDiameter, bias_h1[i])
            temp.display()
            h1_neurons.push(temp)
            y += (hiddenDiameter + hiddenRowGap)
        }

        // Draw lines between each input node and all h1 nodes and color with weights
        for (let i = 0; i < h1_neurons.length; i++) {
            let weightsArray = qlearner.brain.weights_input_h1.data[i]
            for (let j = 0; j < input_neurons.length; j++) {
                let temp = new Connection(input_neurons[j], h1_neurons[i], weightsArray[j])
                temp.display()
                input_h1_connections.push(temp)
            }
        }

        // Shift the x over, and label the hidden layer 2 node column
        x += colGap
        y = hiddenY
        let bias_h2 = qlearner.brain.bias_h2.toArray()
        let h2label = "Hidden Layer 2"
        p.fill(0)
        p.strokeWeight(0.3)
        p.stroke(10)
        p.text(h2label, x - textWidth(h2label) / 2, labelY)
        p.strokeWeight(1)
        // Draw the hidden layer 1 nodes and fill in with biases
        for (let i = 0; i < qlearner.brain.hidden_nodes_2; i++) {
            let temp = new Neuron(x, y, hiddenDiameter, bias_h2[i])
            temp.display()
            h2_neurons.push(temp)
            y += (hiddenDiameter + hiddenRowGap)
        }

        // Draw lines between each h1 node and all h2 nodes and color with weights
        for (let i = 0; i < h2_neurons.length; i++) {
            let weightsArray = qlearner.brain.weights_h1_h2.data[i]
            for (let j = 0; j < h1_neurons.length; j++) {
                let temp = new Connection(h1_neurons[j], h2_neurons[i], weightsArray[j])
                temp.display()
                h1_h2_connections.push(temp)
            }
        }

        // Shift the x over, and label the output node column
        x += colGap
        y = mid
        if (qlearner.brain.output_nodes % 2 == 0) {
            let shift = ((qlearner.brain.output_nodes / 2) - 1) * rowGap + 0.5 * rowGap + ((qlearner.brain.output_nodes / 2) - 1) * diameter + 0.5 * diameter
            y -= shift
        }

        let bias_output = qlearner.brain.bias_output.toArray()
        let outputlabel = "Output Nodes"
        p.fill(0)
        p.stroke(10)
        p.strokeWeight(0.3)
        p.text(outputlabel, x - textWidth(outputlabel) / 2, labelY)

        // Prepare labels for the output row nodes
        let outputlabels = ["Up", "Down", "Left", "Right"]

        // Draw the output layer nodes and fill in with biases
        for (let i = 0; i < qlearner.brain.output_nodes; i++) {
            p.fill(0)
            p.stroke(10)
            p.strokeWeight(0.3)
            p.text(outputlabels[i], x + diameter, y + 3);
            let temp = new Neuron(x, y, diameter, bias_output[i])
            p.strokeWeight(1)
            temp.display()
            output_neurons.push(temp)
            y += (diameter + rowGap)
        }

        // Draw lines between each h2 node and all output nodes and color with weights
        for (let i = 0; i < output_neurons.length; i++) {
            let weightsArray = qlearner.brain.weights_h2_output.data[i]
            for (let j = 0; j < h2_neurons.length; j++) {
                let temp = new Connection(h2_neurons[j], output_neurons[i], weightsArray[j])
                temp.display()
                h2_output_connections.push(temp)
            }
        }
    }

    function drawKey() {
        p.fill(0)
        p.strokeWeight(0.3)
        p.stroke(150)
        let x = canvasWidth - 225
        let y = canvaseLength - 60
        let wordVerticalSpacing = 14
        p.textSize(10)
        p.textStyle(BOLD);
        p.text("Neural Network Visualization Key", x, y)
        p.textStyle(NORMAL);
        p.text("○ Colors of lines represent weights of connections.", x, y += wordVerticalSpacing)
        p.text("○ Colors of circles represent bias of neurons.", x, y += wordVerticalSpacing)
        p.text("○ Red -> positive value, Blue -> negative value.", x, y += wordVerticalSpacing)
        p.text("○ Darker color -> Further from zero.", x, y += wordVerticalSpacing)
    }

    // Get display info for hidden layers, return in the form [diameter, rowGap]
    function getHiddenDisplayInfo(displayInterval, nodesNum, ratio, originalDiameter) {
        let diameter = (displayInterval) / (nodesNum * (1 + ratio) - (1 + ratio))
        diameter = Math.min(diameter, originalDiameter)
        let rowGap = (diameter * ratio)
        return [diameter, rowGap]
    }

    p.setup = function () {
        p.createCanvas(canvasWidth, canvaseLength)
    }

    p.draw = function () {
        p.background(200);
        //p.clear()
        drawBrain()
        drawKey()
    }
}
var x = new p5(s, 'jimmybrain')

class Neuron {
    constructor(x, y, diameter, bais) {
        this.x = x;
        this.y = y;
        this.diameter = diameter
        this.radius = diameter / 2
        this.bais = bais;
        if (bais == null) {
            this.opacity = [200]
        }
        else {
            this.opacity = mapToOpacity(bais)
        }
    }

    display() {
        x.stroke(10)
        if (this.opacity.length > 1) {
            x.fill(this.opacity[0], this.opacity[1], this.opacity[2], this.opacity[3])
        }
        else {
            x.fill(this.opacity[0])
        }
        x.ellipse(this.x, this.y, this.diameter)
    }
}

class Connection {
    constructor(startneuron, endneuron, weight) {
        this.startneuron = startneuron
        this.endneuron = endneuron
        this.startx = startneuron.x + startneuron.diameter / 2
        this.starty = startneuron.y
        this.endx = endneuron.x - endneuron.diameter / 2
        this.endy = endneuron.y
        this.weight = weight
        this.opacity = mapToOpacity(weight)
    }

    display() {
        x.stroke(this.opacity[0], this.opacity[1], this.opacity[2], this.opacity[3])
        x.line(this.startx, this.starty, this.endx, this.endy)
    }
}

function mapToOpacity(x) {
    if (x == 0)
        return [0, 0, 0, 0]
    let input = Math.abs(x)
    let inputMax = 4
    let inputMin = 0
    let outputMax = 255
    let outputMin = 0
    let newVal = outputMin + ((outputMax - outputMin) / (inputMax - inputMin)) * (input - inputMin)
    if (newVal > 255)
        newVal = 255
    if (x < 0)
        return [0, 0, 255, newVal]
    return [255, 0, 0, newVal]
}

////////////////// Unused util ////////////////
/*
function onNeuron(x, y) {
    console.log("This is x: " + x + ". This is y: " + y + ".")
    for (let i = 0; i < output_neurons.length; i++) {
        console.log("(" + output_neurons[i].x + ", " + output_neurons[i].y + ")")
        let dist = Math.sqrt(Math.pow(x - output_neurons[i].x, 2) + Math.pow(y - output_neurons[i].y, 2))
        if (dist < output_neurons[i].radius) {
            console.log(i)
            return [true, i]
        }
    }
    return [false, -1]
}

    p.mouseClicked = function () {
        let onNeuronResult = onNeuron(p.mouseX, p.mouseY)
        if (onNeuronResult[0]) {
            output_neurons[onNeuronResult[1]].clicked()
        }
    }

        clicked() {
        x.frameRate(0)

        this.opacity = [200]
        this.x+=10
        this.display()
        
    }
    */