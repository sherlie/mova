import Knex from 'knex';

export const database = Knex({
    client: 'mysql',
    connection: {
        host: 'mova-db',
        port: 3306,
        user: 'mova',
        password: 'secret-to-mova-db',
        database: 'mova',
    },
    migrations: {
        directory: 'src/migrations',
    },
});
