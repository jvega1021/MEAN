"use strict";

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/curso_mean2', {useMongoClient: true} ,function (err){
    if(err){
        throw err;
    }
    else{
        console.log('Conexión a MongoDB realizada');

        app.listen(port, function(){
            console.log("Servidor escuchando por el puerto: "+port);
        });
    }
});