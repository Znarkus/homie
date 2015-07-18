var logger = require('just-log');
var childProcess = require('child_process');
var cmd = 'nmap -p 62078 10.0.0.73 | grep "62078/tcp open"';

setInterval(function () {
	childProcess.exec(cmd, function (e, o) {
		logger.info(o.trim());
	});
}, 5000);
