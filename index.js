var express = require('express');
var app = express();
var telldus = require('telldus');

telldus.getDevices(function(err,devices) {
  if ( err ) {
    console.log('Error: ' + err);
  } else {
    // A list of all configured devices is returned
    console.log('DEVICES:');
    console.log(devices);
  }
});

/*var deviceId=1;
telldus.turnOn(deviceId,function(err) {
  console.log('Device' + deviceId + ' is now OFF');
});

deviceId=2;
var level = 20;
telldus.dim(deviceId, level,function(err) {
  console.log('Device ' + deviceId + ' is now dimmed to level ' + level);
});*/

app.get('/morning', function (req, res) {
  telldus.turnOn(1);
  telldus.dim(2, 20);
  res.send('');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Homie is listening at http://%s:%s', host, port);

});
