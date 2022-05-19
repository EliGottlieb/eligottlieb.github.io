///////////////// Button Functions ///////////////////////
// Change userInput and all appropriate HTML elements
var set1 = []
var set2 = []
var set3 = []
var set4 = []
var contGraph;
var slider_div
var framerate;
function toggleJimmy() {
      if (userInput) {
            userInput = false
            document.getElementById("jimmyinfo").style.display = "flex"
            slider_div.style("display", "flex")
            setButtons()

            // Set headers from storage
            document.getElementById("hidegraph").style.display = "none"
            document.getElementById("highscore").innerText = parseInt(window.localStorage.getItem("highscore"))
            document.getElementById("set-counter").innerText = "- Sets: " + parseInt(window.localStorage.getItem("sets"))
            document.getElementById("training-counter").innerText = "- Training: " + parseInt(window.localStorage.getItem("training"))

            // Create qlearner and set brain to brain informaiton saved in storage
            qlearner = new QLearner(realsnake, apple);
            downloadBrain()

            // Create event listeners for clicking buttons
            setButtons()
            restartGame()
      }
      else {
            userInput = true;
            hidegraph()
            document.getElementById("jimmyinfo").style.display = "none"
            document.getElementById("jimmybrain").style.display = "none"
            document.getElementById("jimmybrainslider").style.display = "none"
            slider_div.style("display", "none")
            highscore = 0;
            document.getElementById("highscore").innerText = highscore
            frameRate(30)
            restartGame()
      }
}

// Hard reset storage to restart the learning processes
function resetJimmy() {
      console.log("Jimmy has been wiped.")
      // Wipe storage 
      window.localStorage.setItem("age", 0)
      window.localStorage.setItem("highscore", 0)
      window.localStorage.setItem("training", 0)
      window.localStorage.setItem("sets", 0)

      // Wipe graphing data
      set1 = []
      set2 = []
      set3 = []
      set4 = []
      hidegraph()

      // Reset HTML elements
      document.getElementById("training-counter").innerText = "- Trained: " + 0;
      document.getElementById("set-counter").innerText = "- Sets: " + 0;
      document.getElementById("highscore").innerText = 0;
      document.getElementById("generation-counter").innerText = "- Jimmy's: " + 0;

      // Create new brain and overwrite old brain
      qlearner.brain = new Network(inputLayerSize, hiddenLayerSize, hiddenLayerSize, 4);
      uploadBrain()
      restartGame()
}

// Continually graph new data 
function livegraph() {
      document.getElementById("graph").style.display = "none";
      graph()
      contGraph = window.setInterval(graph, 2000);
}

// Create graph in HTML
function graph() {
      trialmarkers = []
      for (let i = 0; i < set1.length; i++) {
            trialmarkers.push(i)
      }
      //Plotly.newPlot("myDiv", [{ x: trialmarkers, y: set1, name: "Output Errors"}, { x: trialmarkers, y: set2, name: "H2 Errors" }, { x: trialmarkers, y: set3, name: "H1 Errors" }])
      Plotly.newPlot("myDiv", [{ x: trialmarkers, y: set3 }], { title: { text: "Errors vs. Training Data" } })
      document.getElementById("myDiv").style.display = "flex";
      document.getElementById("hidegraph").style.display = "flex";
      console.log("graphed")
}

// High the graph
function hidegraph() {
      clearInterval(contGraph)
      document.getElementById("myDiv").style.display = "none";
      document.getElementById("hidegraph").style.display = "none"
      document.getElementById("graph").style.display = "flex";
}

// Create randomness and framerate sliders
function createSliders() {
      // Create outside div
      slider_div = createDiv();
      slider_div.elt.style.display = "flex"
      // Create hidden layer size label
      hls_label = createSpan('Brainpower: ');
      hls_label.parent(document.getElementById("jimmybrainslider"));
      hls_label.elt.style.flex = 1
      // Create hidden layer size slider
      hls_slider = createSlider(1, 60, 30, 1)
      hls_slider.parent(document.getElementById("jimmybrainslider"))
      hls_slider.elt.style.flex = 1
      hls_slider.elt.style.marginRight = "20px"
      // Create randomness label
      randomize_label = createSpan('Randomness: ');
      randomize_label.parent(slider_div);
      randomize_label.elt.style.flex = 1
      // Create randomness slider
      randomize_slider = createSlider(0, 1, 0, .1)
      randomize_slider.parent(slider_div)
      randomize_slider.elt.style.flex = 1
      randomize_slider.elt.style.marginRight = "20px"
      // Create framerate label
      framerate_label = createSpan('Framerate: ');
      framerate_label.parent(slider_div)
      framerate_label.elt.style.flex = 1
      // Create framerate slider
      framerate_slider = createSlider(1, 60, 60, 1)
      framerate_slider.parent(slider_div)
      framerate_slider.elt.style.flex = 1
}

function pauseJimmy() {
      frameRate(0)
      document.getElementById("pause").style.display = "none"
      document.getElementById("play").style.display = "flex"
}

function playJimmy() {
      frameRate(framerate)
      document.getElementById("pause").style.display = "flex"
      document.getElementById("play").style.display = "none"
}

function viewBrain() {
      document.getElementById("jimmybrain").style.display = "flex"
      document.getElementById("jimmybrainslider").style.display = "flex"
      document.getElementById("viewbrain").style.display = "none"
      document.getElementById("hidebrain").style.display = "flex"
}

function hideBrain() {
      document.getElementById("jimmybrain").style.display = "none"
      document.getElementById("jimmybrainslider").style.display = "none"
      document.getElementById("viewbrain").style.display = "flex"
      document.getElementById("hidebrain").style.display = "none"
}

// Create event listeners and onclick functions for all buttons
function setButtons() {
      document.getElementById("togglejimmy").onclick = toggleJimmy
      document.getElementById("reset").onclick = resetJimmy
      document.getElementById("graph").onclick = livegraph
      document.getElementById("hidegraph").onclick = hidegraph
      document.getElementById("pause").onclick = pauseJimmy
      document.getElementById("play").onclick = playJimmy
      document.getElementById("viewbrain").onclick = viewBrain
      document.getElementById("hidebrain").onclick = hideBrain
      document.getElementById("pause").style.display = "flex"
      document.getElementById("viewbrain").style.display = "flex"
      document.getElementById("jimmybrainslider").style.display = "none"
      document.getElementById("hidegraph").style.display = "none"
      document.getElementById("play").style.display = "none"
      document.getElementById("hidebrain").style.display = "none"
      document.getElementById("graph").style.display = "none"
}
    ///////////////// End Button Functions /////////////////////