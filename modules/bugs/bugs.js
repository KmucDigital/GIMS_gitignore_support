// === Libs ===
const pool = require('../db/pool');
const {internalServerError} = require('../vars/error/errors');
const {createdUserSuccess, gotUsersSuccess, createdBugSuccess, deletedUserSuccess, deletedBugSuccess} = require("../vars/success/success");

// === Main ===
async function postBug(name, content) {
    try {
        const [result] = await pool.query(
            'INSERT INTO `bugs` (name, content) VALUES (?, ?)',
            [name, content]
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }

        return createdBugSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function deleteBug(name) {
    try {
        const [result] = await pool.query(
            'DELETE FROM `bugs` WHERE `name` = ?',
            [name]
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }

        return deletedBugSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function getBugs() {
    try {
        const [result] = await pool.query(
            'SELECT * FROM `bugs`'
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
    postBug,
    deleteBug,
    getBugs
}