
// // ---------------------------------------------
// // Face API - Do It yourself 
// // ---------------------------------------------



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
  labeledImages.set(LabelC,imagesC);
  
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
  
  
  let faceMatcher;
  // Train Face Recognition when clicking on "Train Recognition button"
  video.trainRecognition = async function () {
    video.removeEventListener('play', await eventListener);
    const maxDescriptorDistance = 0.6;
    const labeledFaceDescriptors = await trainLabeledImages();
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
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
    }, 100)
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
          labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(label, descriptions);
          return labeledFaceDescriptors
      })
    )
  }
  
  function get_labels() {
      return Array.from(labeledImages.keys());
  }
  
  
  
  // code for  encode labeled database
  let L=[];
  function encode(){
    const labels = get_nonnull_labels();
    // for each label
  
    for (let i = 0; i < array_length(labels); i = i+1){
      const label = labels[i];
      const images_label = get_images(label);
      const descriptions = [];
      // for each image in label
      for (let j = 0; j < array_length(images_label); j = j+1){
        const image = images_label[j];
        const detections = encode_image(image);
        descriptions[j]=detections;
      }
    store_embeddings(L, label, descriptions);
    }
  }
  //const T = get_embeddings(L);
  
  // code for detect faces from face_matcher
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
        set_timeout(() => {
          if (detection_done() === true) {
            const resizedDetections = resize_results(detections(),myDisplaySize);
            get_context(myCanvas);
            for (let i =0; i < array_length(resizedDetections); i=i+1){
              const detection = resizedDetections[i];
              const detection_descriptor = get_descriptors(detection);
              const result =find_best_match(face_matcher,detection_descriptor);
              draw_box(detection, result, myCanvas);
            }
          }
          else{
              
          }
        }, 200*0.99); 
      },200);
    }
    add_event_video(eventVideo);
  }
  
  
  