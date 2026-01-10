// === Libs ===
const pool = require('../db/pool');
const {internalServerError, unknownMsg, unknownNewsArticle, unauthorizedAccess} = require("../vars/error/errors");
const {createdNewsSuccess, deletedNewsSuccess, editNewsSuccess} = require("../vars/success/success");

// === Main ===
async function writeNews(username, title, content, level) {
    try {
        const result = pool.query(
            'INSERT INTO `information` (msg, level, author, creation, title) VALUES (?, ?, ?, ?, ?)',
            [content, level, username, new Date(), title]
        );
        if (result.affectedRows === 0) {
            return internalServerError;
        }
        return createdNewsSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function editNews(id, username, title, content, level) {
    try {
        const news = await getNews();
        const newsArticle = news.filter((element) => element.id === id);
        if (newsArticle[0].author !== username) {
            return unauthorizedAccess;
        }
        const [result] = await pool.query(
            'UPDATE `information` SET title = ?, msg = ?, level = ? WHERE id = ?',
            [title, content, level, id]
        );
        if (result.affectedRows === 0) {
            return unknownNewsArticle;
        }

        return editNewsSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function deleteNews(id, username) {
    try {
        const news = await getNews();
        const newsArticle = news.filter((element) => element.id === id);
        if (newsArticle[0].author !== username) {
            return unauthorizedAccess;
        }
        const [result] = await pool.query(
            'DELETE FROM `information` WHERE id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return unknownNewsArticle;
        }

        return deletedNewsSuccess;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

async function getNews() {
    try {
        const [result] = await pool.query(
            'SELECT * FROM `information`'
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
    writeNews,
    deleteNews,
    getNews,
    editNews
}