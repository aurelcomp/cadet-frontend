// Create a sequential model
function tf_createModel() {
    return tf.sequential(); 
}

// Add a input layer layer
function tf_addInputLayer(model, input_shape, neurons, bias) {
    model.add(tf.layers.dense({inputShape: input_shape, units: neurons, useBias: bias}));
    return model
}

// Add a hidden layer
function tf_addHiddenLayer(model, neurons, bias) {
    model.add(tf.layers.dense({units: neurons, useBias: bias}));
    return model
}

