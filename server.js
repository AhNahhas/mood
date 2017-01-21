var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var channels = require('./routes/channels');

var port = 3000;

var app = express();

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set static folder (angular stuff)
app.use(express.static(path.join(__dirname, 'client')));

//Bode parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//routes
app.use('/', index);
app.use('/api', channels);

app.use(function(req, res) {
    res.render('index.html');
});

app.listen(port, function(){
    console.log('Server started on port '+port);
});