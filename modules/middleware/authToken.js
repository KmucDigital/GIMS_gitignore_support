// === Libs ===
const jwt = require('jsonwebtoken');
const path = require('path');
const {missingTokenHeader, invalidToken} = require("../vars/error/errors");
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

// === Main ===
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    missingTokenHeader.main['path'] = req.path;
    if (token == null) return res.status(401).json(missingTokenHeader);

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        invalidToken.main['path'] = req.path;
        if (err) return res.status(403).json(invalidToken);
        req.user = user;
        next();

    });
}

// === Exporting ===
module.exports = {
    authenticateToken
}