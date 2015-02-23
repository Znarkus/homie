//var assert = require("assert");
var should = require('should');
var moment = require('moment');
var Iphone = require('../iphone.js');

describe('Iphone', function () {

	describe('#iphoneIsAway()', function () {

		it('should return false', function () {
			var iphone = factory();
			iphone.iphoneLastSeen = new Date();
			iphone.iphoneIsAway().should.be.false;
		});

		it('should return true', function () {
			var iphone = factory();
			iphone.iphoneLastSeen = moment().subtract(20, 'minutes').toDate();
			iphone.iphoneIsAway().should.be.true;
		});

	});

	describe('#processNmapOutput()', function () {

		it('should have left', function () {
			var cb = [];

			var iphone = factory(function() {
				// Left
				cb.push('left');
			}, function() {
				// Returned
				cb.push('returned');
			});

			iphone.processNmapOutput('', 'anything');
			iphone.iphoneLastSeen = moment(iphone.iphoneLastSeen).subtract(20, 'minutes').toDate();
			//console.log(iphone.iphoneLastSeen);
			iphone.processNmapOutput('', '');

			cb.should.be.eql(['left']);
		});

		it('should not have left', function () {
			var cb = [];

			var iphone = factory(function() {
				// Left
				cb.push('left');
			}, function() {
				// Returned
				cb.push('returned');
			});

			iphone.processNmapOutput('', 'anything');
			iphone.iphoneLastSeen = moment(iphone.iphoneLastSeen).subtract(19, 'minutes').toDate();
			//console.log(iphone.iphoneLastSeen);
			iphone.processNmapOutput('', '');

			cb.should.be.eql([]);
		});

		it('should have returned', function () {
			var cb = [];

			var iphone = factory(function() {
				// Left
				cb.push('left');
			}, function() {
				// Returned
				cb.push('returned');
			});

			iphone.processNmapOutput('', '');

			// iPhone will be regarded as away
			iphone.iphoneLastSeen = moment(iphone.iphoneLastSeen).subtract(20, 'minutes').toDate();

			iphone.processNmapOutput('', 'anything');

			cb.should.be.eql(['returned']);
		});

	});

	describe('#logger', function () {

		it('should have logged', function () {
			var entries = 0;

			var iphone = factory(null, null, { debug: function () {
				entries++;
			}});

			iphone.processNmapOutput('', 'anything');
			iphone.processNmapOutput('', '');
			iphone.processNmapOutput('', 'anything');

			entries.should.be.greaterThan(0);
		});

	});

	//describe('#withinOperationHours()', function () {
	//
	//	it('should return false', function () {
	//		var iphone = factory();
	//		assert.equal(false, iphone.withinOperationHours(moment('6:00', 'H:mm').toDate()));
	//	});
	//
	//	it('should return true', function () {
	//		var iphone = factory();
	//		assert.equal(true, iphone.withinOperationHours(moment('8:00', 'H:mm').toDate()));
	//	});
	//
	//});

});

function factory(cbLeft, cbReturned, logger) {
	var config = {ip: '10.0.0.73'};
	var callbacks = {
		left: cbLeft || function () {},
		returned: cbReturned || function () {}
	};

	return new Iphone(config, callbacks, logger);
}