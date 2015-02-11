var express = require('express');
var app = express();
//var telldus = require('telldus');
var childProcess = require('child_process');
var logger = require('just-log');

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
		//console.log('stdout: ' + stdout);
		//console.log('stderr: ' + stderr);
		//if (error !== null) {
		//	console.log('exec error: ' + error);
		//}

	//});
}

function runCommands(commands) {
	var index = 0;

	run();

	function run() {
		if (index == commands.length) {
			return;
		}

		runCommand(commands[index], function (error, out) {
			logger.info(out.trim());
			index += 1;
			run();
		});
	}
}

//runCommand([
//	{ command: 'list' }
//]);

//runCommands([
//	[ { command: 'on', param: 3 } ],
//	[ { command: 'dimlevel', param: 1 }, { command: 'dim', param: 2 } ]
//]);

//runCommand([
//	{ command: 'dimlevel', param: 255 },
//	{ command: 'dim', param: 2 }
//]);


//telldus.getDevices(function(err,devices) {
//	if ( err ) {
//		console.log('Error: ' + err);
//	} else {
//		// A list of all configured devices is returned
//		console.log('DEVICES:');
//		console.log(devices);
//	}
//});


app.use(express.static('static'));
app.use(express.static('bower_components'));

//3	Strömbrytare vägg	ON
//2	Taklampor	DIMMED:1
//4	Byrå	DIMMED:192

//1	Bordslampor	ON
//2	Taklampor	DIMMED:1
//3	Byrå	DIMMED:1

app.post('/morning', function (req, res) {
	runCommands([
		[ { command: 'on', param: 3 } ],
		[ { command: 'dimlevel', param: 100 }, { command: 'dim', param: 2 } ],
		[ { command: 'dimlevel', param: 100 }, { command: 'dim', param: 4 } ]
	]);

	//telldus.turnOn(1);
	//telldus.dim(2, 120);
	//telldus.dim(3, 100);

	res.send('');
});

app.post('/off', function (req, res) {
	runCommands([
		[ { command: 'off', param: 2 } ],
		[ { command: 'off', param: 3 } ],
		[ { command: 'off', param: 4 } ]
	]);

	//telldus.turnOff(1);
	//telldus.turnOff(2);
	//telldus.turnOff(3);

	res.send('');
});

app.post('/cozy', function (req, res) {
	runCommands([
		[ { command: 'off', param: 3 } ],
		[ { command: 'dimlevel', param: 1 }, { command: 'dim', param: 2 } ],
		[ { command: 'dimlevel', param: 1 }, { command: 'dim', param: 4 } ]
	]);

	//telldus.turnOff(1);
	//telldus.dim(2, 1);
	//telldus.dim(3, 1);

	res.send('');
});

app.post('/full', function (req, res) {
	runCommands([
		[ { command: 'on', param: 3 } ],
		[ { command: 'dimlevel', param: 255 }, { command: 'dim', param: 2 } ],
		[ { command: 'dimlevel', param: 255 }, { command: 'dim', param: 4 } ]
	]);

	//telldus.turnOn(1);
	//telldus.dim(2, 255);
	//telldus.dim(3, 255);

	res.send('');
});


app.post('/cinema', function (req, res) {
	runCommands([
		[ { command: 'off', param: 3 } ],
		[ { command: 'dimlevel', param: 1 }, { command: 'dim', param: 4 } ],
		[ { command: 'off', param: 2 } ]
	]);

	//telldus.turnOff(1);
	//telldus.dim(3, 1);
	//telldus.turnOff(2);

	res.send('');
});

var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	logger.info('Homie is listening at http://%s:%s', host, port);

});