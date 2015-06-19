var total = 60;

var valueIn = -0.5;
var valueOut = 1.5;
var valueRange = valueOut - valueIn;

var labels = '';
var ruler = '';

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

var marks = [
	[-1, '+'],
	[0, '+'],
	[1, '+']
]

function noop(){}

var SpaceshipValue = require('./');

var spaceshipValue = new SpaceshipValue();

var lastValue = valueIn;
for (var i = 0; i <= total; i++) {
	var ratio = i / total;
	var value = ratio * valueRange + valueIn;
	var nextCharRuler = '-';
	var nextCharlabel = ' ';
	marks.forEach(function(mark) {
		if(mark[0] > lastValue && mark[0] <= value) {
			nextCharRuler = mark[1];
			nextCharlabel = mark[0].toString();
		}
	});
	ruler += nextCharRuler;
	labels += nextCharlabel;
	var labelBacktrack = ruler.length - ~~(nextCharlabel.length * 0.5);
	if(labelBacktrack >= ruler.length) {
		labels = labels.substr(0, labelBacktrack);
	}
	lastValue = value;
}

var cursorChar = '•';
var destinationChar = '☉';
var filledChar = '◉';
var tick = 0;
function update() {
	console.log('\033[2J');
	tick++;
	console.log('tick:', tick);
	spaceshipValue.update();
	var str = '';
	var lastValue = valueIn;
	for (var i = 0; i <= total; i++) {
		var ratio = i / total;
		var value = ratio * valueRange + valueIn;
		var nextChar = ' ';
		if(spaceshipValue.cursor > lastValue && spaceshipValue.cursor <= value) {
			nextChar = cursorChar;
		}
		if(spaceshipValue.destination > lastValue && spaceshipValue.destination <= value) {
			if(nextChar == cursorChar) {
				nextChar = filledChar;
			} else {
				nextChar = destinationChar;
			}
		}
		str += nextChar;
		lastValue = value;
	};
	if(spaceshipValue.thrust !== 0) {
		var index = str.indexOf(cursorChar);
		// if(index === -1) index = str.indexOf(filledChar);
		if(index !== -1) {
			if(spaceshipValue.thrustDirection > 0) {
				str = str.replaceAt(index, '☞');
			} else if(spaceshipValue.thrustDirection < 0) {
				str = str.replaceAt(index, '☜');
			}
		}
	}
	console.log(labels);
	console.log(ruler);
	console.log(str);
	console.log('origin:', spaceshipValue.origin);
	console.log('halfway:', spaceshipValue.halfway);
	console.log('destination:', spaceshipValue.destination);
	console.log('thrust:', spaceshipValue.thrust);
	console.log('velocity:', spaceshipValue.velocity);
	console.log('cursor:', spaceshipValue.cursor);
}

setTimeout(function() {
	spaceshipValue.setDestinationAndThrust(0, 0.004);
}, 800);

setTimeout(function() {
	spaceshipValue.setDestinationAndThrust(1, 0.001);
}, 1300);

setInterval(function() {
	update();
}, 30);

spaceshipValue.setDestinationAndThrust(1, 0.002);
