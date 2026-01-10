// === Libs ===
const path = require("path");
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

// === Main ===
async function createConstructor(type, status, msg, data) {
    if (!type || !status || !msg) {
        return createConstructor(process.env.ERROR_VAR, 400, "Please include the needed variables for the constructor!", undefined);
    }
    let constructor = {}
    constructor.main = {}

    constructor.main['msg'] = msg;
    constructor['status'] = status;

    if (type !== process.env.SUCCESS_VAR) {
        constructor['error'] = true;
        constructor['success'] = false;
    } else {
        constructor['error'] = false;
        constructor['success'] = true;
    }

    constructor.main['time'] = new Date();

    if (data === undefined) {
        return constructor;
    }
    constructor['data'] = data;
    return constructor;
}

// === Exporting ===
module.exports = {
    createConstructor
}