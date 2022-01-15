// Imports
const models = require('../models');
const modelsMessage = require('../models/message');
const utils = require('../utils/jwt.utils');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

//Constants

//Controllers 
exports.createMessage = (req, res, next) => {

        //Constants
        const userId= req.decodedToken.userId;
    

        // Params
        var title = req.body.title;
        var content = req.body.content;

        if( title == null || content == null) {
            return res.status(400).json({'error': 'Missing parameters'});
        }

        if (title.length <= 2 || content.length <= 4) {
            return res.status(400).json({'error': 'title or content too short'});
        }

        
        //Create new message
        models.User.findOne({
            where: {id: userId}
        })
        .then(function(userFound){
            if(userFound) {
                models.Message.create({
                    title: title,
                    content: content,
                    likes: 0,
                    UserId: userFound.id
                })
                res.status(201).json({'message':'Message create succes!'});
            
            } else {
                return res.status(409).json({'error': "user don't find"});
            }
        })
        .catch(function(err){
            return res.status(500).json({'error':'unable to create message'});
        });
       
}

exports.getAllMessage = (req, res, next) => {
    models.Message.findAll({
        include: [{
            model: models.User,
            attributes: ['username']
        }]
    })
    .then(messages => res.status(200).json(messages))
    .catch(error => res.status(400).json({ error }));
};






/*exports.listMessage = (req, res, next) => {
    //Params 

}*/