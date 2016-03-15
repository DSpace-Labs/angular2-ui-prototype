var express = require("express");

var cors = require("cors");

var app = express();

var ws = require("nodejs-websocket")

/*
 *  WebSocket Server
 * 
 * 
 */
var wsPort = 3002;

ws.createServer(function (connection) {
    
    console.log("New connection");
    
    connection.on("text", function (input) {
        
        console.log("Request " + input);
        
        var response = {
            file: input,
            content: require(input)
        };
        
        connection.send(JSON.stringify(response), function () { });
    });
    
    connection.on("close", function (code, reason) {
        console.log("Connection closed");
    });

}).listen(wsPort, function () {
    console.log("Websockets listening at port " + wsPort);
});


/*
 *  html5 mode http server
 * 
 */

 var httpPort = 3001;

// might need cors at some point
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:' + httpPort);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.set('port', httpPort);

app.use('/dist', express.static(__dirname + '/dist'));

app.use('/resources', express.static(__dirname + '/resources'));

/*
 * Prerender service
 * 
 */ 

var prerenderPort = 3000;

// reference https://prerender.io/
app.use(
    require('prerender-node')
        .set('prerenderServiceUrl', 'http://localhost:' + prerenderPort)
        .set('beforeRender', function(req, done) {
            console.log('before prerender');
            done();
        })
);




app.get('/*', function (req, res) {    
    res.sendFile(__dirname + '/app/view/index.html');    
});

app.listen(app.get('port'), function () { 
    console.log("Running at Port " + httpPort);
    console.log("Prerender at Port " + prerenderPort);
});

//var request = require("request");
//
//request("https://training-ir.tdl.org/tdl-rest/collections", function (error, response, body) {
//    console.log(body);
//});
//
//request("https://training-ir.tdl.org/tdl-rest/communities", function (error, response, body) {
//    console.log(body);
//});