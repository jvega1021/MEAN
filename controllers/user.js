'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

//Controller Define Service



function test(req, res){
	res.status(200).json({
		message: 'Welcome to Test'
	});
}


function saveUser(req, res){
	//Guardar parametros el cuerpo de la petición
	var params = req.body;
	var user = new User();  // Create to Schema User

	console.log(params);
	

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		//Encriptar contraseña
		bcrypt.hash(params.password, null, null, function (err, hash){
			user.password = hash;
			if (user.name != null && user.surname != null && user.email != null) {
				//Save User
				user.save((err, userStored) => {
					if (err) {
						res.status(500).send({
							message: 'Error al guardar el usuario'
						});
					} else {
						if (!userStored) {
							res.status(404).send({
								message: 'No se ha registrado el usuario'
							});
						} else {
							res.status(200).send({
								user: userStored
							});
						}
					}
				});
			} else {
				res.status(200).send({
					message: 'Introduce todos los campos'
				})
			}
		});
	}else{
		res.status(200).send({
			message: 'Introduce la contraseña'
		})
	}
}

function loginUser(req, res){
	var params = req.body;
	var email = params.email;
	var password = params.password;
	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!user) {
				res.status(404).send({message: 'El usuario no existe'});
			} else {
				bcrypt.compare(password, user.password, function(err, check){
					if (check) {
						if (params.gethash) {
							//Return Toker JWT
							res.status(200).send({
								token: jwt.createToken(user)
							});

						} else {
							res.status(200).send({user});
						}
					} else {
						res.status(404).send({message: 'Error de autenticación'})
					}
				});
			}
		}
	});
}


module.exports = {
	test,
	saveUser, 
	loginUser
};
