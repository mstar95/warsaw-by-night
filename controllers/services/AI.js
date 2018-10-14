const synaptic = require('synaptic');
const network = new synaptic.Architect.Perceptron(2,3,1);

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
    input.push(userMood)
    const trainingSet = [
        {
            input: input,
            output: [sign]
        }]
    // learn
    let trainer = new synaptic.Trainer(network)
    
    trainer.train(trainingSet, opt);
}
const opt = {
	rate: 1,
	iterations: 1000,
	error: .02,
	shuffle: true,
	log: 1000,
	cost: synaptic.Trainer.cost.CROSS_ENTROPY
}