// ------------------
// Neural Network from scratch - DIY
// ------------------

const data = [
    [[0, 0], 0],
    [[1, 0], 1],
    [[0, 1], 1],
    [[1, 1], 0]
];

function activation_sigmoid(x){
    return 1 / (1 + math_exp(-x));
}

function derivative_sigmoid(x) {
    return activation_sigmoid(x) * (1 - activation_sigmoid(x));
}


let weights = [
    //i1_h1:
    math_random(),
    //i2_h1:
    math_random(), 
    //bias_h1: 
    math_random(),
    //i1_h2: 
    math_random(),
    //i2_h2: 
    math_random(),
    //bias_h2: 
    math_random(),
    //h1_o1: 
    math_random(),
    //h2_o1:
    math_random(),
    //bias_o1: 
    math_random()
];

function nn(i1, i2) {
    // define names of neuron for easier use
    const i1_h1 = weights[0];
    const i2_h1 = weights[1];
    const bias_h1 = weights[2];
    const i1_h2 = weights[3];
    const i2_h2 = weights[4];
    const bias_h2 = weights[5];
    const h1_o1 = weights[6];
    const h2_o1 = weights[7];
    const bias_o1 = weights[8];

    //calculate neurons' activation
    const h1_input = i1_h1 * i1 + i2_h1 * i2 + bias_h1;
    const h1 = activation_sigmoid(h1_input);
    const h2_input = i1_h2 * i1 + i2_h2 * i2 + bias_h2;
    const h2 = activation_sigmoid(h2_input);
    const o1_input = h1_o1 * h1 + h2_o1 * h2 + bias_o1;
    const o1 = activation_sigmoid(o1_input);
    
    return o1;
}


function results_nn() { 
    for (let i=0; i<array_length(data); i=i+1){
        // get input and output from data
        const input = data[i][0];
        const i1 = input[0];
        const i2 = input[1];
        const output = data[i][1];
        // calculate nn prediction
        const result_nn = nn(i1, i2);
        display(input, 'input: ');
        display(result_nn, 'result NN: ');
        display(output, 'expected: ');
        // for a space between 2 display
        display('---'); 
    }     
}


function error_nn() {
    let sum_square_error=0;
    for (let i=0; i<array_length(data); i=i+1){
        // get input and output from data
        const input = data[i][0];
        const i1 = input[0];
        const i2 = input[1];
        const output = data[i][1];

        // calculate nn prediction
        const result_nn = nn(i1, i2);

        // calculate squarre error between prediction and expected
        // and add it to sum value
        sum_square_error = sum_square_error + math_pow(output - result_nn, 2);
    }
    // calculate mean square error
    const mean_square_error = sum_square_error / array_length(data);
    display(mean_square_error, 'mean square error: ');
}


function one_step_train() {
    let i1_h1_delta = 0;
    let i2_h1_delta = 0;
    let bias_h1_delta = 0;
    let i1_h2_delta = 0;
    let i2_h2_delta = 0;
    let bias_h2_delta = 0;
    let h1_o1_delta = 0;
    let h2_o1_delta = 0;
    let bias_o1_delta = 0;
    
    for (let i=0; i<array_length(data); i=i+1){
        // get input and output from data
        const input = data[i][0];
        const i1 = input[0];
        const i2 = input[1];
        const output = data[i][1];

        // define names of neuron for easier use
        const i1_h1 = weights[0];
        const i2_h1 = weights[1];
        const bias_h1 = weights[2];
        const i1_h2 = weights[3];
        const i2_h2 = weights[4];
        const bias_h2 = weights[5];
        const h1_o1 = weights[6];
        const h2_o1 = weights[7];
        const bias_o1 = weights[8];

        // forward: calculate neurons' activation
        const h1_input = i1_h1 * i1 + i2_h1 * i2 + bias_h1;
        const h1 = activation_sigmoid(h1_input);
        const h2_input = i1_h2 * i1 + i2_h2 * i2 + bias_h2;
        const h2 = activation_sigmoid(h2_input);
        const o1_input = h1_o1 * h1 + h2_o1 * h2 + bias_o1;
        const o1 = activation_sigmoid(o1_input);


        // backward: learning part
        // we calculate our delta
        const delta = output - o1;
        //then we calculate our derivative (and throwing away "2 * " as we can multiply it later)
        const o1_delta = delta * derivative_sigmoid(o1_input);

        //and for our equatation w1 * h1 + w2 * h2 we're trying to alter weights first
        h1_o1_delta = h1_o1_delta + h1 * o1_delta;
        h2_o1_delta = h2_o1_delta + h2 * o1_delta;
        bias_o1_delta = bias_o1_delta + o1_delta;
        
        //and then we're trying to alter our h1 and h2.
        //but we cannot alter them directly, as they are functions of other weights too
        //so we need to alter their weights by same approach 
        
        const h1_delta = o1_delta * derivative_sigmoid(h1_input);
        const h2_delta = o1_delta * derivative_sigmoid(h2_input);
        
        i1_h1_delta = i1_h1_delta + i1 * h1_delta;
        i2_h1_delta = i2_h1_delta + i2 * h1_delta;
        bias_h1_delta = bias_h1_delta + h1_delta;
        
        i1_h2_delta = i1_h2_delta + i1 * h2_delta;
        i2_h2_delta = i2_h2_delta + i2 * h2_delta;
        bias_h2_delta = bias_h2_delta + h2_delta;      
    }

    // list of weight_deltas to update the weights then
    const weight_deltas = [
        i1_h1_delta,
        i2_h1_delta,
        bias_h1_delta,
        i1_h2_delta,
        i2_h2_delta,
        bias_h2_delta,
        h1_o1_delta,
        h2_o1_delta,
        bias_o1_delta
    ];

    // update weights
    for (let i=0; i<array_length(weights); i=i+1){
        weights[i] = weights[i] + weight_deltas[i];
    }
}


function train_for(iterations) {
    for (let i = 0; i < iterations; i=i+1){
        one_step_train();
    }
}



// ------------------------------------------------------------------------------
// Neural Network from scratch - DIY
// Build classification men/women on body dimensions
// First step - Build first NN
// ------------------------------------------------------------------------------


// input [height, arm span, shoulder width, hip width]
// output 0:man, 1: woman
const data = [
    [[1740, 1790, 465, 360], 0],
    [[1840, 1750, 565, 460], 0],
    [[1610, 1605, 395, 370], 1],
    [[1710, 1705, 410, 390], 1]
];


function activation_sigmoid(x){
    return 1 / (1 + math_exp(-x));
}

function derivative_sigmoid(x) {
    return activation_sigmoid(x) * (1 - activation_sigmoid(x));
}

// In this example, NN number of neurons:
// input=4, hiden layer 1=2, output=1
let weights = [
    //i1_h1:
    math_random(),
    //i2_h1:
    math_random(), 
    //i3_h1:
    math_random(),
    //i4_h1:
    math_random(), 
    //bias_h1: 
    math_random(),

    //i1_h2: 
    math_random(),
    //i2_h2: 
    math_random(),
    //i3_h2:
    math_random(),
    //i4_h2:
    math_random(), 
    //bias_h2: 
    math_random(),

    //h1_o1: 
    math_random(),
    //h2_o1:
    math_random(),
    //bias_o1: 
    math_random()
];

function nn(i1, i2, i3, i4) {
    // define names of neuron for easier use
    const i1_h1 = weights[0];
    const i2_h1 = weights[1];
    const i3_h1 = weights[2];
    const i4_h1 = weights[3];
    const bias_h1 = weights[4];
    const i1_h2 = weights[5];
    const i2_h2 = weights[6];
    const i3_h2 = weights[7];
    const i4_h2 = weights[8];
    const bias_h2 = weights[9];
    const h1_o1 = weights[10];
    const h2_o1 = weights[11];
    const bias_o1 = weights[12];

    //calculate neurons' activation
    const h1_input = i1_h1 * i1 + i2_h1 * i2 + i3_h1 * i3 + i4_h1 * i4 + bias_h1;
    const h1 = activation_sigmoid(h1_input);
    const h2_input = i1_h2 * i1 + i2_h2 * i2 + i3_h2 * i3 + i4_h2 * i4 + bias_h2;
    const h2 = activation_sigmoid(h2_input);
    const o1_input = h1_o1 * h1 + h2_o1 * h2 + bias_o1;
    const o1 = activation_sigmoid(o1_input);
    
    return o1;
}


function results_nn() { 
    for (let i=0; i<array_length(data); i=i+1){
        // get input and output from data
        const input = data[i][0];
        const i1 = input[0];
        const i2 = input[1];
        const i3 = input[2];
        const i4 = input[3];
        const output = data[i][1];
        // calculate nn prediction
        const result_nn = nn(i1, i2, i3, i4);
        display(input, 'input: ');
        display(result_nn, 'result NN: ');
        display(output, 'expected: ');
        // for a space between 2 display
        display('---'); 
    }     
}

function error_nn() {
    let sum_square_error=0;
    for (let i=0; i<array_length(data); i=i+1){
        // get input and output from data
        const input = data[i][0];
        const i1 = input[0];
        const i2 = input[1];
        const i3 = input[2];
        const i4 = input[3];
        const output = data[i][1];

        // calculate nn prediction
        const result_nn = nn(i1, i2, i3, i4);

        // calculate squarre error between prediction and expected
        // and add it to sum value
        sum_square_error = sum_square_error + math_pow(output - result_nn, 2);
    }
    // calculate mean square error
    const mean_square_error = sum_square_error / array_length(data);
    display(mean_square_error, 'mean square error: ');
}


function one_step_train() {
    let i1_h1_delta = 0;
    let i2_h1_delta = 0;
    let i3_h1_delta = 0;
    let i4_h1_delta = 0;
    let bias_h1_delta = 0;

    let i1_h2_delta = 0;
    let i3_h2_delta = 0;
    let i4_h2_delta = 0;
    let i2_h2_delta = 0;
    let bias_h2_delta = 0;

    let h1_o1_delta = 0;
    let h2_o1_delta = 0;
    let bias_o1_delta = 0;
    
    for (let i=0; i<array_length(data); i=i+1){
        // get input and output from data
        const input = data[i][0];
        const i1 = input[0];
        const i2 = input[1];
        const i3 = input[2];
        const i4 = input[3];
        const output = data[i][1];

        // define names of neuron for easier use
        const i1_h1 = weights[0];
        const i2_h1 = weights[1];
        const i3_h1 = weights[2];
        const i4_h1 = weights[3];
        const bias_h1 = weights[4];
        const i1_h2 = weights[5];
        const i2_h2 = weights[6];
        const i3_h2 = weights[7];
        const i4_h2 = weights[8];
        const bias_h2 = weights[9];
        const h1_o1 = weights[10];
        const h2_o1 = weights[11];
        const bias_o1 = weights[12];

        // forward: calculate neurons' activation
        const h1_input = i1_h1 * i1 + i2_h1 * i2 + i3_h1 * i3 + i4_h1 * i4 + bias_h1;
        const h1 = activation_sigmoid(h1_input);
        const h2_input = i1_h2 * i1 + i2_h2 * i2 + i3_h2 * i3 + i4_h2 * i4 + bias_h2;
        const h2 = activation_sigmoid(h2_input);
        const o1_input = h1_o1 * h1 + h2_o1 * h2 + bias_o1;
        const o1 = activation_sigmoid(o1_input);


        // backward: learning part
        // we calculate our delta
        const delta = output - o1;
        // then we calculate our derivative for the output layer
        // from formula of derivative of loss function
        const o1_delta = 2 * delta * derivative_sigmoid(o1_input);

        // we adapt weights and bias
        h1_o1_delta = h1_o1_delta + h1 * o1_delta;
        h2_o1_delta = h2_o1_delta + h2 * o1_delta;
        bias_o1_delta = bias_o1_delta + o1_delta;
        
        // then we calculate derivatives for the hiden layer
        // and adapt weights and bias
        
        const h1_delta = o1_delta * derivative_sigmoid(h1_input);
        const h2_delta = o1_delta * derivative_sigmoid(h2_input);
        
        i1_h1_delta = i1_h1_delta + i1 * h1_delta;
        i2_h1_delta = i2_h1_delta + i2 * h1_delta;
        i3_h1_delta = i3_h1_delta + i3 * h1_delta;
        i4_h1_delta = i4_h1_delta + i4 * h1_delta;
        bias_h1_delta = bias_h1_delta + h1_delta;
        
        i1_h2_delta = i1_h2_delta + i1 * h2_delta;
        i2_h2_delta = i2_h2_delta + i2 * h2_delta;
        i3_h2_delta = i3_h2_delta + i3 * h2_delta;
        i4_h2_delta = i4_h2_delta + i4 * h2_delta;
        bias_h2_delta = bias_h2_delta + h2_delta;      
    }

    // list of weight_deltas to update the weights then
    const weight_deltas = [
        i1_h1_delta,
        i2_h1_delta,
        i3_h1_delta,
        i4_h1_delta,
        bias_h1_delta,
        i1_h2_delta,
        i2_h2_delta,
        i3_h2_delta,
        i4_h2_delta,
        bias_h2_delta,
        h1_o1_delta,
        h2_o1_delta,
        bias_o1_delta
    ];

    // update weights
    for (let i=0; i<array_length(weights); i=i+1){
        weights[i] = weights[i] + weight_deltas[i];
    }
}


function train_for(iterations) {
    for (let i = 0; i < iterations; i=i+1){
        one_step_train();
    }
}


// ------------------------------------------------------------------------------
// Neural Network from scratch - DIY
// Build classification men/women on body dimensions
// Second step - Add normalisation to work
// ------------------------------------------------------------------------------

// input [height, arm span, shoulder width, hip width]
// output 0:man, 1: woman

const unormalized_data = [
    [[1740, 1790, 465, 360], 0],
    [[1840, 1750, 565, 460], 0],
    [[1610, 1605, 395, 370], 1],
    [[1710, 1705, 410, 390], 1]
];

// normalize data with gaussian normalisation
// to avoid issues in the NN
function gaussian_normalise_data(unormalized_data){
    let means = [0, 0, 0, 0];
    let deviations = [0, 0, 0, 0];
    // we calculate means first
    for (let i=0; i<array_length(unormalized_data); i=i+1){
        const input = unormalized_data[i][0];
        means[0] = means[0] + input[0];
        means[1] = means[1] + input[1];
        means[2] = means[2] + input[2];
        means[3] = means[3] + input[3];
    }
    means[0] = means[0] / array_length(unormalized_data);
    means[1] = means[1] / array_length(unormalized_data);
    means[2] = means[2] / array_length(unormalized_data);
    means[3] = means[3] / array_length(unormalized_data);
    // then we calculate deviations
    for (let i=0; i<array_length(unormalized_data); i=i+1){
        const input = unormalized_data[i][0];
        deviations[0] = deviations[0] + math_pow(input[0]-means[0], 2);
        deviations[1] = deviations[1] + math_pow(input[1]-means[1], 2);
        deviations[2] = deviations[2] + math_pow(input[2]-means[2], 2);
        deviations[3] = deviations[3] + math_pow(input[3]-means[3], 2);
    }
    deviations[0] = math_sqrt(deviations[0]);
    deviations[1] = math_sqrt(deviations[1]);
    deviations[2] = math_sqrt(deviations[2]);
    deviations[3] = math_sqrt(deviations[3]);
    // normalise data
    let normalised_data = [];
    for (let i=0; i<array_length(unormalized_data); i=i+1){
        const unormalised_input = unormalized_data[i][0];
        const output = unormalized_data[i][1];
        const normalised_input = [];
        array_push(normalised_input, (unormalised_input[0] - means[0]) / deviations[0]);
        array_push(normalised_input, (unormalised_input[1] - means[1]) / deviations[1]);
        array_push(normalised_input, (unormalised_input[2] - means[2]) / deviations[2]);
        array_push(normalised_input, (unormalised_input[3] - means[3]) / deviations[3]);
        array_push(normalised_data, [normalised_input, output]);
    }
    return normalised_data;
}

const data = normalise_data(unormalized_data);

function activation_sigmoid(x){
    return 1 / (1 + math_exp(-x));
}

function derivative_sigmoid(x) {
    return activation_sigmoid(x) * (1 - activation_sigmoid(x));
}

// In this example, NN number of neurons:
// input=4, hiden layer 1=2, output=1
let weights = [
    //i1_h1:
    math_random(),
    //i2_h1:
    math_random(), 
    //i3_h1:
    math_random(),
    //i4_h1:
    math_random(), 
    //bias_h1: 
    math_random(),

    //i1_h2: 
    math_random(),
    //i2_h2: 
    math_random(),
    //i3_h2:
    math_random(),
    //i4_h2:
    math_random(), 
    //bias_h2: 
    math_random(),

    //h1_o1: 
    math_random(),
    //h2_o1:
    math_random(),
    //bias_o1: 
    math_random()
];

function nn(i1, i2, i3, i4) {
    // define names of neuron for easier use
    const i1_h1 = weights[0];
    const i2_h1 = weights[1];
    const i3_h1 = weights[2];
    const i4_h1 = weights[3];
    const bias_h1 = weights[4];
    const i1_h2 = weights[5];
    const i2_h2 = weights[6];
    const i3_h2 = weights[7];
    const i4_h2 = weights[8];
    const bias_h2 = weights[9];
    const h1_o1 = weights[10];
    const h2_o1 = weights[11];
    const bias_o1 = weights[12];

    //calculate neurons' activation
    const h1_input = i1_h1 * i1 + i2_h1 * i2 + i3_h1 * i3 + i4_h1 * i4 + bias_h1;
    const h1 = activation_sigmoid(h1_input);
    const h2_input = i1_h2 * i1 + i2_h2 * i2 + i3_h2 * i3 + i4_h2 * i4 + bias_h2;
    const h2 = activation_sigmoid(h2_input);
    const o1_input = h1_o1 * h1 + h2_o1 * h2 + bias_o1;
    const o1 = activation_sigmoid(o1_input);
    
    return o1;
}


function results_nn() { 
    for (let i=0; i<array_length(data); i=i+1){
        // get input and output from data
        const input = data[i][0];
        const i1 = input[0];
        const i2 = input[1];
        const i3 = input[2];
        const i4 = input[3];
        const output = data[i][1];
        // calculate nn prediction
        const result_nn = nn(i1, i2, i3, i4);
        display(input, 'input: ');
        display(result_nn, 'result NN: ');
        display(output, 'expected: ');
        // for a space between 2 display
        display('---'); 
    }     
}

function error_nn() {
    let sum_square_error=0;
    for (let i=0; i<array_length(data); i=i+1){
        // get input and output from data
        const input = data[i][0];
        const i1 = input[0];
        const i2 = input[1];
        const i3 = input[2];
        const i4 = input[3];
        const output = data[i][1];

        // calculate nn prediction
        const result_nn = nn(i1, i2, i3, i4);

        // calculate squarre error between prediction and expected
        // and add it to sum value
        sum_square_error = sum_square_error + math_pow(output - result_nn, 2);
    }
    // calculate mean square error
    const mean_square_error = sum_square_error / array_length(data);
    display(mean_square_error, 'mean square error: ');
}


function one_step_train() {
    let i1_h1_delta = 0;
    let i2_h1_delta = 0;
    let i3_h1_delta = 0;
    let i4_h1_delta = 0;
    let bias_h1_delta = 0;

    let i1_h2_delta = 0;
    let i3_h2_delta = 0;
    let i4_h2_delta = 0;
    let i2_h2_delta = 0;
    let bias_h2_delta = 0;

    let h1_o1_delta = 0;
    let h2_o1_delta = 0;
    let bias_o1_delta = 0;
    
    for (let i=0; i<array_length(data); i=i+1){
        // get input and output from data
        const input = data[i][0];
        const i1 = input[0];
        const i2 = input[1];
        const i3 = input[2];
        const i4 = input[3];
        const output = data[i][1];

        // define names of neuron for easier use
        const i1_h1 = weights[0];
        const i2_h1 = weights[1];
        const i3_h1 = weights[2];
        const i4_h1 = weights[3];
        const bias_h1 = weights[4];
        const i1_h2 = weights[5];
        const i2_h2 = weights[6];
        const i3_h2 = weights[7];
        const i4_h2 = weights[8];
        const bias_h2 = weights[9];
        const h1_o1 = weights[10];
        const h2_o1 = weights[11];
        const bias_o1 = weights[12];

        // forward: calculate neurons' activation
        const h1_input = i1_h1 * i1 + i2_h1 * i2 + i3_h1 * i3 + i4_h1 * i4 + bias_h1;
        const h1 = activation_sigmoid(h1_input);
        const h2_input = i1_h2 * i1 + i2_h2 * i2 + i3_h2 * i3 + i4_h2 * i4 + bias_h2;
        const h2 = activation_sigmoid(h2_input);
        const o1_input = h1_o1 * h1 + h2_o1 * h2 + bias_o1;
        const o1 = activation_sigmoid(o1_input);


        // backward: learning part
        // we calculate our delta
        const delta = output - o1;
        // then we calculate our derivative for the output layer
        // from formula of derivative of loss function
        const o1_delta = 2 * delta * derivative_sigmoid(o1_input);

        // we adapt weights and bias
        h1_o1_delta = h1_o1_delta + h1 * o1_delta;
        h2_o1_delta = h2_o1_delta + h2 * o1_delta;
        bias_o1_delta = bias_o1_delta + o1_delta;
        
        // then we calculate derivatives for the hiden layer
        // and adapt weights and bias
        
        const h1_delta = o1_delta * derivative_sigmoid(h1_input);
        const h2_delta = o1_delta * derivative_sigmoid(h2_input);
        
        i1_h1_delta = i1_h1_delta + i1 * h1_delta;
        i2_h1_delta = i2_h1_delta + i2 * h1_delta;
        i3_h1_delta = i3_h1_delta + i3 * h1_delta;
        i4_h1_delta = i4_h1_delta + i4 * h1_delta;
        bias_h1_delta = bias_h1_delta + h1_delta;
        
        i1_h2_delta = i1_h2_delta + i1 * h2_delta;
        i2_h2_delta = i2_h2_delta + i2 * h2_delta;
        i3_h2_delta = i3_h2_delta + i3 * h2_delta;
        i4_h2_delta = i4_h2_delta + i4 * h2_delta;
        bias_h2_delta = bias_h2_delta + h2_delta;      
    }

    // list of weight_deltas to update the weights then
    const weight_deltas = [
        i1_h1_delta,
        i2_h1_delta,
        i3_h1_delta,
        i4_h1_delta,
        bias_h1_delta,
        i1_h2_delta,
        i2_h2_delta,
        i3_h2_delta,
        i4_h2_delta,
        bias_h2_delta,
        h1_o1_delta,
        h2_o1_delta,
        bias_o1_delta
    ];

    // update weights
    for (let i=0; i<array_length(weights); i=i+1){
        weights[i] = weights[i] + weight_deltas[i];
    }
}


function train_for(iterations) {
    for (let i = 0; i < iterations; i=i+1){
        one_step_train();
    }
}