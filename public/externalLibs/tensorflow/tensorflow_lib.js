// for testing
function console_log(element) {
    console.log(element);
}

// --------------------------
// Functions to prepare data
// --------------------------

// Load data from URL
let data
let data_loaded= undefined
function get_data(url) { 
async_get_data(url);
return () => {
    if (data_loaded === undefined) {
    throw new Error("data still loading")
    }
    else {
    return data
    }
}
}
async function async_get_data(url) {
const dataReq = await fetch(url);  
data = await dataReq.json(); 
data_loaded = true;
}

/**
 * Returns the selected elements in an Array (the elements between the positions
 * start and end), as a new Array object.
 * Ex:
 * <CODE>
 * let L = [1 ,2, 3, 4, 5, 6];
 * const T = array_slice(L, 1, 3);
 * // T = [2, 3]
 * </CODE>
 * @param {Array} myArray - Array from which we want to extract elements.
 * @param {Number} begin -  Position of the first element to select.
 * @param {Number} end - End for the selection. The element at the end position
 * is not selected. 
 * @return {Array} Array of the selected elements.
 */
function array_slice(myArray, begin, end) {
    return myArray.slice(begin,end);
}

/**
 * Executes the provided function <CODE>myFunction</CODE> and after it is executed, cleans up all 
 * intermediate tensors allocated by <CODE>myFunction</CODE> except those returned by <CODE>myFunction</CODE>
 * @param {function} myFunction - Function to execute.
 * @return {undefined}
 */
function tf_tidy(myFunction) {
    tf.tidy(myFunction);
}

/**
 * Concatenates an Array of tf_tensors along a given axis.
 * @param {Array} tensors - An Array of tensors to concatenate.
 * @param {Number} axis - The axis to concate along. Defaults to 0 (the first dim).
 * @return {tf_tensor} The concatenated tensor.
 */
function tf_concat(tensors,axis) {
    return tf.concat(tensors,axis);
}

/**
 * Creates rank-1 tf_tensor with the provided values and shape.
 * @param {Array} values - The values of the tensor.
 * @param {Number} shape - The shape of the tensor.
 * @return {tf_tensor1D} The tf_tensor1D.
 */
function tf_tensor1d(values) {
    return tf.tensor1d(values);
}

/**
 * Creates rank-2 tf_tensor with the provided values and shape.
 * @param {Array} values - The values of the tensor.
 * @param {[Number, Number]} shape - The shape of the tensor.
 * @return {tf_tensor2D} The tf_tensor2D.
 */
function tf_tensor2d(values, shape) {
    return tf.tensor2d(values, shape);
}

/**
 * Creates a one-hot tf_tensor. The locations represented by 
 * indices take value 1, while all other locations take value 0.
 * @param {tf_tensor1D} indices - tf_tensor1D of indices with type Number.
 * @param {Number} depth - The depth of the one hot dimension.
 * @return {tf_tensor2D} The one hot tf_tensor2D.
 */
function tf_one_hot(indices, depth) {
    // toInt() to convert in integer (to simplify for student)
    return tf.oneHot(indices.toInt(), depth);
}

/**
 * Creates X and Y tensors for training and testing from data (X) and targets (Y) elements.
 * @param {Array} data - Array of input data.
 * @param {Array} targets - Array of output corresponding to the input data.
 * @param {Number} testSplit - The percentage of data repartition between training and testing tensors. 
 * Value between 0 and 1. testSplit of 0.2
 * means that 80% of the data will be used in the training tensors and 20% for the testing tensors. 
 * @return {Array} Returns the Array containing the X and Y tensors for training and testing: 
 * [xTrain, yTrain, xTest, yTest]
 */
function convert_to_tensor(data, targets, testSplit) {
    const numExamples= data.length;
    if (numExamples!== targets.length) {
    throw new Error('data and targets have different number of examples');
    }

    const numTestExamples = Math.round(numExamples * testSplit);
    const numTrainExamples = numExamples-numTestExamples;

    const xDims = data[0].length;
    // create a 2D tf.Tensor to hold the embeddings data
    const xs = tf.tensor2d(data, [numExamples, xDims]);

    // Create 1D ts.Tensor to hold the labels and convert to one hot encoding
    const ys = tf.oneHot(tf.tensor1d(targets).toInt(), labels.length);

    // Split into training and testing data
    const xTrain = xs.slice([0,0],[numTrainExamples, xDims]);
    const xTest = xs.slice([numTrainExamples,0],[numTestExamples, xDims]);
    const yTrain = ys.slice([0,0],[numTrainExamples, labels.length]);
    const yTest = ys.slice([numTrainExamples,0],[numTestExamples, labels.length]);
    return () => {
        return [xTrain, yTrain, xTest, yTest];
    }
}

/**
 * Extracts a slice from a tf_tensor starting at coordinates begin and is of size size.
 * @param {tf_tensor} tensor - Array of input data.
 * @param {Array} begin - Number or Array of Numbers. The coordinates to start the slice from. 
 * @param {Array} size - Number or Array of Numbers. The size of the slice.
 * @return {tf_tensor} Returns the sliced tf_tensor as specified.
 */
function tf_slice(tensor, begin, size) {
    return tensor.slice(begin, size);
}

// --------------------------
// Functions to create/train model
// --------------------------

/**
 * Creates a tf_sequential model. A sequential model is any model where the outputs of one layer 
 * are the inputs to the next layer.
 * @return {tf_sequential} The model created.
 */
function tf_sequential() {
    return tf.sequential(); 
}

/**
 * Create and add the first layer of the model with the specified parameters. This layer is 
 * special because we need to specify its input shape. For the next layers, the input shape will
 * be automatically the ouput shape of the previous layer.
 * @param {tf_sequential} model - The model.
 * @param {Number} neurons - The number of neurons in the layer (number of outputs).
 * @param {String} fActivation - Activation function to use, between: 'elu', 'hardSigmoid','linear',
 * 'relu', 'relu6', 'selu', 'sigmoid', 'softmax', 'softplus', 'softsign', 'tanh'.
 * @param {Number} input_shape - The input dimension of the model.
 * @return {undefined}
 */
function add_input_layer(model, neurons, fActivation, input_shape) {
    // inputShape is an array
    model.add(tf.layers.dense({units: neurons, activation: fActivation, inputShape: input_shape}));
}

/**
 * Create and add an hidden layer of the model with the specified parameters.
 * @param {tf_sequential} model - The model.
 * @param {Number} neurons - The number of neurons in the hidden layer (number of outputs).
 * @param {String} fActivation - Activation function to use, between: 'elu', 'hardSigmoid','linear',
 * 'relu', 'relu6', 'selu', 'sigmoid', 'softmax', 'softplus', 'softsign', 'tanh'.
 * @return {undefined}
 */
function add_hidden_layer(model, neurons, fActivation) {
    model.add(tf.layers.dense({units: neurons, activation: fActivation}));
}


// To complete with all optimizer we want to allow

/**
 * Configures and prepares the model for training and evaluation. 
 * Compiling outfits the model with an optimizer, loss, and/or metrics. 
 * Calling fit or evaluate on an un-compiled model will throw an error.
 * @param {String} myOptimizer - The optimizer to use, betweeen: 'sgd' and 'adam'. 
 * @param {Number} learningRate - The learning rate to use for the optimizing algorithm. 
 * @return {tf_optimizer}
 */
function tf_train(myOptimizer, learningRate) {
    switch (myOptimizer) {
        case 'adam':
            return tf.train.adam(learningRate);
        case 'sgd':
            return tf.train.sgd(learningRate);
    }
}

/**
 * Configures and prepares the model for training and evaluation. 
 * Compiling outfits the model with an optimizer, loss, and/or metrics. 
 * Calling fit or evaluate on an un-compiled model will throw an error.
 * @param {tf_sequential} model - The model.
 * @param {tf_optitimizer} optimizer - Optimizer to use. 
 * @param {String} lossFunction - Loss function to use, between: 'categoricalCrossentropy', 
 * 'meanAbsoluteError', 'cosineSimilarity', 'meanSquaredError'.
 * @return {undefined}
 */
function compile(model, optimizer, lossFunction,) {
    model.compile({optimizer: optimizer, loss: lossFunction});
}

/**
 * Returns the shape of a tf_tensor.
 * @param {tf_tensor} tensor - The tensor.
 * @return {Array} Shape of the tensor.
 */
function tf_shape(tensor) {
    return tensor.shape;
}

/**
 * Fit the model with the given data for the number of iterations specified.
 * Returns a promise, a function which will return the model when it is called
 * if the training of the model has been finished.
 * @param {tf_sequential} model - The model.
 * @param {Array} XY - Array of X and Y tensors, either [X, Y] if no testing data or 
 * [xTrain, yTrain, xTest, yTest] if there are testing data.
 * @param {Number} numberOfEpochs - The number of times to iterate over the training data arrays.
 * @return {function} Promise of the trained model.
 */
function model_fit(model, XY, numberOfEpochs) {
    // pass to undefined when launch a new training
    modelTrained = undefined;
    if (XY.length === 2){
        async_model_fit(model, XY, numberOfEpochs);
    }
    if (XY.length === 4){
        async_model_fit_withTest(model, XY, numberOfEpochs);
    }
    else {
        throw new Error ('the second parameter is either [xTrain, yTrain] or [xTrain, yTrain, xTest, yTest]')
    }
    return () => {
        if (modelTrained === undefined) {
            return 'model still training'
        }
        else {
            return model
        }
    }
}

async function async_model_fit(model, XY, numberOfEpochs) {
    const [xTrain, yTrain] = XY;
    // give information on training to user
    var paragraph = document.getElementById("tensorflow-results");
    var text = document.createTextNode("Launch training...");
    paragraph.appendChild(text);
    var br = document.createElement("br");
    paragraph.appendChild(br);
    await model.fit(xTrain, yTrain,
        {epochs: numberOfEpochs,
          callbacks: {
              onEpochEnd: async (epoch, logs) => {
                console.log("Epoch: " + epoch + ", logs: " + logs.loss);
                // to write in the Tensorflow Visualizer
                var text = document.createTextNode("Epoch: " + epoch + ", logs: " + logs.loss);
                paragraph.appendChild(text);
                var br = document.createElement("br");
                paragraph.appendChild(br);
                await tf.nextFrame();
              }
          }
        }
    );
    // give information on training to user
    var text = document.createTextNode("Training done.");
    paragraph.appendChild(text);
    var br = document.createElement("br");
    paragraph.appendChild(br);
    modelTrained=true;
}

async function async_model_fit_withTest(model, XY, numberOfEpochs) {
    const [xTrain, yTrain, xTest, yTest] = XY;
    // give information on training to user
    var paragraph = document.getElementById("tensorflow-results");
    var text = document.createTextNode("Launch training...");
    paragraph.appendChild(text);
    var br = document.createElement("br");
    paragraph.appendChild(br);
    await model.fit(xTrain, yTrain,
        {epochs: numberOfEpochs, validationData: [xTest, yTest],
          callbacks: {
              onEpochEnd: async (epoch, logs) => {
                console.log("Epoch: " + epoch + " logs: " + logs.loss);
                var paragraph = document.getElementById("tensorflow-results");
                var text = document.createTextNode("Epoch: " + epoch + ", logs: " + logs.loss);
                paragraph.appendChild(text);
                var br = document.createElement("br");
                paragraph.appendChild(br);
                await tf.nextFrame();
              }
          }
        }
    );
    // give information on training to user
    var text = document.createTextNode("Training done.");
    paragraph.appendChild(text);
    var br = document.createElement("br");
    paragraph.appendChild(br);
    modelTrained=true;
}

// high level function to train a pre-created model
// Train the model with Training and Testing sets
let model
let modelTrained = undefined;

/**
 * Train a pre-defined model for the classification of faces' embeddings.
 * Returns a promise, a function which will return the model when it is called
 * if the training of the model has been finished.
 * @param {tf_tensor} xTrain - The tensor for the input training data.
 * @param {tf_tensor} yTrain - The tensor for the output training data.
 * @param {tf_tensor} xTest - The tensor for the input testing data.
 * @param {tf_tensor} yTest - The tensor for the output testing data.
 * @return {function} Promise of the trained model.
 */
function train_model(xTrain, yTrain, xTest, yTest) {
    async_train_model(xTrain, yTrain, xTest, yTest);
    return () => {
        if (modelTrained === undefined) {
            return "Model still training"
        }
        else {
            return model
        }
    }
}
async function async_train_model(xTrain, yTrain, xTest, yTest) {
    console.log('launch training')
    model = await train_the_model(xTrain, yTrain, xTest, yTest);
    console.log('training finished')
    modelTrained = true;
}

// Train the preset model
async function train_the_model(xTrain, yTrain, xTest, yTest){
    const model = tf.sequential();
    const learningRate = 0.01;
    const numberOfEpochs = 40;
    const optimizer = tf.train.adam(learningRate);
  
    model.add(tf.layers.dense(
      { units:10, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
    
    model.add(tf.layers.dense(
      { units:labels.length, activation: 'softmax'}));
      
    model.compile(
      {optimizer: optimizer, loss: 'categoricalCrossentropy', metrics: ['accuracy']});
    console.log(yTrain);
    const history = await model.fit(xTrain, yTrain,
      {epochs: numberOfEpochs, validationData: [xTest, yTest],
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
              console.log("Epoch: " + epoch + " logs: " + logs.loss);
              await tf.nextFrame();
            }
        }
      });
    return model
  }
// --------------------------
// Functions to use model
// --------------------------

/**
 * Generates output predictions of a model for the input given as argument.
 * @param {tf_sequential} model - The trained model.
 * @param {tf_tensor} input - The input data.
 * @return {tf_tensor} The predictions of the model.
 */
function predict(model, input) {
    if (modelTrained === undefined) {
        model();
    }
    else{
        return model.predict(input);
    }
}

/**
 * Gives the values of the prediction for each output neuron.
 * @param {tf_tensor} prediction - The predictions of a model.
 * @return {Array} The values of the prediction for each output neuron.
 */
function get_proba(prediction) {
    return prediction.arraySync();
}

/**
 * Gives the highest-value prediction.
 * @param {tf_tensor} prediction - The predictions of a model.
 * @return {Array} The highest-value prediction.
 */
function get_highest_prediction(prediction) {
    return prediction.argMax(-1).arraySync();
}

function alertPrediction(prediction) {
    alert(prediction);
}



// // ---------------------------------------------
// // Tensorflow - Transfer Learning - Detect glasses application 
// // ---------------------------------------------


// load MobileNet model
let mobileNet;
let mobileNet_loaded = undefined;

/**
 * Load the MobileNet model for image classification.
 * @return {undefined} 
 */
function load_mobilenet(){
  load_mobilenet_async();
  return "loading MobileNet..."
}
async function load_mobilenet_async(){
  console.log('Loading mobilenet..');
  // Load the model.
  mobileNet = await mobilenet.load();
  mobileNet_loaded=true;
  console.log('Successfully loaded model');
}


function infer_mobilenet(image){
  if (mobileNet_loaded === undefined){
    throw new Error("Call load_mobilenet(); " +
        "to load the MobileNet model before using it for inference");
  }
  else {
    return mobileNet.infer(image, 'conv_preds');
  }
}

/**
 * Apply MobileNet classification on an image. Returns a promise of the
 * classification, ie. a function which returns the classification when it is
 * called if the classification has been finished. 
 * @param {Image} image - The predictions of a model.
 * @return {function} Promise of the classification.
 */
function classify_mobilenet(img){
  if (mobileNet_loaded === undefined){
    throw new Error("Call load_mobilenet(); " +
        "to load the MobileNet model before using it for classification");
  }
  else {
    async_classify_mobilenet(img);
    return () => {
        if (mobilenet_done === undefined) {
          throw new Error("prediction still in progress")
            }
        else {
            mobilenet_done = undefined;
          return result_mobilenet;
        }
    };
  }
}
// Async function linked
let result_mobilenet
let mobilenet_done = undefined
async function async_classify_mobilenet(img){
    const result = await mobileNet.classify(img);
    let predictions = [];
    for (let i=0; i < result.length ; i=i+1){
        const className = result[i].className;
        const probability = result[i].probability;
        const prediction = [className, probability];
        array_push(predictions, prediction);
    }
    result_mobilenet = predictions;
    mobilenet_done = true;
}

// value of setTimeout fixed to 150ms
const do_after_mobilenet_timeout = 150;

/**
 * Continuation passing function which run myFunction after 
 * the MobileNet classification has been done.
 * @param {function} my_function - The function to run after the 
 * classification has been done.
 * @return {undefined}
 */
function do_after_mobilenet(myFunction) {
    setTimeout(() => {
        if (mobilenet_done === true){
            myFunction();
        }
        }, do_after_prediction_timeout)
}

/**
 * Create a KNN classifier model.
 * @return {knn_model} The KNN model.
 */
function create_knn(){
  return knnClassifier.create()
}  

/**
 * Add an example to the KNN classifier.
 * @param {knn_model} classifier - The KNN model.
 * @param {example} example - An example to add to the dataset, usually an activation from another model.
 * @param {Number} label - The label (class name) of the example.
 * @return {undefined}
 */
function add_example_knn(classifier, example, label){
    if (Number.isInteger(label) === false){
        throw new Error("label argument of 'add_example_knn' must be an integer")
    }
    else {
        classifier.addExample(example, label)
    }
}

// 
/**
 * Apply KNN classification on an input.
 * @param {knn_model} classifier - The KNN model.
 * @param {example} input - An example to make a prediction on, usually an activation from another model.
 * @return {function} Promise of the classification.
 */
function predict_class(classifier, input){
  predict_class_async(classifier, input);
  return () => {
    if (prediction_done === undefined) {
      throw new Error("prediction still in progress")
        }
    else {
      prediction_done = undefined;
      return prediction;
    }
  };
}  

let prediction;
let prediction_done = undefined;
async function predict_class_async(classifier, inference){
  const full_prediction = await classifier.predictClass(inference);
  const label = full_prediction.label;
  const confidences = full_prediction.confidences;
  prediction = [label, confidences[parseInt(label)]];
  prediction_done = true
}

// value of setTimeout fixed to 150ms
const do_after_prediction_timeout = 150;

/**
 * Continuation passing function which run myFunction after 
 * the KNN classification has been done.
 * @param {function} my_function - The function to run after the 
 * classification has been done.
 * @return {undefined}
 */
function do_after_knn(myFunction) {
    setTimeout(() => {
        if (prediction_done === true){
            myFunction();
        }
        }, do_after_prediction_timeout)
}