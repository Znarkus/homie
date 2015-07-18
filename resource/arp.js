var logger = require('just-log');
var childProcess = require('child_process');
var cmd = 'arp --device eth1 --numeric | grep 10.0.0.72';

setInterval(function () {
	childProcess.exec(cmd, function (e, o) {
		logger.info(o.trim());
	});
}, 30000);
