The MACHINELEARNING library includes functions for facial recognition and neural networks. Below are some useful definitions and examples to
work with MACHINELEARNING.

## Machine learning

Artificial intelligence is the capacity of a program to think like a human brain. Machine learning aims to reach artificial intelligence by creating high-performance programs for solving a general problem while being trained with particular data of this same problem. Neural networks are a tool used in machine learning.

## Neural network

An artificial neural network, or simply neural network, is a computational learning system that uses a network of functions to understand and translate a data input of one form into a desired output, usually in another form. Using data, a neural network can be trained to achieve specific tasks, such as detect faces on an image. This library enables you to create, train and use neural networks.

## Facial recognition

This library contains trained neural networks enabling to detect and recognise faces. It enables also to detect the landmarks of faces (68 points of interest on a face), to recognise expressions, genders and to estimate the age.  

## Example

A preprogrammed facial recognition application:
<a href="https://sourceacademy.nus.edu.sg/playground#chap=4&exec=1000&ext=MACHINELEARNING&prgrm=C4Jwhglgdg%2BiCmBjA9gcyhYFlQBQEoBuIA">
```
train_recognition();
```
</a>

This application runs face recognition on the webcam and recognise known faces. Thus, we need first to initiate the webcam by calling `init_webcam`, load the models by calling `load_faceapi` and create the dataset of known faces in the Face API Display.
