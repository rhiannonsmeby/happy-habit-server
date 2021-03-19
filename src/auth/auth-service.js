const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
    getUserWithUsername(db, user_name) {
        return db('users')
            .where({ user_name })
            .first();
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash);
    },
    makeJwt(user) {
        return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          subject: user.user_name,
          algorithm: 'HS256',
        });
    },
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, { algorithms: 'HS256' });
    }
};

module.exports = AuthService;