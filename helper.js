var colors = require('colors');
var fs = require('fs');
var path = require('path');

'use strict';

var log = function(text, color) {
	if (!color) {
		console.log(text);
		return;
	}

	console.log(colors[color](text));
}

var mkdirp = function(target_path) {
	try {
		fs.mkdirSync(target_path);
		return true;
	} catch (err) {
		if (err.code == 'ENOENT') {
			var p = path.dirname(target_path);

			if (mkdirp(p)) {
				return mkdirp(target_path);
			}
		}
	}
}

module.exports = {
	log: log,
	mkdirp: mkdirp
} 