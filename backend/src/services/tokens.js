const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpires } = require('../config/env');

exports.signToken = (user) => jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: jwtExpires });
