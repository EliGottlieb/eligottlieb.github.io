///////////////// Button Functions ///////////////////////
// Change userInput and all appropriate HTML elements
var slider_div
var framerate;
function toggleJimmy() {
      if (userInput) {
            userInput = false
            document.getElementById("jimmyinfo").style.display = "flex"
            slider_div.style("display", "flex")
            setButtons()

            // Set headers from storage
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
      document.getElementById("pause").onclick = pauseJimmy
      document.getElementById("play").onclick = playJimmy
      document.getElementById("viewbrain").onclick = viewBrain
      document.getElementById("hidebrain").onclick = hideBrain
      document.getElementById("info").onclick = function () {window.open( 'README.html')}
      document.getElementById("pause").style.display = "flex"
      document.getElementById("viewbrain").style.display = "flex"
      document.getElementById("jimmybrainslider").style.display = "none"
      document.getElementById("play").style.display = "none"
      document.getElementById("hidebrain").style.display = "none"
}
    ///////////////// End Button Functions /////////////////////