var childProcess = require('child_process');
var debug = require('debug')('iphone');

Iphone.prototype.iphoneHasBeenSeen = iphoneHasBeenSeen;
Iphone.prototype.iphoneIsAway = iphoneIsAway;
Iphone.prototype.processNmapOutput = processNmapOutput;

module.exports = Iphone;

///////////////

function Iphone(config, callbacks, logger) {
	var _this = this;
	var cmd = 'nmap -p 62078 ' + config.ip + ' | grep "62078/tcp open"';

	this.config = config;
	this.callbacks = callbacks;
	this.logger = logger || {
		debug: function () {}
	};

    // Fake that the iPhone has been seen as an initial value
    this.iphoneLastSeen = new Date();

    // Start loop
	setInterval(function () {
		childProcess.exec(cmd, function(error, output) {
			_this.processNmapOutput(error, output);
		});
	}, 5000);
}

function processNmapOutput(error, output) {
	var _this = this;
	
	// If iPhone spotted on wifi
	if (iphoneIsActive(output)) {
		// Debug log
		debug('iPhone is active (last active=%s)', _this.iphoneWasActiveLastInterval);
		if (_this.iphoneWasActiveLastInterval === false) _this.logger.debug('iPhone found');
		
		this.iphoneHasBeenSeen();
		_this.iphoneWasActiveLastInterval = true;

	// If iPhone is not on wifi
	} else {
		// Debug log
		debug('iPhone can\'t be seen (last active=%s)', _this.iphoneWasActiveLastInterval);
		if (_this.iphoneWasActiveLastInterval === true) _this.logger.debug('iPhone lost');

		if (_this.iphoneIsAway()) {
            if (!_this.iphoneWasAwayPreviousRun) {
                // If Iphone just disappeared
                _this.callbacks.left();
            }

            _this.iphoneWasAwayPreviousRun = true;
		} else {
            _this.iphoneWasAwayPreviousRun = false;
        }

		_this.iphoneWasActiveLastInterval = false;
	}
}

function iphoneIsActive(nmapOutput) {
	return nmapOutput.trim() !== '';
}

function iphoneHasBeenSeen() {
	// If was away but is now found
	if (this.iphoneIsAway()) {
		this.callbacks.returned();
	}

	this.iphoneLastSeen = new Date();
}

function iphoneIsAway() {
	// last seen + 40 minutes >= now
	return this.iphoneLastSeen !== undefined && new Date(this.iphoneLastSeen.getTime() + 50 * 60000) <= new Date();
}
