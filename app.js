'use strict'

var express = require ('express');
var bodyParser = require ('body-parser');

var app = express ();

//Load Routes
var user_routes = require('./routes/user');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Config Headers http



//Base Routes

app.use('/api', user_routes);


module.exports = app;