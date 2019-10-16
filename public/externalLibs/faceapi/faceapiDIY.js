
// // ---------------------------------------------
// // Face API - Do It yourself 
// // ---------------------------------------------



// // ---------------------------------------------
// // LVL1 
// // ---------------------------------------------

// launch detection with
// init_webcam();
// train_recognition();
  
// // ---------------------------------------------
// // LVL2 - high level functions
// // ---------------------------------------------

// call the differents functions
// init_webcam();
// const e = encode_webcam_database();
// const face = face_matcher(e(),0.6);
// face;
// video_detect_faces(face);
  

// // ---------------------------------------------
// // LVL3 - code the function to encode 
// // LVL3bis - code function to detect
// // ---------------------------------------------


// code to encode labeled database
function encode(){
  let L=[];
  const labels = get_nonnull_labels();
  // for each label
  for (let i = 0; i < array_length(labels); i = i+1){
    const label = labels[i];
    const images_label = get_images(label);
    const descriptions = [];
    // for each image in label
    for (let j = 0; j < array_length(images_label); j = j+1){
      const image = images_label[j];
      const detections = encode_single_face(image);
      array_push(descriptions, detections);
    }
    store_embeddings(L, label, descriptions);
  }
  return L;
}


// without set_timeout and with do_after_detection
function detect(face_matcher) {
  function eventVideo (){
    const myCanvas = get_canvas_video();
    const width = get_video_width();
    const height = get_video_height();
    const myDisplaySize = display_size(height, width);
    match_dimensions(myCanvas, myDisplaySize);
    set_interval( () => {
      const detections = detect_all_faces_video("withFaceDescriptors","tinyFaceDetector",[]);
      do_after_detection(() => {
      const resizedDetections = resize_results(detections(),myDisplaySize);
      get_context(myCanvas);
      for (let i =0; i < array_length(resizedDetections); i=i+1){
        const detection = resizedDetections[i];
        const detection_descriptor = get_descriptors(detection);
        const result =find_best_match(face_matcher,detection_descriptor);
        draw_box(detection, result, myCanvas);
      }
      }); 
    },200);
  }
  add_event_video(eventVideo);
}

  
// code to write after by the student in the console
// const L = encode();
// to convert functions to embedding values
// const T = get_embeddings(L);
// const matcher = face_matcher(T,0.6);
// detect(matcher);


// // ---------------------------------------------
// // LVL4 - Just play with faceapi without recognition
// // ---------------------------------------------

// version without set_timeout but with
// continuation passing function
function expression() {
  function eventVideo (){
    const myCanvas = get_canvas_video();
    const width = get_video_width();
    const height = get_video_height();
    const myDisplaySize = display_size(height, width);
    match_dimensions(myCanvas, myDisplaySize);
    set_interval( () => {
      const detections = detect_all_faces_video("all","tinyFaceDetector");
      do_after_detection(() => {
          const resizedDetections = resize_results(detections(),myDisplaySize);
          get_context(myCanvas);
          draw_detections(myCanvas, resizedDetections);
          draw_landmarks(myCanvas, resizedDetections);
          draw_expressions(myCanvas, resizedDetections);
      }); 
    },200);
  }
  add_event_video(eventVideo);
}


// // ---------------------------------------------
// // LVL5 - Prepare data for tensorflow
// // ---------------------------------------------


// ------------
// preparation data from face api to tensorflow

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
      const detections = encode_single_face(image);
      array_push(data_image,detections);
      array_push(data_image,numberLabel);
      array_push(data,data_image);
    }
  }
   return data;
}

// take in arg the list previouly created to give the same list with the result of the embedding calculation
function get_embeddings(data){
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


// // ---------------------------------------------
// // LVL6 - Glasses detection 
// // ---------------------------------------------

// first version
function capture_faces() {
  function eventVideo (){
    const myCanvas = get_canvas_video();
    const width = get_video_width();
    const height = get_video_height();
    const myDisplaySize = display_size(height, width);
    match_dimensions(myCanvas, myDisplaySize);
    set_interval( () => {
      const detections = detect_all_faces_video("simpleDetection","tinyFaceDetector",[]);
      set_timeout(() => {
        if (detection_done() === true) {
          const resizedDetections = resize_results(detections(),myDisplaySize);
          get_context(myCanvas);
          console_log(resizedDetections);
          draw_detections(myCanvas, resizedDetections);
          const boxes = get_boxes(resizedDetections);
          console_log(boxes);
          const images = convert_to_img(boxes);
          console_log(images);
          classify_images(images);
        }
        else{
            
        }
      }, 200*0.99);
    },200);
  }
  add_event_video(eventVideo);
}


// 2nd version with coding the image classification
// give asynchronus problems. Thus we need to use set_timeout 
//to let the time to the program to calculate the prediction
function capture_faces2(knn) {
  function eventVideo (){
    const myCanvas = get_canvas_video();
    const width = get_video_width();
    const height = get_video_height();
    const myDisplaySize = display_size(height, width);
    match_dimensions(myCanvas, myDisplaySize);
    set_interval( () => {
      const detections = detect_all_faces_video("simpleDetection","tinyFaceDetector",[]);
      set_timeout(() => {
        if (detection_done() === true) {
          const resizedDetections = resize_results(detections(),myDisplaySize);
          get_context(myCanvas);
          const boxes = get_boxes(resizedDetections);
          for (let i=0; i < array_length(boxes) ; i=i+1){
            const box = boxes[i];
            const image = convert_to_image(box);
            const inference = infer_mobilenet(image);
            const result2 = predict_class(knn, inference);
            set_timeout(() => {
                const result = result2();
                const category = result[0];
                let label = 'unknown';
                if (category === '0'){
                    label = 'no glasses';
                }
                else {
                    label = 'glasses';
                }
                draw_custom_box(box, label, myCanvas);
            }, 300);
          }
        }
        else{
            
        }
      }, 200);
    },1000);
  }
  add_event_video(eventVideo);
}

// capture_faces2 without set_timeout and using do_after_prediction
function capture_faces2(knn) {
  function eventVideo (){
    const myCanvas = get_canvas_video();
    const width = get_video_width();
    const height = get_video_height();
    const myDisplaySize = display_size(height, width);
    match_dimensions(myCanvas, myDisplaySize);
    set_interval( () => {
      const detections = detect_all_faces_video("simpleDetection","tinyFaceDetector",[]);
      do_after_detection(() => {
          const resizedDetections = resize_results(detections(),myDisplaySize);
          get_context(myCanvas);
          const boxes = get_boxes(resizedDetections);
          for (let i=0; i < array_length(boxes) ; i=i+1){
            const box = boxes[i];
            const image = convert_to_image(box);
            const inference = infer_mobilenet(image);
            const result2 = predict_class(knn, inference);
            do_after_prediction(() => {
                const result = result2();
                const category = result[0];
                let label = 'unknown';
                if (category === '0'){
                    label = 'no glasses';
                }
                else {
                    label = 'glasses';
                }
                draw_custom_box(box, label, myCanvas);
            });
          }
      });
    },1000);
  }
  add_event_video(eventVideo);
}

// code to launch
load_mobilenet();
const knn = create_knn();
train_glasses_detection(knn);
init_webcam();
capture_faces2(knn);



// code for train KNN on online stored database
// train KNN over mobilnet inference on an online stored database
// load images first
function load_images(){
  let labeled_images=[];
  const labels = ['glasses', 'no_glasses'];
  const images_per_label = [3, 3];
  for (let i =0; i < array_length(labels); i=i+1){
    for (let j =0; j < images_per_label[i]; j=j+1){
      const label = labels[i];
      const j_string = int_to_string(j+1);
      const image = fetch_image('https://raw.githubusercontent.com/aurelcomp/Database/master/glasses_detection/' + label + '/' + j_string + '.png');
      array_push(labeled_images, [label,image]);
    }
  }
  return labeled_images;
}
// train knn in adding mobilenet inference of each image 
function train_knn(classifier, labeled_images){
  
  for (let i =0; i < array_length(labeled_images); i=i+1){
    // image is a function, we need to call it to 
    // get the loaded image
    const image = labeled_images[i][1];
    const label = labeled_images[i][0];
    const inference = infer_mobilenet(image());
    if (label==='glasses'){
      add_example_knn(classifier, inference, 1);
      console_log('added to KNN glasses');
    }
    else {
      add_example_knn(classifier, inference, 0);
      console_log('added to KNN no glasses');
    }
  }
}

// code to launch
// load_mobilenet();
// const knn = create_knn();
// const labeled_images = load_images();
// train_knn(knn, labeled_images);
// init_webcam();
// capture_faces2(knn);