#!/usr/bin/env node
import {GlobalConfig} from '../config';

var http = require('http'),
    httpProxy = require('http-proxy'),
    program = require('commander');

var serverValue, portValue, insecureValue;

program.version('0.0.1')
       .usage('[options] server')
       .option('-p, --port <n>', 'Specify the port', parseInt)
       .option('-i, --insecure <b>', 'allow self-signed certificates')
       .arguments('<server>').action(function(server) {
            serverValue = server;
});

serverValue = serverValue ? serverValue : GlobalConfig.dspace.url;

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



proxy.on('proxyRes', function(proxyRes, req, res, options) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-HTTP-Method-Override, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
});


var server = http.createServer(function (req, res) {
    proxy.web(req, res, {target: serverValue}, function(e) {
        console.log("Proxy server didn't respond, retrying..");
    });
});

console.log("proxying " + serverValue + " on port " + portValue);

server.listen(portValue);
