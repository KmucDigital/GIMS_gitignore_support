// === Libs ===
const pool = require('../db/pool');
const {internalServerError} = require('../vars/error/errors');
const {createdSuspectionSuccess, deleteSuspectionSuccess, editSuspectionsSuccess} = require("../vars/success/success");

// === Main ===
async function createSuspection(title, description, subject) {
    try {
        const result = await pool.query(
            'INSERT INTO `suspections` (title, description, subject) VALUES (?, ?, ?)',
            [title, description, subject]
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }
        return createdSuspectionSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function deleteSuspection(id) {
    try {
        const result = await pool.query(
            'DELETE FROM `suspections` WHERE id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }
        return deleteSuspectionSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function editSuspection(id, title, description, subject) {
    try {
        const result = await pool.query(
            'UPDATE `suspections` SET title = ?, description = ?, subject = ? WHERE id = ?',
            [title, description, subject, id]
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }
        return editSuspectionsSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function getSuspections() {
    try {
        const [result] = await pool.query(
            'SELECT * FROM `suspections`'
        );

        return result;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

// === Export ===
module.exports = {
    createSuspection,
    getSuspections,
    deleteSuspection,
    editSuspection
}