var assert = require("assert");
var moment = require('moment');
var Iphone = require('../iphone.js').Iphone;

describe('Iphone', function () {

	describe('#iphoneIsAway()', function () {

		it('should return false', function () {
			var iphone = factory();
			iphone.iphoneLastSeen = new Date();
			assert.equal(false, iphone.iphoneIsAway());
		});

		it('should return true', function () {
			var iphone = factory();
			iphone.iphoneLastSeen = moment().subtract(20, 'minutes').toDate();
			assert.equal(true, iphone.iphoneIsAway());
		});

	});

	describe('#withinOperationHours()', function () {

		it('should return false', function () {
			var iphone = factory();
			assert.equal(false, iphone.withinOperationHours(moment('6:00', 'H:mm').toDate()));
		});

		it('should return true', function () {
			var iphone = factory();
			assert.equal(true, iphone.withinOperationHours(moment('8:00', 'H:mm').toDate()));
		});

	});

});

function factory(cbLeave, cbReturn) {
	var config = {ip: '10.0.0.73'};
	var callbacks = {
		leave: cbLeave || function () {},
		return: cbReturn || function () {}
	};

	return new Iphone(config, callbacks);
}