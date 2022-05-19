# Jimmy's Playground
Christian Barrett and Eli Gottlieb.

This document contains our motivation, a description of the program, how to use our program, the functionality of buttons and sliders displayed when using our program, and an overview of the neural network visualizer within our program.

## Motivation

Heavily inspired by Code Bullet, https://www.youtube.com/CodeBullet, we wanted to make our own version of snake and then create and observe an AI to play it.
To make our own version of snake we used the p5.js library.
To make our own artificial intelligence, we learned about and implemeneted a neural network, deep learning, q learning, and deep q learning.

## Description

Jimmy's Playground is a browser snake game.
In Jimmy's Playground, users may play snake or watch their own version of Jimmy play snake.
Jimmy is a form of artificial intelligence that uses Deep Q Learning to learn how to play snake.

## How to use

Jimmy's Playground has two modes. One mode allows the user to play snake,
the other has Jimmy control and displays Jimmy playing snake. Users can switch
between these modes using the "Toggle Jimmy" button. 

While watching Jimmy, the user has access to information about Jimmy's journey.
The user can see:
- Jimmy's current score
- Jimmy's highcore
- The number of times Jimmy has trained
- The number of sets Jimmy has trained with
- A visual representation of Jimmy's neurnal network
- How many generations of Jimmy have passed

## Buttons
- Toggle Jimmy
  - Switch between user input and watching Jimmy
- Wipe Jimmy :(
  - Reset Jimmy: Wipe his brain and overwrite existing saves in browser storage
- Play/Pause Jimmy
  - Play and pause Jimmy. These buttons will replace themselves on the page
- View/Hide Brain
  - Display and hide a visual representation of Jimmy's neural network. These buttons will replace themselves on the page

## Sliders
- Randomness (Bottom of the screen)
  -  It can be beneficial for the learning process to include an element of randmoness to the move selection process. In our case, this may force Jimmy into situations he wouldn't normally choose to enter. The slider changes the chance that Jimmy will pick a random move instead of his best guess of the correct move.
-  Framerate (Bottom of the screen)
  -  This slider can be used to changed the framerate of the game. Changing the framerate will speed up or slow Jimmy down.
-  Brainpower (Accessible via View Brian button)
  -  While the number of inputs and outputs of Jimmy's neural network remain constant, the size of the hidden layers can change using this slider.

## Neural Network Visualization - View/Hide Brain
A neural network consists of neurons and connections between those neurons. Jimmy's neural network is made up of 14 input neurons, 30 hidden layer neurons in each of the 2 hidden layers, and finally 4 output neurons. The labels for the input and output neurons can be seen in the generated image displayed when "View Brain" is clicked. Using the "Brainpower" slider, users can change the number of neurons in the hidden layers. This may change Jimmy's learning process.

The colors in the neural network image represent the corresponding weight and bias values to connections and hidden neurons/output neurons, respectively. Lighter colors represent values closer to 0 while darker colors represent higher and lower numbers. A red color represents a positive value and a blue color represents a negative value.
