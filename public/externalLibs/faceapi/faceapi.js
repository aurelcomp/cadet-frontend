//Load all models when selecting FACEAPI
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('externalLibs/faceapi/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('externalLibs/faceapi/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('externalLibs/faceapi/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('externalLibs/faceapi/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('externalLibs/faceapi/models')
]).then(console.log('FaceAPI Models loaded'))


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
      for (let i = 1; i <= 4; i++) {
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





// Recognotion on one image
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




// Train Face Recognition after having launched the video
function trainRecognition() {
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
// // Code with high level functions
// // ---------------------------------------------


let labeledFaceDescriptors;
let loaded_images= undefined
function encode_images() {
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
    return "images encoded"
  }
};
}
}

async function face_descriptors(){
labeledFaceDescriptors = await trainLabeledImages();
}


function face_matcher(encoded_images, maxDescriptorDistance) {
// case low level DIY
if (Array.isArray(encoded_images)){
  return new faceapi.FaceMatcher(encoded_images, maxDescriptorDistance);
}
//case high level functions DIY
else{
return () => {
  if (loaded_images === true) {
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
    return faceMatcher
  }
};
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
// // Detail each function
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


// Get the image for one particular label
function get_images(label) {
return (labeledImages.get(label))
}

// Encode image - calculate embeddings from faceAPI model
// Lists and iteration for calculations in for loops and deal with asynchronism
let list_encoded = [];
let calculation_embeddings = [];
let iteration = -1;
function encode_image(image) {
list_encoded.push(undefined)
iteration = iteration + 1;
const i = iteration
calc_embeddings(image,i);
return () => {
  if (list_encoded[i] === undefined) {
    throw new Error("encoding image still in progress")
      }
  else {
    return calculation_embeddings[i];
  }
};
}

async function calc_embeddings(image,i) {
const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
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
if (video_launched === true){
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}
video.addEventListener('play', actionVideo);
}

let detect_faces=undefined
function detect_all_faces_video() {
detect_faces=undefined
async_detect_all_faces_video();
return () => {
  if (detect_faces === true) {
    return faces
  }
}
}
let faces
async function async_detect_all_faces_video() {
faces = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
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

function get_context(canvas) {
canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
}


function detect(face_matcher) {
function eventVideo (){
  const myCanvas = get_canvas_video();
  const width = get_video_width();
  const height = get_video_height();
  const myDisplaySize = display_size(height, width);
  match_dimensions(myCanvas, myDisplaySize);
  set_interval( () => {
    const detections = detect_all_faces_video();
    // if we want to decompose but to complex to deal with several async
    //const landmarks = landmarks(faces);
    //const detections = descriptors(landmarks);
    set_timeout(function(){
      if (detection_done() === true) {
        const resizedDetections = resize_results(detections(),myDisplaySize);
        get_context(myCanvas);
        for (let i =0; i < resizedDetections.length; i=i+1){
          const detection = resizedDetections[i];
          const detection_descriptor = get_descriptors(detection);
          const result =find_best_match(face_matcher,detection_descriptor);
          draw_box(detection, result, myCanvas);
        }
      }
    }, 200*0.99); 
  },200);
}
add_event_video(eventVideo);
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