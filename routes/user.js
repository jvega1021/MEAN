'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router();
var md_auth = require('../middlewares/authentication')

var multipart = require('connect-multiparty'); //Permite tener un middleware que se pueden subir ficheros a través de http
var md_upload =  multipart({ uploadDir: './uploads/users' });


api.get('/test', md_auth.ensureAuth, UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update/:id', md_auth.ensureAuth, UserController.updateUser);

api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

module.exports = api;	