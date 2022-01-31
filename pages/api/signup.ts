export default async function SignUp(req, res) {
    const knex = require('knex')({
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DBNAME
        },
    });

    await knex.raw(`insert into users (username, password) values ('${req.body.data.username}', '${req.body.data.password}')`)
}

