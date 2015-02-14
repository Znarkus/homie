var childProcess = require('child_process');

Iphone.prototype.iphoneHasBeenSeen = iphoneHasBeenSeen;
Iphone.prototype.iphoneIsAway = iphoneIsAway;
//Iphone.prototype.iphoneLastSeen = iphoneLastSeen;
Iphone.prototype.withinOperationHours = withinOperationHours;

module.exports = { Iphone: Iphone };

///////////////

function Iphone(config, callbacks) {
	this.config = config;
	this.callbacks = callbacks;

	var _this = this;
	var cmd = 'nmap -p 62078 ' + _this.config.ip + ' | grep "62078/tcp open"';
	var iphoneWasAwayLast;

	setInterval(function () {
		childProcess.exec(cmd, function (e, o) {
			if (o.trim() !== '') {
				// Wifi active
				_this.iphoneHasBeenSeen();
				iphoneWasAwayLast = false;
			} else {
				// Wifi not active
				if (_this.iphoneIsAway() && iphoneWasAwayLast !== undefined && !iphoneWasAwayLast) {
					// Iphone just disappeared
					if (_this.withinOperationHours()) {
						_this.callbacks.leave();
					}
				}

				iphoneWasAwayLast = true;
			}
		});
	}, 5000);
}

function iphoneHasBeenSeen() {
	// If was away but is now found
	if (this.iphoneIsAway()) {
		if (this.withinOperationHours()) {
			this.callbacks.return();
		}
	}

	this.iphoneLastSeen = new Date();
}

function withinOperationHours(now) {
	now = now || new Date();
	return now.getHours() > 7 && now.getHours() < 22;
}

function iphoneIsAway() {
	// last seen + 20 minutes >= now
	return this.iphoneLastSeen !== undefined && new Date(this.iphoneLastSeen.getTime() + 20 * 60000) <= new Date();
}