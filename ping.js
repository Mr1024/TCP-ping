var net = require('net');

var ping = function(o, callback, sorttag) {
    var optionsArry = [];
    if (Object.prototype.toString.call(o) === '[object Array]') {
        optionsArry = o
    } else if (Object.prototype.toString.call(o) === '[object Object]') {
        optionsArry.push(o);
    } else {
        console.warn("parameter error");
    }
    var optionSize = optionsArry.length;
    var outArry = [];
    optionsArry.forEach(function(item) {
        var options = {};
        var i = 0;
        var results = [];
        options.address = item.address || 'localhost';
        options.port = item.port || 80;
        options.attempts = item.attempts || 10;
        options.timeout = item.timeout || 5000;
        connect(options);

        function check(options) {
            if (i < options.attempts) {
                connect(options);
            } else {
                var avg = results.reduce(function(prev, curr) {
                    return prev + curr.time;
                }, 0);
                var max = results.reduce(function(prev, curr) {
                    return (prev > curr.time) ? prev : curr.time;
                }, results[0].time);
                var min = results.reduce(function(prev, curr) {
                    return (prev < curr.time) ? prev : curr.time;
                }, results[0].time);
                avg = avg / results.length;
                var out = {
                    address: options.address,
                    port: options.port,
                    attempts: options.attempts,
                    avg: avg,
                    max: max,
                    min: min,
                    results: results
                };
                outArry.push(out);
                if (outArry.length === optionSize) {
                    if (sorttag !== undefined) {
                        outArry.sort(function(a, b) {
                            return sorttag == true ? (a.avg - b.avg) : (b.avg - a.avg);
                        });
                    }
                    callback(outArry);
                }

            }
        };

        function connect(options) {
            var s = new net.Socket();
            var start = process.hrtime();
            s.connect(options.port, options.address, function() {
                var time_arr = process.hrtime(start);
                var time = (time_arr[0] * 1e9 + time_arr[1]) / 1e6;
                results.push({
                    seq: i,
                    time: time
                });
                s.destroy();
                i++;
                check(options);
            });
            s.on('error', function(e) {
                results.push({
                    seq: i,
                    time: undefined,
                    err: e
                });
                s.destroy();
                i++;
                check(options);
            });
            s.setTimeout(options.timeout, function() {
                results.push({
                    seq: i,
                    time: undefined,
                    err: Error('Request timeout')
                });
                s.destroy();
                i++;
                check(options);
            });
        };
    });



};
module.exports.ping = ping;
