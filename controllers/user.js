'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');

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


function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error al actualizar el usuario'})
		} else {
			if (!userUpdated) {
				res.status(404).send({message: 'No se ha logrado actualizar el usuario'})
			} else {
				res.status(200).send({user: userUpdated})
			}
		}
	});
}


function uploadImage(req, res){
    var userId = req.params.id;
    //var file_name = 'No subido...';

    if (req.files) {

      var file_path = req.files.image.path; /** Trae la ruta completa del fichero subido */
      var file_ext = path.extname(file_path); /** Trae la extensión del fichero en esa ruta */
      var file_name = path.basename(file_path); /** Trae el nombre base del fichero */

        if (file_ext == '.png' || file_ext == '.jpg' || file_ext == '.jpeg') {

            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }
                else {
                    res.status(200).send({image: file_name, user: userUpdated});
                }
            });
        }
        else {
            res.status(200).send({message: 'Extension del archivo no valida.'});
        }
    }
    else {
        res.status(200).send({message: 'No has subido ninguna imagen'});
    }

}

module.exports = {
	test,
	saveUser, 
	loginUser,
	updateUser,
	uploadImage
};
