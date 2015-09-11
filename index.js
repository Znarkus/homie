var express = require('express');
var app = express();
//var telldus = require('telldus');
var childProcess = require('child_process');
var logger = require('just-log');
var Path = require('path');
var config = require('./config');
var Iphone = require('./iphone.js');
var currentSetting;


activate();

////////////////////



function runCommand(commands, cb) {
	var cmd = 'tdtool';

	commands.forEach(function (v) {
		cmd += ' --' + v.command;

		if (v.param) {
			cmd += ' ' + v.param;
		}
	});

	logger.debug(cmd);

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
				logger.debug(out.trim());
			}

			index += 1;
			run();
		});
	}
}

function setLampSetting(setting) {
	logger.info('Lamp setting: %s', setting);
	currentSetting = setting;
	runCommands(config.lampSettings[setting]);
}

function withinOperationHours(now) {
	now = now || new Date();
	return now.getHours() > 7 && now.getHours() < 22;
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
	var iphone;
	var remoteOffSetting;

	if (config.iphone) {
		iphone = new Iphone(config.iphone, {
			left: function () {
				logger.info('iPhone left');
				setLampSetting(config.iphone.lampSettings.left);
			},
			returned: function () {
				logger.info('iPhone returned');
				setLampSetting(config.iphone.lampSettings.returned);
			}
		}, logger);
	}

	logger.mode.debug = true;
	logger.mode.verbose = true;

	app.use(express.static(Path.resolve(__dirname, 'static')));
	app.use(express.static(Path.resolve(__dirname, 'bower_components')));

	//3	Strömbrytare vägg	ON
	//2	Taklampor	DIMMED:1
	//4	Byrå	DIMMED:192

	//1	Bordslampor	ON
	//2	Taklampor	DIMMED:1
	//3	Byrå	DIMMED:1

	app.post('/lamp-setting/:setting', function (req, res) {
		setLampSetting(req.params.setting);

		//telldus.turnOn(1);
		//telldus.dim(2, 120);
		//telldus.dim(3, 100);

		res.status(204).end();
	});

	app.post('/remote/:status', function (req, res) {
		if (req.params.status == 'off') {
			if (currentSetting != 'off') {
				remoteOffSetting = currentSetting;
			}

			setLampSetting('off');
		} else if (req.params.status == 'on') {
			if (currentSetting == 'off') {
				// If off, turn on
				setLampSetting(remoteOffSetting || 'full');
			} else if (currentSetting == 'full') {
				setLampSetting('morning');
			} else if (currentSetting == 'morning') {
				setLampSetting('full');
			}
		}

		//telldus.turnOn(1);
		//telldus.dim(2, 120);
		//telldus.dim(3, 100);

		res.status(204).end();
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














