// === Libs ===
const pool = require('../db/pool');
const { createConstructor } = require("../vars/constructor");

// === Main ===
const checkPerms = (action) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.username) {
                const constructor = await createConstructor(
                    process.env.ERROR_VAR,
                    401,
                    "Not authenticated",
                    undefined
                );
                constructor.main.path = req.path;
                return res.status(constructor.status).json(constructor);
            }

            const username = req.user.username;

            const [users] = await pool.query(
                'SELECT permissions FROM users WHERE name = ?',
                [username]
            );

            if (!users.length) {
                const constructor = await createConstructor(
                    process.env.ERROR_VAR,
                    403,
                    "User not found",
                    undefined
                );
                constructor.main.path = req.path;
                return res.status(constructor.status).json(constructor);
            }

            const roleName = users[0].permissions;

            const [roles] = await pool.query(
                'SELECT perms FROM roles WHERE name = ?',
                [roleName]
            );

            if (!roles.length) {
                const constructor = await createConstructor(
                    process.env.ERROR_VAR,
                    403,
                    "Role not found",
                    undefined
                );
                constructor.main.path = req.path;
                return res.status(constructor.status).json(constructor);
            }

            const perms = roles[0].perms;

            if (perms.includes('all') || perms.includes(action)) {
                return next();
            }

            const constructor = await createConstructor(
                process.env.ERROR_VAR,
                403,
                "Access denied",
                undefined
            );
            constructor.main.path = req.path;
            return res.status(constructor.status).json(constructor);

        } catch (err) {
            console.error(err);

            const constructor = await createConstructor(
                process.env.ERROR_VAR,
                500,
                "Internal Server Error",
                undefined
            );
            constructor.main.path = req.path;
            return res.status(constructor.status).json(constructor);
        }
    };
};

// === Exporting ===
module.exports = {
    checkPerms
};
