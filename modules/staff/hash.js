// === Libs ===
const bcrypt = require('bcrypt');
const {wrongPassword, internalServerError} = require("../vars/error/errors");
const {correctPassword} = require("../vars/success/success");

// === Vars ===
const salt = bcrypt.genSaltSync(10)

// === Main ===
async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, salt);
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function comparePasswords(password, hash) {
    try {
        const match = await bcrypt.compare(password, hash);
        if (!match) {
            wrongPassword.main['match'] = false;
            return wrongPassword;
        }
        correctPassword.main['match'] = true;
        return correctPassword;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

// === Exporting ===
module.exports = {
    hashPassword,
    comparePasswords
}