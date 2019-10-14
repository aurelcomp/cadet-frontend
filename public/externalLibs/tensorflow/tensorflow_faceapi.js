// function that the student will have to produce

// ---------------------------------------------------------
// ---------------------------------------------------------
// preparation data from face api to tensorflow
// Otherwise, can take an online database (need specific function to load this database in Face API)
// encode labeled database to prepare data for building classifier (to be done in Face API)
function encode_tf(){
    let data=[];
    let data_image=[];
    const labels = get_nonnull_labels();
    // for each label
    for (let numberLabel = 0; numberLabel < array_length(labels); numberLabel = numberLabel+1){
      const label = labels[numberLabel];
      const images_label = get_images(label);
      // for each image in label
      for (let j = 0; j < array_length(images_label); j = j+1){
        data_image=[];
        const image = images_label[j];
        const detections = encode_image(image);
        array_push(data_image,detections);
        array_push(data_image,numberLabel);
        array_push(data,data_image);
      }
    }
     return data;
  }
  
  // take in arg the list previouly created to give the same list with the result of the embedding calculation
  function get_embed(data){
    let labeled_embeddings=[];
    let embedding_image=[];
    for (let i =0; i < array_length(data); i=i+1){
        embedding_image=[];
        const embedding_function=data[i][0];
        const label=data[i][1];
        const embedings = embedding_function();
        for (let numberEmbedding=0; numberEmbedding<128 ; numberEmbedding=numberEmbedding+1){
            array_push(embedding_image,embedings[to_string(numberEmbedding)]);  
        }
        array_push(embedding_image,label);
        array_push(labeled_embeddings,embedding_image);
    }
    return labeled_embeddings;
  }

// ---------------------------------------------------------
// ---------------------------------------------------------
// functions that the student will have to code
// for creating a classifier for the face embeddings



// --------------------------
// --------------------------
// LVL 1 - prepare data without convert to tensor
// --------------------------
// --------------------------

/*
 * split in training and testing data
 * Split in X and Y for training and testing, with:
 * X array of length-127 array of embeddings
 * Y array of number, representing the label, with the same length as X
 */
// outside function variable because doesn't work if
// if try to return the value which is undefined in the S.A.
let results = [];
function prepareData(dataEmbedding,testSplit) {
  return tf_tidy(() => {
    const dataByClass = [];
    const targetsByClass = [];
    for (let i=0 ; i < array_length(labels) ; i=i+1) {
      array_push(dataByClass,[]);
      array_push(targetsByClass,[]);
    }
    for (let k=0; k < array_length(dataEmbedding) ; k=k+1) {
      const element = dataEmbedding[k];
      const target = element[array_length(element) -1];
      const data = array_slice(element, 0, array_length(element)-1);
      array_push(targetsByClass[target], target);
      array_push(dataByClass[target], data);
    }
    console_log(dataByClass);
    console_log(targetsByClass);
    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    for (let i=0 ; i < array_length(labels) ; i=i+1) {
      const functionListData = convert_to_tensor(dataByClass[i], targetsByClass[i], testSplit);
      const listData = functionListData();
      const xTrain = listData[0];
      const yTrain = listData[1];
      const xTest = listData[2];
      const yTest = listData[3];
      array_push(xTrains, xTrain);
      array_push(yTrains, yTrain);
      array_push(xTests, xTest);
      array_push(yTests, yTest);
    }

    const concatAxis = 0;
    const test1 = xTrains;
    const test2 = tf_concat(xTrains,concatAxis);
    console_log(test1);
    console_log(test2);
    results = [tf_concat(xTrains,concatAxis), tf_concat(yTrains,concatAxis),
      tf_concat(xTests,concatAxis), tf_concat(yTests,concatAxis)];
  });
}



// call these functions to run everything
prepareData(dataEmbedding,0.2);
const xTrain = results[0];
const yTrain = results[1];
const xTest = results[2];
const yTest = results[3];

const model = train_model(xTrain, yTrain, xTest, yTest);

const input = tf_tensor2d(testEmbedding, [1, 128]);

// call in the console after the model has been trained
// const prediction = predict(model(), input);
// alertPrediction(prediction);



// --------------------------
// --------------------------
// LVL 2 - add prepareModel()
// --------------------------
// --------------------------

/*
 * split in training and testing data
 * Split in X and Y for training and testing, with:
 * X array of length-127 array of embeddings
 * Y array of number, representing the label, with the same length as X
 */
// outside function variable because doesn't work if
// if try to return the value which is undefined in the S.A.
let results = [];
function prepareData(dataEmbedding,testSplit) {
  return tf_tidy(() => {
    const dataByClass = [];
    const targetsByClass = [];
    for (let i=0 ; i < array_length(labels) ; i=i+1) {
      array_push(dataByClass,[]);
      array_push(targetsByClass,[]);
    }
    for (let k=0; k < array_length(dataEmbedding) ; k=k+1) {
      const element = dataEmbedding[k];
      const target = element[array_length(element) -1];
      const data = array_slice(element, 0, array_length(element)-1);
      array_push(targetsByClass[target], target);
      array_push(dataByClass[target], data);
    }
    console_log(dataByClass);
    console_log(targetsByClass);
    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    for (let i=0 ; i < array_length(labels) ; i=i+1) {
      const functionListData = convert_to_tensor(dataByClass[i], targetsByClass[i], testSplit);
      const listData = functionListData();
      const xTrain = listData[0];
      const yTrain = listData[1];
      const xTest = listData[2];
      const yTest = listData[3];
      array_push(xTrains, xTrain);
      array_push(yTrains, yTrain);
      array_push(xTests, xTest);
      array_push(yTests, yTest);
    }

    const concatAxis = 0;
    const test1 = xTrains;
    const test2 = tf_concat(xTrains,concatAxis);
    console_log(test1);
    console_log(test2);
    results = [tf_concat(xTrains,concatAxis), tf_concat(yTrains,concatAxis),
      tf_concat(xTests,concatAxis), tf_concat(yTests,concatAxis)];
  });
}

// Create and train the model 
function prepareModel(xTrain, yTrain, xTest, yTest){
  const model = tf_sequential();
  const learningRate = 0.01;
  const numberOfEpochs = 40;
  const optimizer = tf_train('adam', learningRate);

  add_input_layer(model, 10, 'sigmoid', [128], false);

  add_hidden_layer(model, 3, 'softmax');

  compile(model, optimizer, 'categoricalCrossentropy', ['accuracy']);

  // Train the model
  return model_fit(model, [xTrain, yTrain, xTest, yTest], numberOfEpochs);
}



// call these functions to run everything
prepareData(dataEmbedding,0.2);
const xTrain = results[0];
const yTrain = results[1];
const xTest = results[2];
const yTest = results[3];

const model = prepareModel(xTrain, yTrain, xTest, yTest);

const input = tf_tensor2d(testEmbedding, [1, 128]);

// call in the console after the model has been trained
// const prediction = predict(model(), input);
// alertPrediction(prediction);




// --------------------------
// --------------------------
// LVL 3 - add convert to tensor function
// --------------------------
// --------------------------



// Convert data to tensor
// "2" for avoid same name function problem for testing
function convert_to_tensor2(data, targets, testSplit) {
  const numExamples = array_length(data);
  if (numExamples !== array_length(targets)) {
    return 'Error: data and targets have different number of examples';
  }
  else{
  const xDims = array_length(data[0]);
  // create a 2D tf.Tensor to hold the embeddings data
  const xs = tf_tensor2d(data, [numExamples, xDims]);

  // Create 1D ts.Tensor to hold the labels and convert to one hot encoding
  const ys = tf_one_hot(tf_tensor1d(targets), array_length(labels));

  // Split into training and testing data
  const numTestExamples = math_round(numExamples * testSplit);
  const numTrainExamples = numExamples-numTestExamples;
  const numLabels = array_length(labels);

  const xTrain = tf_slice(xs, [0,0],[numTrainExamples, xDims]);
  const xTest = tf_slice(xs, [numTrainExamples,0],[numTestExamples, xDims]);
  const yTrain = tf_slice(ys, [0,0],[numTrainExamples, numLabels]);
  const yTest = tf_slice(ys, [numTrainExamples,0],[numTestExamples, numLabels]);
  return [xTrain, yTrain, xTest, yTest];
  }
}



let results = [];
function prepareData(dataEmbedding,testSplit) {
  return tf_tidy(() => {
    const dataByClass = [];
    const targetsByClass = [];
    for (let i=0 ; i < array_length(labels) ; i=i+1) {
      array_push(dataByClass,[]);
      array_push(targetsByClass,[]);
    }
    for (let k=0; k < array_length(dataEmbedding) ; k=k+1) {
      const element = dataEmbedding[k];
      const target = element[array_length(element) -1];
      const data = array_slice(element, 0, array_length(element)-1);
      array_push(targetsByClass[target], target);
      array_push(dataByClass[target], data);
    }
    console_log(dataByClass);
    console_log(targetsByClass);
    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    for (let i=0 ; i < array_length(labels) ; i=i+1) {
      const listData = convert_to_tensor2(dataByClass[i], targetsByClass[i], testSplit);
      const xTrain = listData[0];
      const yTrain = listData[1];
      const xTest = listData[2];
      const yTest = listData[3];
      array_push(xTrains, xTrain);
      array_push(yTrains, yTrain);
      array_push(xTests, xTest);
      array_push(yTests, yTest);
    }

    const concatAxis = 0;
    results = [tf_concat(xTrains,concatAxis), tf_concat(yTrains,concatAxis),
      tf_concat(xTests,concatAxis), tf_concat(yTests,concatAxis)];
    return results;
  });
}


function prepareModel(){
  const model = tf_sequential();
  const learningRate = 0.01;
  const numberOfEpochs = 40;
  const optimizer = tf_train('adam', learningRate);

  add_input_layer(model, 10, 'sigmoid', [128], false);

  add_hidden_layer(model, array_length(labels), 'softmax');

  compile(model, optimizer, 'categoricalCrossentropy', ['accuracy']);

  // Train the model
  return model_fit(model, results, numberOfEpochs);
}

prepareData(dataEmbedding,0.2);
const xTrain = results[0];
const yTrain = results[1];
const xTest = results[2];
const yTest = results[3];

const model = prepareModel();

const input = tf_tensor2d(testEmbedding, [1, 128]);
//const prediction = predict(model(), input);
// const proba = get_proba(prediction);
// const bestPred = get_highest_prediction(prediction);
//alertPrediction(prediction);