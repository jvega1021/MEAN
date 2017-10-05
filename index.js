'use strict'

var mongoose = require('mongoose');

var app = require ('./app');
var port = process.env.PORT || 3977;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/curso_mean2', (err, res) => {
	if (err) {
		throw err;
	} else {
		console.log("La base de datos esta corriendo Correctamente")
		app.listen(port, function(){
			console.log("API por el puerto "+port)
		});
	}

});