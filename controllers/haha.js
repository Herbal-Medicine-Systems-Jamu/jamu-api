// var sys = require('util'),
//     spawn = require('child_process').spawn,
//     dummy  = spawn('python', ['test.py']);

// dummy.stdout.on('data', function(data) {
//     sys.print(data.toString());
// });

var spawn = require('child_process').spawn;
        var dummy  = spawn('python', ["basic.py"]);

        dummy.stdout.pipe(process.stdout);
        dummy.stderr.pipe(process.stderr);

        dummy.stdout.on('data', function (data) {
            res.send(data.toString());
          });