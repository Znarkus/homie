var lamps = {
	CEILING_LAMPS: 2,
	WINDOW_LAMPS: 3,
	TABLE_LAMPS: 4
};

module.exports = {
	lamps: lamps,
	iphone: {
		ip: '10.0.0.73',
		lampSettings: {
			leave: 'off',
			return: 'morning'
		}
	},
	lampSettings: {
		morning: [
			[{command: 'on', param: lamps.WINDOW_LAMPS}],
			[{command: 'dimlevel', param: 100}, {command: 'dim', param: lamps.CEILING_LAMPS}],
			[{command: 'dimlevel', param: 100}, {command: 'dim', param: lamps.TABLE_LAMPS}]
		],
		off: [
			[{command: 'off', param: lamps.WINDOW_LAMPS}],
			[{command: 'off', param: lamps.CEILING_LAMPS}],
			[{command: 'off', param: lamps.TABLE_LAMPS}]
		],
		cozy: [
			[{command: 'off', param: lamps.WINDOW_LAMPS}],
			[{command: 'dimlevel', param: 1}, {command: 'dim', param: lamps.CEILING_LAMPS}],
			[{command: 'dimlevel', param: 1}, {command: 'dim', param: lamps.TABLE_LAMPS}]
		],
		full: [
			[{command: 'on', param: lamps.WINDOW_LAMPS}],
			[{command: 'dimlevel', param: 255}, {command: 'dim', param: lamps.CEILING_LAMPS}],
			[{command: 'dimlevel', param: 255}, {command: 'dim', param: lamps.TABLE_LAMPS}]
		],
		cinema: [
			[{command: 'off', param: lamps.WINDOW_LAMPS}],
			[{command: 'dimlevel', param: 1}, {command: 'dim', param: lamps.TABLE_LAMPS}],
			[{command: 'off', param: lamps.CEILING_LAMPS}]
		]
	}
};