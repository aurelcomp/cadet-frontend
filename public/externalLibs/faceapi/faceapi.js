//Load all models when selecting FACEAPI
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('externalLibs/faceapi/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('externalLibs/faceapi/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('externalLibs/faceapi/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('externalLibs/faceapi/models'),
  faceapi.nets.ageGenderNet.loadFromUri('externalLibs/faceapi/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('externalLibs/faceapi/models')
]).then(console.log('FaceAPI Models loaded'))

// Function for loading FaceAPI models
let faceapi_models_loaded = undefined;
function load_faceapi(){
  load_faceapi_async();
  return "loading Face API..."
}
async function load_faceapi_async(){
  console.log('Loading Face API...');
  // Load the model.
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.ageGenderNet.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('externalLibs/faceapi/models')
  ]).then(console.log('FaceAPI Models loaded'))
}

function faceapi_load_tinyFaceDetector() {
  return new Promise((resolve, reject) => {
    faceapi.nets.tinyFaceDetector.loadFromUri('externalLibs/faceapi/models');
    console.log('tinyFaceDetector loaded');
  })
}

function faceapi_load_faceLandmark68Net() {
  return new Promise((resolve, reject) => {
    faceapi.nets.faceLandmark68Net.loadFromUri('externalLibs/faceapi/models');
    console.log('faceLandmark68Net loaded');
  })
}

function faceapi_load_faceRecognitionNet() {
  return new Promise((resolve, reject) => {
    faceapi.nets.faceRecognitionNet.loadFromUri('externalLibs/faceapi/models');
    console.log('faceRecognitionNet loaded');
  })
}

function faceapi_load_faceExpressionNet() {
  return new Promise((resolve, reject) => {
    faceapi.nets.faceExpressionNet.loadFromUri('externalLibs/faceapi/models');
    console.log('faceExpressionNet loaded');
  })
}

function faceapi_load_ssdMobilenetv1() {
  return new Promise((resolve, reject) => {
    faceapi.nets.ssdMobilenetv1.loadFromUri('externalLibs/faceapi/models');
    console.log('ssdMobilenetv1 loaded');
  })
}


// Video
let video = document.getElementById('video');
let video_launched = undefined;

function init_webcam(){
  video_launched = true;
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  return "obtaining webcam permission"
}

// Detection with online stored Database
async function startDetection() {
  const labeledFaceDescriptors = await loadLabeledImages()
  const maxDescriptorDistance = 0.6
  console.log('Images Loaded')
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
  video.addEventListener('play', () => {
    // const canvas = faceapi.createCanvasFromMedia(video)
    const canvas = document.getElementById('canvas')
    //const div = document.getElementsByClassName('sa-video-element')
    //console.log(div)
    //div[0].append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
        drawBox.draw(canvas)
      })
    }, 100)
  })
}

async function loadLabeledImages() {
  const labels = ['Victor']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 4; i <= 4; i++) {
        const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/aurelcomp/Database/master/labeled_images/${label}/${i}.jpg`)
        console.log('loaded')
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        console.log('calculated')
        if (!detections) {
          throw new Error(`no faces detected for ${label} image ${i}`)
        }
        descriptions.push(detections.descriptor)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}





// Recognition on one image
async function start() {
  const labeledFaceDescriptors = await loadLabeledImages();
  console.log('loaded')
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5);
  let image
    image = await faceapi.fetchImage(`https://raw.githubusercontent.com/aurelcomp/Face-Recognition-JavaScript-master/master/test_images/de_gaulle.jpg`)
    const displaySize = { width: image.width, height: image.height }
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      console.log(result)
    })
}


// Take a snap of the video (for FaceAPI) and save it in a labeled map
// Initialise the labeled map
var labeledImages = new Map();
let imagesA=[];
let imagesB=[];
let imagesC=[];
let labelA="A";
let labelB="B";
let labelC="C";
labeledImages.set(labelA,imagesA);
labeledImages.set(labelB,imagesB);
labeledImages.set(labelC,imagesC);

// Take a snap from webcam by clicking on "Take Photo" button
// One function for each button A, B, C
video.takePhotoA = async function(){
  const canvas = document.getElementById('canvas-capture-a');
  const width = 200;
  const height = 150;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);
  const img = canvas.toDataURL('image/png');
  const image = await faceapi.fetchImage(img);
  imagesA.push(image);
}
video.takePhotoB = async function(){
  const canvas = document.getElementById('canvas-capture-b');
  const width = 200;
  const height = 150;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);
  const img = canvas.toDataURL('image/png');
  const image = await faceapi.fetchImage(img);
  imagesB.push(image);
}
video.takePhotoC = async function(){
  const canvas = document.getElementById('canvas-capture-c');
  const width = 200;
  const height = 150;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);
  const img = canvas.toDataURL('image/png');
  const image = await faceapi.fetchImage(img);
  imagesC.push(image);
}

// Reset images for the label by clicking on "Reset" button
// One function for each button A, B, C
function resetPhotoA() {
  imagesA.length=0;
  var canvas = document.getElementById('canvas-capture-a');
  var context = canvas.getContext('2d');
  var img = context.createImageData(canvas.width, canvas.height);
  // to delete the photo on the screen
  for (var i = img.data.length; --i >= 0; )
    img.data[i] = 0;
  context.putImageData(img, 0, 0);
}
function resetPhotoB() {
  imagesB.length=0;
  var canvas = document.getElementById('canvas-capture-b');
  var context = canvas.getContext('2d');
  var img = context.createImageData(canvas.width, canvas.height);
  for (var i = img.data.length; --i >= 0; )
    img.data[i] = 0;
  context.putImageData(img, 0, 0);
}
function resetPhotoC() {
  imagesC.length=0;
  var canvas = document.getElementById('canvas-capture-c');
  var context = canvas.getContext('2d');
  var img = context.createImageData(canvas.width, canvas.height);
  for (var i = img.data.length; --i >= 0; )
    img.data[i] = 0;
  context.putImageData(img, 0, 0);
}


// // ---------------------------------------------
// // LVL1 
// // ---------------------------------------------

// Train Face Recognition after having launched the video
function train_recognition() {
  if (video_launched === undefined){
    throw new Error("Call init_webcam(); " +
        "to obtain permission to use the webcam and launch the video");
  }
  else {
    if (imagesA.length + imagesB.length + imagesC.length === 0) {
      throw new Error("No photos in the database yet. "+
      "Take snapshot for each person in the Face API Display to create your database");
    }
    else{
      train();
      return "face recognition training progress"
    }
  }
}

async function train() {
  if (video_launched === true){
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }
  video.removeEventListener('play', await eventListener);
  const maxDescriptorDistance = 0.6;
  const labeledFaceDescriptors = await trainLabeledImages();
  faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
  if (video_launched === true){
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }
  video.addEventListener('play', eventListener);
}

async function eventListener() {
  const canvas = document.getElementById('canvas')
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  // common sizes are 128, 160, 224, 320, 416, 512, 608 (video recommend 128, 160)
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
  }, 50)
}

async function trainLabeledImages(){
  const labels = Array.from(labeledImages.keys());
  var labelsNoZero = [];
  // Remove labels with no images
  labels.forEach(function(label) {
    if (labeledImages.get(label).length!=0) {
      labelsNoZero.push(label);
    }
  })
  return Promise.all(
    labelsNoZero.map(async label => {
      const descriptions = [];
      const imageList = labeledImages.get(label);
      for (let i = 0 ; i <= imageList.length -1 ; i++) {
          const detections = await faceapi.detectSingleFace(imageList[i]).withFaceLandmarks().withFaceDescriptor()
          if (!detections) {
            throw new Error(`no faces detected for ${label} image ${i+1}`)
          }
          descriptions.push(detections.descriptor)
      }
      loaded_images=true
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}


// // ---------------------------------------------
// // Face API - Do It yourself
// // LVL2 - Code with high level functions
// // ---------------------------------------------


let labeledFaceDescriptors;
let loaded_images= undefined
function encode_webcam_database() {
  if (video_launched === undefined){
    throw new Error("Call 'init_webcam();' to enable the webcam. Then, " +
    "take snapshot for each person in the Face API Display to create your database");
  }
  else if (imagesA.length + imagesB.length + imagesC.length === 0) {
    throw new Error("No photos in the database yet. "+
    "Take snapshot for each person in the Face API Display to create your database");
  }
  else{
  face_descriptors();
  return () => {
    if (loaded_images === undefined) {
  throw new Error("encoding still in progress")
    } else {
      return labeledFaceDescriptors
    }
  };
  }
}

async function face_descriptors(){
  labeledFaceDescriptors = await trainLabeledImages();
}


function face_matcher(encoded_images, maxDescriptorDistance) {
  if (Array.isArray(encoded_images)){
    return new faceapi.FaceMatcher(encoded_images, maxDescriptorDistance);
  }
  // if encoded_images not an array
  else{
    throw new Error("encoded_images should be an array containing the encoded database")
  }
}

function video_detect_faces(face_matcher) {
  detect(face_matcher);
  return "detection activated"
}
let faceMatcher;
async function detect(face_matcher) {
  if (video_launched === true){
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }
  // remove former detection
  video.removeEventListener('play', await eventListener);
  faceMatcher=face_matcher;
  if (video_launched === true){
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }
  // add new detection
  video.addEventListener('play', eventListener);
}


// // ---------------------------------------------
// // Face API - Do It yourself 
// // LVL3 - LVL3bis - Detail each function
// // ---------------------------------------------

// Get the labels of the pictures database
function get_labels() {
  return (Array.from(labeledImages.keys()))
}

// Get the labels which have at least one image in the database
function get_nonnull_labels() {
  const labels = get_labels();
  var labelsNonNull = [];
  // Remove labels with no images
  labels.forEach(function(label) {
    if (labeledImages.get(label).length!=0) {
      labelsNonNull.push(label);
    }
  })
  return labelsNonNull
}

// Change the label name
function change_label(formerLabel, newLabel) {
  if (typeof formerLabel === "string" && typeof newLabel === "string") {
    const labels = get_labels();
    if (labels.includes(formerLabel)) {
      const images = labeledImages.get(formerLabel)
      labeledImages.delete(formerLabel);
      labelA = newLabel
      labeledImages.set(newLabel, images);
      return ("label '" + formerLabel + "' changed to '" + labelA + "'")
    }
    else {
      throw new Error("Label "+ formerLabel + " doesn't exist");
    }
  }
  else {
    throw new Error("Parameters needs to be string elements");
  } 
}


// Get the images for one particular label
function get_images(label) {
  return (labeledImages.get(label))
}

// Encode image - calculate embeddings from faceAPI model
// Lists and iteration for calculations in for loops and deal with asynchronism
let list_encoded = [];
let calculation_embeddings = [];
let iteration = -1;
let errorDetection = undefined
// ask for label in parameter to return error for the concerned
// label if we can't detect face on the picture
function encode_single_face(image,label) {
  list_encoded.push(undefined)
  iteration = iteration + 1;
  const i = iteration
  calc_embeddings(image,i,label);
  return () => {
    if (list_encoded[i] === undefined) {
      throw new Error("encoding image still in progress")
        }
    else if (errorDetection !== undefined){
      throw new Error(`no faces detected for ${errorDetection}, reset database for ${errorDetection} and start again`)
    }
    else {
      return calculation_embeddings[i];
    }
  };
}

async function calc_embeddings(image,i,label) {
  const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
  // change errorDetection value to the label on which we can't detect a face 
  //  on the database to return an error in function encode_image
  if (!detections) {
    errorDetection=label;
  }
  calculation_embeddings.push(detections.descriptor);
  list_encoded[i]=true;
}

// Store embeddings in a labeled map
function store_embeddings(L, label, descriptions) {
  let labeled_embeddings ={};
  labeled_embeddings._label = label;
  labeled_embeddings._descriptors = descriptions;
  L.push(labeled_embeddings);
}

// Convert the stored functions embedding labeled into a labeled map with the value of these functions
function get_embeddings(functions_embeddings){
  T=[]
  functions_embeddings.forEach(function(functions_embeddings_one_label){
    descriptions=[];
    label=functions_embeddings_one_label._label;
    functions_embeddings_one_label._descriptors.forEach(function(embeddings){
      descriptions.push(embeddings())
    });
    T.push(new faceapi.LabeledFaceDescriptors(label, descriptions))
  });
  return T
}

// Functions to calculate and draw the detection on video
// get canvas video
function get_canvas_video() {
return document.getElementById('canvas')
}

function get_video_height() {
return video.height
}

function get_video_width() {
return video.width
}

function display_size(heightVideo, widthVideo) {
return { width: widthVideo, height: heightVideo }
}

function match_dimensions(canvas, displaySize) {
faceapi.matchDimensions(canvas, displaySize);
}

function set_interval(myFunction, time) {
setInterval(myFunction, time);
}

function add_event_video(actionVideo){
  if (video_launched === undefined){
    throw new Error("Call init_webcam(); " +
        "to obtain permission to use the webcam and launch the video "+
        "before adding an event on the video");
  }
  else {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
    video.addEventListener('play', actionVideo);
  }
}

let detect_faces=undefined
let faces
// without parameters for detection
function detect_all_faces_video2() {
  detect_faces=undefined
  async_detect_all_faces_video2();
  return () => {
    if (detect_faces === true) {
      return faces
    }
  }
}

// add parameters for detection
function detect_all_faces_video(detectionType, option, parameters) {
  detect_faces=undefined
  async_detect_all_faces_video(detectionType, option, parameters);
  return () => {
    if (detect_faces === true) {
      return faces
    }
  }
}

async function async_detect_all_faces_video2() {
  // common sizes are 128, 160, 224, 320, 416, 512, 608 (video recommend 128, 160, 224)
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
  faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceDescriptors();
  detect_faces=true;
}

async function async_detect_all_faces_video(detectionType, option, parameters) {
  // all different cases for detection
  switch (detectionType){
    case "withFaceDescriptors":
      switch (option) {
        case "tinyFaceDetector":
          if (parameters.length === 0) {
            const options = new faceapi.TinyFaceDetectorOptions()
            faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceDescriptors();
            detect_faces=true;
            return
          }
          else {
            const options = new faceapi.TinyFaceDetectorOptions({ inputSize: parameters[0], scoreThreshold: parameters[1]})
            faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceDescriptors();
            detect_faces=true;
            return
          }
        case "ssdMobilenetv1":
          if (parameters.length === 0) {
            const options = new faceapi.SsdMobilenetv1Options()
            faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceDescriptors();
            detect_faces=true;
            return
          }
          else {
            const options = new faceapi.SsdMobilenetv1Options({ minConfidence: parameters[0], maxResults: parameters[1]})
            faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceDescriptors();
            detect_faces=true;
            return
          }
      }
    case "withFaceLandmarks":
        switch (option) {
          case "tinyFaceDetector":
            if (parameters.length === 0) {
              const options = new faceapi.TinyFaceDetectorOptions()
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks();
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.TinyFaceDetectorOptions({ inputSize: parameters[0], scoreThreshold: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks();
              detect_faces=true;
              return
            }
          case "ssdMobilenetv1":
            if (parameters.length === 0) {
              const options = new faceapi.SsdMobilenetv1Options()
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks();
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.SsdMobilenetv1Options({ minConfidence: parameters[0], maxResults: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks();
              detect_faces=true;
              return
            }
        }
      case "simpleDetection":
        switch (option) {
          case "tinyFaceDetector":
            if (parameters.length === 0) {
              const options = new faceapi.TinyFaceDetectorOptions()
              faces = await faceapi.detectAllFaces(video, options);
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.TinyFaceDetectorOptions({ inputSize: parameters[0], scoreThreshold: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options);
              detect_faces=true;
              return
            }
          case "ssdMobilenetv1":
            if (parameters.length === 0) {
              const options = new faceapi.SsdMobilenetv1Options()
              faces = await faceapi.detectAllFaces(video, options);
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.SsdMobilenetv1Options({ minConfidence: parameters[0], maxResults: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options);
              detect_faces=true;
              return
            }
        }
      case "withExpression":
        switch (option) {
          case "tinyFaceDetector":
            if (parameters.length === 0) {
              const options = new faceapi.TinyFaceDetectorOptions()
              faces = await faceapi.detectAllFaces(video, options).withFaceExpressions();
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.TinyFaceDetectorOptions({ inputSize: parameters[0], scoreThreshold: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options).withFaceExpressions();
              detect_faces=true;
              return
            }
          case "ssdMobilenetv1":
            if (parameters.length === 0) {
              const options = new faceapi.SsdMobilenetv1Options()
              faces = await faceapi.detectAllFaces(video, options).withFaceExpressions();
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.SsdMobilenetv1Options({ minConfidence: parameters[0], maxResults: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options).withFaceExpressions();
              detect_faces=true;
              return
            }
        }
      case "withAge&Gender":
        switch (option) {
          case "tinyFaceDetector":
            if (parameters.length === 0) {
              const options = new faceapi.TinyFaceDetectorOptions()
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withAgeAndGender();
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.TinyFaceDetectorOptions({ inputSize: parameters[0], scoreThreshold: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withAgeAndGender();
              detect_faces=true;
              return
            }
          case "ssdMobilenetv1":
            if (parameters.length === 0) {
              const options = new faceapi.SsdMobilenetv1Options()
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withAgeAndGender();
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.SsdMobilenetv1Options({ minConfidence: parameters[0], maxResults: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withAgeAndGender();
              detect_faces=true;
              return
            }
        }
      case "all":
        switch (option) {
          case "tinyFaceDetector":
            if (parameters.length === 0) {
              const options = new faceapi.TinyFaceDetectorOptions()
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors();
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.TinyFaceDetectorOptions({ inputSize: parameters[0], scoreThreshold: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors();
              detect_faces=true;
              return
            }
          case "ssdMobilenetv1":
            if (parameters.length === 0) {
              const options = new faceapi.SsdMobilenetv1Options()
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors();
              detect_faces=true;
              return
            }
            else {
              const options = new faceapi.SsdMobilenetv1Options({ minConfidence: parameters[0], maxResults: parameters[1]})
              faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors();
              detect_faces=true;
              return
            }
        }  
}
  // common sizes are 128, 160, 224, 320, 416, 512, 608 (video recommend 128, 160, 224)
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
  faces = await faceapi.detectAllFaces(video, options).withFaceLandmarks().withFaceDescriptors();
  detect_faces=true;
}


function resize_results(detections,displaySize) {
return faceapi.resizeResults(detections, displaySize)
}
function get_descriptors(detection){
return detection.descriptor
}

function find_best_match(face_matcher, descriptor) {
return face_matcher.findBestMatch(descriptor)
}

function draw_box(detection, result, canvas) {
const box = detection.detection.box;
const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
drawBox.draw(canvas);
}

function draw_detections(canvas, resizedDetections) {
  faceapi.draw.drawDetections(canvas, resizedDetections);
}

function draw_landmarks(canvas, resizedDetections) {
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
}

function draw_expressions(canvas, resizedDetections) {
  faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
}

function draw_age_gender(canvas, resizedDetections){
  // find the good syntax, it's not the good one
  faceapi.draw.drawWithAge(canvas, resizedDetections);
}

function get_context(canvas) {
canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
}

function detection_done(){
if (detect_faces === true) {
  return true
}
else{
  return false
}
}

function set_timeout(myFunction,time) {
setTimeout(myFunction,time);
}

// value of setTimeout fixed to 150ms
const do_after_detection_timeout = 150;
// explain choice
function do_after_detection(myFunction) {
  setTimeout(() => {
    if (detect_faces === true){
      myFunction();
    }
  }, do_after_detection_timeout)       
}

// function push in array
function array_push(array, element) {
  array.push(element);
}

// function num to string
function to_string(num){
  return num.toString();
}


// // ---------------------------------------------
// // Face API - Detect glasses application 
// // ---------------------------------------------


// get the position of the faces detected
function box_faces(resizedDetection) {
  var boxes = [];
  resizedDetection.forEach(function(detection) {
    const box = detection._box;
    const box_position = [box._height, box._width, box._x, box._y];
    boxes.push(box_position);
  })
  return boxes
}

// take images of faces detected
function convert_to_img(boxes) {
  var images = [];
  // to store snap of the webcam
  var hiden_canvas=document.getElementById('hiden-canvas');
  boxes.forEach(function(box) {
    const height = box[0];
    const width = box[1];
    const x = box[2];
    const y = box[3];
    var hidenContext = hiden_canvas.getContext('2d');
    hidenContext.drawImage(video, 0 , 0, 400, 300);
    var imgData = hidenContext.getImageData(x, y, width, height);
    images.push(imgData);
  })
  return images;
}

// convert box dimension of a face detected to its snap image of the video canva
function convert_to_image(box) {
  // to store snap of the webcam
  var hiden_canvas=document.getElementById('hiden-canvas');
  hiden_canvas.width = video.width;
  hiden_canvas.height = video.height;
  const height = box[0];
  const width = box[1];
  const x = box[2];
  const y = box[3];
  var hidenContext = hiden_canvas.getContext('2d');
  hidenContext.drawImage(video, 0 , 0, 400, 300);
  var imgData = hidenContext.getImageData(x, y, width, height);
  return imgData;
}



// classify each image of a list with mobilenet
async function classify_images(images){
  // Make a prediction through the model on each image
  images.forEach(async function(img) {
    const result = await mobileNet.classify(img);
    console.log( 
      'prediction: '+ result[0].className + '\n' +
      'probability: '+ result[0].probability
    );
    console.log(result);

    const xlogits = mobileNet.infer(img, 'conv_preds');
    console.log('Predictions:');
    const result2 = await classifier.predictClass(xlogits);
    console.log(result2);


  })
}

// train KNN over mobilnet inference on an online stored database
async function train_glasses_detection(classifier) {
  const labels = ['glasses', 'no_glasses'];
  return Promise.all(
    labels.map(async label => {
      for (let i = 1; i <= 3; i++) {
        const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/aurelcomp/Database/master/glasses_detection/${label}/${i}.png`)
        console.log('loaded')
        const logits = await mobileNet.infer(img, 'conv_preds');
        if (label=='glasses'){
          classifier.addExample(logits, 1);
          console.log('added to KNN glasses')
        }
        else {
          classifier.addExample(logits, 0);
          console.log('added to KNN no glasses')
        }
        
      }
    })
  )
}


// Draw custom box with text
function draw_custom_box( box, text, myCanvas){
  const myBox = { x: box[2], y: box[3], width: box[1], height: box[0] }
  // see DrawBoxOptions below
  const drawOptions = {
  label: text,
  lineWidth: 2
  }
  const drawBox = new faceapi.draw.DrawBox(myBox, drawOptions)
  drawBox.draw(myCanvas)
}


// fetch image from url
// Lists and iteration for calculations in for loops and deal with asynchronism
let list_verification_loaded = [];
let images_loaded = [];
let iteration_load = -1;
function fetch_image(url){
  list_verification_loaded.push(undefined)
  iteration_load = iteration_load + 1;
  const i = iteration_load;
  fetch_image_async(url, i);
  return () => {
    if (list_verification_loaded[i] === undefined) {
      throw new Error("image still loading")
        }
    else {
      return images_loaded[i];
    }
  };
}
async function fetch_image_async(url, i){
  const image = await faceapi.fetchImage(url);
  // To convert image to dataImage 
  // Otherwise we have problem on the Source Academy
  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  var context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  images_loaded.push(imageData);
  list_verification_loaded[i] = true;
}

// convert int to string
// needed for modifying url to select images
function int_to_string(number){
  return number.toString();
}

