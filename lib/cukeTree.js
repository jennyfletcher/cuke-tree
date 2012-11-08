var fs = require("fs"), path = require("path");
var childProcess = require('child_process');
var glossaryGenerator = require("./extensions/report_core/generators/glossaryGenerator.js"); //need to refactor into extension!!!


module.exports = {
	runTests : runTests,
	getTestHistory : getTestHistory,
	generateGlossary : glossaryGenerator.generate,
	internal : require("./cukeTree.internal.js")
};


function runTests(options) {
	var command = options.cucumberBin +" "+ options.features +" -o \""+ options.output +"\" ";
	childProcess.exec(command, options.finishedCallback)
		.on('stdout', function(chunk) {
			process.stdout.write(chunk);
		})
		.on('stderr', function(chunk) {
			process.stderr.write(chunk);
		})
		.on('exit', options.exitedCallback);
}

function getTestHistory(options, callback) {
	fs.readdir(options.output, function(err, files) {
		if (err) { callback(err); } else {
			files.sort(function(a, b) {
				var aTime = fs.statSync(path.join(options.output, a)).mtime.getTime();
				var bTime = fs.statSync(path.join(options.output, b)).mtime.getTime();
				return bTime - aTime;
			});
			callback(null, files);
		}
	});
}