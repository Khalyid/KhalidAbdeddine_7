//Imports
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');

const models = require('../models');

const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regexPassword = /^(?=.*\d).{4,8}$/;
//Routes

module.exports = {
    register: function(req, res) {
        
        // Params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio = req.body.bio;

        if (email == null || username == null || password == null) {
            return res.status(400).json({'error' : 'missing information'});
        }  

        if (username.length >= 13 || username.length <= 4 ) {
            return res.status(400).json({'error' : 'wrong username (length must be between 5- 12'});
        }  

        if (!regexEmail.test(email)){
            return res.status(400).json({'error' : 'email not valid'});
        }

        if (!regexPassword.test(password)){
            return res.status(400).json({'error' : 'Password must be between 4 and 8 digits long and include at least one numeric digit'});
        }
        
        //Verify variable 
        models.User.findOne({
            attributes: ['email'],
            where: {email: email}
        })
        .then(function(userFound){
            if(!userFound){
               bcrypt.hash(password, 5, function(err, bcryptedPassword){
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: 0
                    })
                    .then(function(newUser){
                        return res.status(201).json({
                            'userId': newUser.id
                        })
                    })
                    .catch(function(err){
                        return res.status(500).json({'error': 'cannot add user'});
                    });
               });
            } else {
                return res.status(409).json({'error': 'user already exist'});
            }
                })
                .catch(function(err){
                    return res.status(500).json({'error':'unable to verify user'});
                });

       
    },
    login: function(req, res){

        //Params
        var email = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({'error' : 'missing information'});
        }  

        //Verify
        models.User.findOne({
            where: {email: email}
        })

        .then(function(userFound){
            if (userFound){

                bcrypt.compare(password, userFound.password , function(errBycrypt, resBycrypt) {
                    if (resBycrypt) {
                    return res.status(200).json({
                        'userId': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound)
                    });
                } else {
                    return res.status(403).json({"error": "Password invalid"});
                }
                });
            } else {
                return res.status(403).json({"error": "Don't exist in DB"});
            }
        })

        .catch(function(err){
            return res.status(500).json({'error': 'unable to verify user'});
        });

    }
}
