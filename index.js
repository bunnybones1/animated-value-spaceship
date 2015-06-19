function noop() {}

function SpaceshipValue() {
	this.active = false;
	this.velocity = 0;
	this.thrust = 0.0005;
	this.thrustDirection = 1;
	this.cursor = 0;
	this.update = noop;
	this.destination = 0;
	this.halfway = 0;
	this.origin = 0;
	this.iterationLimit = 200;
}
var recalculateLog;
SpaceshipValue.prototype.recalculate = function() {
	if(!this.active) return;
	if(Math.abs(this.velocity) < this.thrust && Math.abs(this.cursor - this.destination) < this.thrust) {
		this.active = false;
		this.update = noop;
		return;
	}

	if(this.deferredThrust !== undefined) {
		this.thrust = this.deferredThrust;
		this.deferredThrust = undefined;
	}
	var direction = this.velocity > 0 ? 1 : -1;
	var velocityBackwards = this.velocity * -direction;
	this.origin = this.cursor;
	var iters = 0;
	while(velocityBackwards > 0) {
		iters++;
		if(iters > this.iterationLimit) {
			throw new Error('took too long to recalculate. Increase iterationLimit or thrust.');
		}
		velocityBackwards -= this.thrust * direction;
		this.origin += velocityBackwards;
	}
	this.halfway = (this.origin + this.destination) * 0.5;
	this.update = this.origin <= this.destination ? this.stepForward : this.stepBackward;

}

SpaceshipValue.prototype.stepForward = function() {
	if(this.cursor <= this.halfway) {
		this.velocity += this.thrust;
		this.thrustDirection = 1;
	} else {
		this.velocity -= this.thrust;
		this.thrustDirection = -1;
	}
	this.cursor += this.velocity;

	if(this.cursor >= this.destination || this.velocity <= 0){
		this.recalculate();
	}
}

SpaceshipValue.prototype.stepBackward = function() {
	if(this.cursor >= this.halfway) {
		this.velocity -= this.thrust;
		this.thrustDirection = -1;
	} else {
		this.velocity += this.thrust;
		this.thrustDirection = 1;
	}
	this.cursor += this.velocity;

	if(this.cursor <= this.destination || this.velocity >= 0){
		this.recalculate();
	}
}

SpaceshipValue.prototype.setDestination = function(destination) {
	this.active = true;
	this.destination = destination;
	// tick = 0;
	this.recalculate();
}

SpaceshipValue.prototype.setThrust = function(thrust) {
	this.active = true;
	this.thrust = thrust;
	this.recalculate();
}

SpaceshipValue.prototype.setDestinationAndThrust = function(destination, thrust) {
	this.active = true;
	this.destination = destination;
	this.thrust *= 2;
	this.recalculate();
	this.deferredThrust = thrust;
}

module.exports = SpaceshipValue;