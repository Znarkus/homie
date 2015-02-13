var express = require('express');
var app = express();
//var telldus = require('telldus');
var childProcess = require('child_process');
var logger = require('just-log');
var config = require('./config');
var iphoneLastSeen;

activate();

////////////////////

function iphoneHasBeenSeen() {
	// If was away but is now found
	if (iphoneIsAway()) {
		if (withinOperationHours()) {
			setLampSetting(config.iphone.lampSettings.return);
		}
	}

	iphoneLastSeen = new Date();
}
function withinOperationHours() {
	var now = new Date();
	return now.getHours() > 7 && now.getHours() < 22;
}

function setupIphoneScan() {
	var cmd = 'nmap -p 62078 ' + config.iphone.ip + ' | grep "62078/tcp open"';
	var iphoneWasAwayLast;

	setInterval(function () {
		childProcess.exec(cmd, function (e, o) {
			if (o.trim() !== '') {
				// Wifi active
				iphoneHasBeenSeen();
				iphoneWasAwayLast = false;
			} else {
				// Wifi not active
				if (iphoneIsAway() && iphoneWasAwayLast !== undefined && !iphoneWasAwayLast) {
					// Iphone just disappeared
					if (withinOperationHours()) {
						setLampSetting(config.iphone.lampSettings.leave);
					}
				}

				iphoneWasAwayLast = true;
			}
		});
	}, 5000);
}

function iphoneIsAway() {
	// last seen + 20 minutes >= now
	return iphoneLastSeen !== undefined && new Date(iphoneLastSeen.getTime() + 20 * 60000) >= new Date();
}

function runCommand(commands, cb) {
	var cmd = 'tdtool';

	commands.forEach(function (v) {
		cmd += ' --' + v.command;

		if (v.param) {
			cmd += ' ' + v.param;
		}
	});

	logger.info(cmd);

	childProcess.exec(cmd, cb);

	//childProcess.exec(cmd, function (error, stdout, stderr) {
}

function runCommands(commands) {
	var index = 0;

	run();

	function run() {
		if (index == commands.length) {
			return;
		}

		runCommand(commands[index], function (error, out, err) {
			if (error) {
				logger.error(err.trim());
			} else {
				logger.info(out.trim());
			}

			index += 1;
			run();
		});
	}
}

function setLampSetting(setting) {
	logger.info('Lamp setting: %s', setting);
	runCommands(config.lampSettings[setting]);
}

//function lightsMorning() {
//
//	runCommands([
//		[{command: 'on', param: config.lamps.WINDOW_LAMPS}],
//		[{command: 'dimlevel', param: 100}, {command: 'dim', param: config.lamps.CEILING_LAMPS}],
//		[{command: 'dimlevel', param: 100}, {command: 'dim', param: config.lamps.TABLE_LAMPS}]
//	]);
//}
//function lightsOff() {
//	runCommands([
//		[{command: 'off', param: config.lamps.WINDOW_LAMPS}],
//		[{command: 'off', param: config.lamps.CEILING_LAMPS}],
//		[{command: 'off', param: config.lamps.TABLE_LAMPS}]
//	]);
//}
//function lightsCozy() {
//	runCommands([
//		[{command: 'off', param: config.lamps.WINDOW_LAMPS}],
//		[{command: 'dimlevel', param: 1}, {command: 'dim', param: config.lamps.CEILING_LAMPS}],
//		[{command: 'dimlevel', param: 1}, {command: 'dim', param: config.lamps.TABLE_LAMPS}]
//	]);
//}
//function lightsFull() {
//	runCommands([
//		[{command: 'on', param: config.lamps.WINDOW_LAMPS}],
//		[{command: 'dimlevel', param: 255}, {command: 'dim', param: config.lamps.CEILING_LAMPS}],
//		[{command: 'dimlevel', param: 255}, {command: 'dim', param: config.lamps.TABLE_LAMPS}]
//	]);
//}
//function lightsCinema() {
//	runCommands([
//		[{command: 'off', param: config.lamps.WINDOW_LAMPS}],
//		[{command: 'dimlevel', param: 1}, {command: 'dim', param: config.lamps.TABLE_LAMPS}],
//		[{command: 'off', param: config.lamps.CEILING_LAMPS}]
//	]);
//}
function activate() {
	setupIphoneScan();

	app.use(express.static('static'));
	app.use(express.static('bower_components'));

	//3	Strömbrytare vägg	ON
	//2	Taklampor	DIMMED:1
	//4	Byrå	DIMMED:192

	//1	Bordslampor	ON
	//2	Taklampor	DIMMED:1
	//3	Byrå	DIMMED:1

	app.post('/lamp-setting/:setting', function (req, res) {
		setLampSetting(req.param('setting'));

		//telldus.turnOn(1);
		//telldus.dim(2, 120);
		//telldus.dim(3, 100);

		res.send('');
	});

	/*app.post('/off', function (req, res) {
		lightsOff();

		//telldus.turnOff(1);
		//telldus.turnOff(2);
		//telldus.turnOff(3);

		res.send('');
	});

	app.post('/cozy', function (req, res) {
		lightsCozy();

		//telldus.turnOff(1);
		//telldus.dim(2, 1);
		//telldus.dim(3, 1);

		res.send('');
	});

	app.post('/full', function (req, res) {
		lightsFull();

		//telldus.turnOn(1);
		//telldus.dim(2, 255);
		//telldus.dim(3, 255);

		res.send('');
	});


	app.post('/cinema', function (req, res) {
		lightsCinema();

		//telldus.turnOff(1);
		//telldus.dim(3, 1);
		//telldus.turnOff(2);

		res.send('');
	});*/

	var server = app.listen(3000, function () {

		var host = server.address().address;
		var port = server.address().port;

		logger.info('Homie is listening at http://%s:%s', host, port);

	});
}














