//---------------------------------------------------------
// Code solution to integrate faceapi and tensorflow in worker
//---------------------------------------------------------

Canvas = HTMLCanvasElement = OffscreenCanvas;
HTMLCanvasElement.name = 'HTMLCanvasElement';
Canvas.name = 'Canvas';

function HTMLImageElement(){}
function HTMLVideoElement(){}

Image = HTMLImageElement;
Video = HTMLVideoElement;

// Canvas.prototype = Object.create(OffscreenCanvas.prototype);

function Storage () {
let _data = {};
this.clear = function(){ return _data = {}; };
this.getItem = function(id){ return _data.hasOwnProperty(id) ? _data[id] : undefined; };
this.removeItem = function(id){ return delete _data[id]; };
this.setItem = function(id, val){ return _data[id] = String(val); };
}
class Document extends EventTarget {}

let window, document = new Document();


onmessage = (event) => {
// do terrible things to the worker's global namespace to fool tensorflow
    for (let key in event.data.fakeWindow) {
        if (!self[key]) {
            self[key] = event.data.fakeWindow[key];
        } 
    }
    window = Window = self;
    localStorage = new Storage();
    // console.log('*faked* Window object for the worker', window);

    for (let key in event.data.fakeDocument) {
        if (document[key]) { continue; }

        let d = event.data.fakeDocument[key];
        // request to create a fake function (instead of doing a proxy trap, fake better)
        if (d && d.type && d.type === '*function*') {
            document[key] = function(){ console.log('FAKE instance', key, 'type', document[key].name, '(',document[key].arguments,')'); };
            document[key].name = d.name;
        } else {
            document[key] = d;
        }
    }
    // console.log('*faked* Document object for the worker', document);

    function createElement(element) {
        // console.log('FAKE ELELEMT instance', createElement, 'type', createElement, '(', createElement.arguments, ')');
        switch(element) {
            case 'canvas':
                // console.log('creating canvas');
                let canvas = new Canvas(1,1);
                canvas.localName = 'canvas';
                canvas.nodeName = 'CANVAS';
                canvas.tagName = 'CANVAS';
                canvas.nodeType = 1;
                canvas.innerHTML = '';
                canvas.remove = () => { console.log('nope'); };
                // console.log('returning canvas', canvas);
                return canvas;
            default:
                console.log('arg', element);
                break;
        }
    }

    document.createElement = createElement;
    document.location = self.location;
    // console.log('*faked* Document object for the worker', document);

    importScripts(
      'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2.7/dist/tf.min.js',  
    );

    tf.setBackend('cpu');
    console.log('tf loaded success')
    importScripts( 
      '/externalLibs/faceapi/face-api_last_version.min.js',
      '/externalLibs/faceapi/test.js'
    );
    faceTracking = new FaceTracking();
    faceTracking.startFaceTracking().then(console.log('loaded on worker'));

}

//---------------------------------------------------------
//---------------------------------------------------------

/*
//Load all models when selecting FACEAPI
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.ageGenderNet.loadFromUri('externalLibs/faceapi/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('externalLibs/faceapi/models')
]).then(console.log('FaceAPI Models loaded on worker'))

*/

console.log("worker launched");
/*
onmessage = function(event) {
    console.log("message received in the worker");
    const detectionType = event.data.detectionType;
    const option = event.data.option;
    const parameters = event.data.parameters;
    launch(detectionType, option, parameters);
  }
*/
async function launch(detectionType, option, parameters){
    console.log('detection launched')
    await async_detect_all_faces_video(detectionType, option, parameters);
    console.log('detection done')
    postMessage(detect_faces);
}



let detect_faces = undefined;
let faces;
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

