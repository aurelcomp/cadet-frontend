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

// function push in array
function array_push(array, element) {
    array.push(element);
  }

// function slice array
function array_slice(array, start,end) {
    return array.slice(start,end);
}

// tf.tidy function
function tf_tidy(callback) {
    tf.tidy(callback);
}

// tf.concat function
function tf_concat(values,axis) {
    return tf.concat(values,axis);
}

// create 2D tensor
function tf_tensor2d(values, shape) {
    return tf.tensor2d(values, shape);
}

// create 1D tensor
function tf_tensor1d(values) {
    return tf.tensor1d(values);
}

// create 2D tensor
function tf_one_hot(indices, depth) {
    // toInt() to convert in integer (to simplify for student)
    return tf.oneHot(indices.toInt(), depth);
}

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

// function slice array
function tf_slice(tensor, begin, size) {
    return tensor.slice(begin, size);
}

// --------------------------
// Functions to create/train model
// --------------------------


// Create a sequential model
function tf_sequential() {
    return tf.sequential(); 
}

// Add a dense layer
function add_input_layer(model, neurons, fActivation, input_shape) {
    // inputShape is an array
    model.add(tf.layers.dense({units: neurons, activation: fActivation, inputShape: input_shape}));
}

// Add a hidden layer
function add_hidden_layer(model, neurons, fActivation) {
    model.add(tf.layers.dense({units: neurons, activation: fActivation}));
}

// compile model    
// myMetrics is a list, eg. ['accuracy']
function compile(model, optimizer, lossFunction, myMetrics) {
    model.compile({optimizer: optimizer, loss: lossFunction, metrics: myMetrics});
}

// get shape tensor
function tf_shape(tensor) {
    return tensor.shape;
}

// Define optimizer
// To complete with all optimizer we want to allow
function tf_train(myOptimizer, learningRate) {
    switch (myOptimizer) {
        case 'adam':
            return tf.train.adam(learningRate);
    }
    
}

// fit the model
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


// Train the model with Training and Testing sets
let model
let modelTrained = undefined;

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
    model = await trainModel(xTrain, yTrain, xTest, yTest);
    console.log('training finished')
    modelTrained = true;
}

// --------------------------
// Functions to use model
// --------------------------

// prediction using the model
function predict(model, input) {
    if (modelTrained === undefined) {
        model();
    }
    else{
        return model.predict(input);
    }
}

function get_proba(prediction) {
    return prediction.arraySync();
}

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

// get inference from MobileNet
function infer_mobilenet(img){
  if (mobileNet_loaded === undefined){
    throw new Error("Call load_mobilenet(); " +
        "to load the MobileNet model before using it for inference");
  }
  else {
    return mobileNet.infer(img, 'conv_preds');
  }
}

// get classification from MobileNet
function classify_mobilenet(img){
  if (mobileNet_loaded === undefined){
    throw new Error("Call load_mobilenet(); " +
        "to load the MobileNet model before using it for classification");
  }
  else {
    return mobileNet.classify(img);
  }
}

// create KNN Classifier
function create_knn(){
  return knnClassifier.create()
}  

// get classification from KNN Classifier
function predict_class(classifier, inference){
  predict_class_async(classifier, inference);
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

// add example to knn classifier
function add_example_knn(classifier, example, label){
    if (Number.isInteger(label) === false){
        throw new Error("label argument of 'add_example_knn' must be an integer")
    }
    else {
        classifier.addExample(example, label)
    }
    
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
function do_after_prediction(myFunction) {
    setTimeout(() => {
        if (prediction_done === true){
            myFunction();
        }
        }, do_after_prediction_timeout)
}