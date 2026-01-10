// === Libs ===
const pool = require('../../db/pool');
const {internalServerError} = require('../../vars/error/errors');
const {createdUserSuccess, gotUsersSuccess} = require("../../vars/success/success");

// === Main ===
async function createUser(username, password, permissions, ign) {
    try {
        const [result] = await pool.query(
            'INSERT INTO `users` (name, password, permissions, ign) VALUES (?, ?, ?, ?)',
            [username, password, permissions, ign]
        );

        if (result.affectedRows === 0) {
            return internalServerError;
        }

        return createdUserSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function deleteUser(username) {
    try {
        const [result] = await pool.query(
            'DELETE FROM `users` WHERE `name` = ?',
            [username]
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }

        return createdUserSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function getUsers() {
    try {
        const [result] = await pool.query(
            'SELECT * FROM `users`'
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }

        return result;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

// === Exporting ===
module.exports = {
    createUser,
    deleteUser,
    getUsers
}