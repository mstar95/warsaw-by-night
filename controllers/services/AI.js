const synaptic = require('synaptic');
const network = new synaptic.Architect.Perceptron(6,6,1);

exports.scoreActivity = (options, userMood = 0) => {

    // move
    const input = Object.entries(options).map(([tag, val]) => val)
    input.push(userMood)

    var output = network.activate(input);
    return output;
}

exports.train = (options, userMood = 0, ok = true) => {

    const sign = ok === true ? 1 : 0
    const input = Object.entries(options).map(([tag, val]) => val)
    input.push(userMood);

    network.activate(input);
    network.propagate(.3, [sign]);
}