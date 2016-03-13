var page = require('webpage').create();

console.log("Test test test 1 2");

page.open('http://localhost:3000', function (status) {
    
    console.log("Status: " + status);
    
    if (status === "success") {

    }

    phantom.exit();

});