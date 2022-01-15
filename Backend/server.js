//Imports 
const express = require ('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

//Instantiate server
var server = express();

//Body Parser configuration
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());

//Configure routes
server.get('/', function(req,res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>BONJOUR SUR MON SERVEUR</h1>');
});

server.use('/api/users', userRoutes);
server.use('/api/messages', messageRoutes);


// Launch server
server.listen(8080, function() {
    console.log('server en écoute');
});