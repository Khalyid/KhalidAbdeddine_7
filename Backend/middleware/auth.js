const jwt = require('jsonwebtoken');
const jwtUtils = require('../utils/jwt.utils');



module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token, 'TOKEN VERIF');
        console.log(jwtUtils.TOKEN_SECRET, 'DECODED TOKEN');
        const decodedToken = jwt.verify(token, jwtUtils.TOKEN_SECRET(), function(error, decoded){
            console.log(error)
            console.log(decoded)
            return decoded;
            });
        console.log(decodedToken, 'Final token');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            req.decodedToken = decodedToken;
            next();

        }
    } catch (error) {
        res.status(401).json({error: error | 'Requête non authentifié !'})
    }
};

