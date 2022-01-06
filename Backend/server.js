//Imports 
var express = require ('express');

//Instantiate server

var server = express();

//Configure routes
server.get('/', function(req,res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>BONJOUR SUR MON SERVEUR</h1>');
});


// Launch server
server.listen(8080, function() {
    console.log('server en écoute');
});