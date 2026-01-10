// === Libs ===
const pool = require('../db/pool');
const {internalServerError} = require('../vars/error/errors');
const {createdUserSuccess, gotUsersSuccess, createdBugSuccess, deletedUserSuccess, deletedBugSuccess,
    createdReportSuccess, deletedReportSuccess
} = require("../vars/success/success");

// === Main ===
async function postReport(player, content) {
    try {
        const [result] = await pool.query(
            'INSERT INTO `reports` (player, content) VALUES (?, ?)',
            [player, content]
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }

        return createdReportSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function deletePost(name) {
    try {
        const [result] = await pool.query(
            'DELETE FROM `reports` WHERE `player` = ?',
            [name]
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }

        return deletedReportSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function getReports() {
    try {
        const [result] = await pool.query(
            'SELECT * FROM `reports`'
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
    postReport,
    deletePost,
    getReports
}