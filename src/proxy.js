#!/usr/bin/env node
var http = require('http'),
        httpProxy = require('http-proxy'),
        program = require('commander');

var serverValue, portValue, insecureValue;

program
        .version('0.0.1')
        .usage('[options] server')
        .option('-p, --port <n>', 'Specify the port', parseInt)
        .option('-i, --insecure <b>', 'allow self-signed certificates')
        .arguments('<server>').action(function(server) {
            serverValue = server;
        });

program.parse(process.argv);

if (typeof serverValue === 'undefined') {
    console.error('No server specified!');
    program.outputHelp();
    process.exit(1);
}

portValue = program.port || 5050;
insecureValue = program.insecure || false;


var proxy = httpProxy.createProxyServer({
    secure: !insecureValue
});

var server = http.createServer(function (req, res) {
    proxy.web(req, res, {target: serverValue});
});

console.log("proxying " + serverValue + " on port " + portValue);
server.listen(portValue);