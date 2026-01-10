// === Libs ===
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

// === Main ===
async function signToken(username) {
    const user = { username: username }
    return { accessToken: jwt.sign(user, process.env.ACCESS_TOKEN)};
}

// === Exporting ===
module.exports = {
    signToken
};