var total = 60;

var valueIn = -0.5;
var valueOut = 1.5;
var valueRange = valueOut - valueIn;

var labels = '';
var ruler = '';

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

var cursorChar = '☞';
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
		str += nextChar;
		lastValue = value;
	};
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
}, 1500);

setTimeout(function() {
	spaceshipValue.setDestinationAndThrust(1, 0.001);
}, 4500);

setInterval(function() {
	update();
}, 30);

spaceshipValue.setDestinationAndThrust(1, 0.002);
