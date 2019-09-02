/**
 * Load a given external library, as a javascript file
 * to run in the global scope, by adding it to the DOM
 */
function dynamicallyLoadScript(url) {
  var script = document.createElement('script')
  script.src = url
  /** Forces scripts to be loaded in order. */
  script.async = false
  script.defer = true
  document.head.appendChild(script)
}

/**
 * Loads all libraries, including sound and graphics.
 */
function loadAllLibs() {
  const files = [
    // list library
    '/externalLibs/list.js',
    // sound
    '/externalLibs/sound/sounds.js',
    '/externalLibs/sound/soundToneMatrix.js',
    '/externalLibs/sound/riffwave.js',
    '/externalLibs/sound/microphone.js',
    // graphics
    '/externalLibs/graphics/gl-matrix.js',
    '/externalLibs/graphics/webGLhi_graph.js',
    '/externalLibs/graphics/webGLhi_graph_ce.js',
    '/externalLibs/graphics/webGLgraphics.js',
    '/externalLibs/graphics/webGLcurve.js',
    '/externalLibs/graphics/webGLrune.js',
    // list visualizer
    '/externalLibs/visualizer/KineticJS.js',
    '/externalLibs/visualizer/visualizer.js',
    // binary tree library
    '/externalLibs/tree.js',
    // support for Practical Assessments (presently none)
    // video
    '/externalLibs/video/video_lib.js',
    /*
    Load these libraries in loadLib and not loadLibAll
    // faceAPI
    '/externalLibs/faceapi/face-api.min.js',
    '/externalLibs/faceapi/faceapi.js',
    // TensorFlow.js
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js',
    '/externalLibs/tensorflow/tensorflow.js',
    */
    // inspector
    '/externalLibs/inspector/inspector.js',
    // env visualizer
    '/externalLibs/env_visualizer/ConcreteJs.js',
    '/externalLibs/env_visualizer/visualizer.js'
  ]

  for (var i = 0; i < files.length; i++) {
    dynamicallyLoadScript(files[i])
  }
}

/**
 * Loads libraries according to the name provided.
 * This is to faciliate a lack of namespace clash for
 * graphics libraries (@see #341)
 */
function loadLib(externalLibraryName) {
  let files
  switch (externalLibraryName) {
    case 'RUNES':
      files = [
        // graphics
        '/externalLibs/graphics/gl-matrix.js',
        '/externalLibs/graphics/webGLgraphics.js',
        '/externalLibs/graphics/webGLrune.js'
      ]
      break
    case 'CURVES':
      files = [
        // graphics
        '/externalLibs/graphics/gl-matrix.js',
        '/externalLibs/graphics/webGLhi_graph.js',
        '/externalLibs/graphics/webGLhi_graph_ce.js',
        '/externalLibs/graphics/webGLgraphics.js',
        '/externalLibs/graphics/webGLcurve.js'
      ]
      break
      case 'FACEAPI':
      files = [
      // faceAPI
      '/externalLibs/faceapi/face-api.min.js',
      '/externalLibs/faceapi/faceapi.js'
      ]
      break
      case 'TENSORFLOW':
      files = [
        // TensorFlow.js
        'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js',
        'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js',
        '/externalLibs/tensorflow/tensorflow.js'
      ]
      break
    default:
      break
  }
  for (var i = 0; i < files.length; i++) {
    dynamicallyLoadScript(files[i])
  }
}

loadAllLibs()
