const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'qeg5regqg6egrq6g1rqg16rqg5V1R5GRE1fsgegrvfdbrgrez';

module.exports = {
    generateTokenForUser : function(userData) {
        return jwt.sign({
            userId : userData.id,
            isAdmin : userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    }
}
