//Load all models when selecting FACEAPI
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('externalLibs/faceapi/models')
  ]).then(console.log('FaceAPI Models loaded'))


// Functions for loading models
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

const video = document.getElementById('video');

function launch_video(){
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  //return video
}

function face_matcher(labeledFaceDescriptors, thresold) {
  return new faceapi.FaceMatcher((labeledFaceDescriptors, thresold))
}

function media_addEventListener(media,condition, action){
  media.addEventListener(condition, action)
}

function detect() {
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
}

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




// Upload Image
const imageUpload = document.getElementById('imageUpload')



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
labeledImages.set("A",imagesA);
// labeledImages.set("B",imagesB);
// labeledImages.set("C",imagesC);

video.takePhoto = async function(){
  const canvas = document.getElementById('canvas-capture');
  const width = 200;
  const height = 150;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);
  const img = canvas.toDataURL('image/png');
  const image = await faceapi.fetchImage(img);
  imagesA.push(image)
  console.log(labeledImages.get("A"));
}




video.trainRecognition = async function () {
  const maxDescriptorDistance = 0.6;
  const labeledFaceDescriptors = await trainLabeledImages();
  console.log('Trained')
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  video.addEventListener('play', () => {
    console.log('test')
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

async function trainLabeledImages(){
  const labels = Array.from(labeledImages.keys());
  console.log(labels)
  return Promise.all(
    labels.map(async label => {
      const descriptions = [];
      const imageList = labeledImages.get(label);
      console.log(imageList)
      for (let i = 0 ; i <= imageList.length -1 ; i++) {
        console.log(imageList[i])
        const detections = await faceapi.detectSingleFace(imageList[i]).withFaceLandmarks().withFaceDescriptor()
        console.log('image calculated')
        if (!detections) {
          throw new Error(`no faces detected for ${label} image ${i+1}`)
        }
        descriptions.push(detections.descriptor)
      }
      labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(label, descriptions);
      return labeledFaceDescriptors
    })
  )
}