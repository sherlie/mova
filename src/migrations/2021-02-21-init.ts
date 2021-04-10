import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('langs', (table: Knex.TableBuilder) => {
        table.uuid('id').primary();
        table.string('name').notNullable();
        table.dateTime('add_time').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('entries', (table: Knex.TableBuilder) => {
        table.uuid('id').primary();
        table.string('original').notNullable();
        table.string('translation').notNullable();
        table.uuid('lang_id').notNullable();
        table.string('pos').notNullable();
        table.json('custom');
        table.dateTime('add_time').notNullable().defaultTo(knex.fn.now());

        table.foreign('lang_id').references('langs.id').onDelete('cascade');

        table.index('pos');
    });

    await knex.schema.createTable('custom_defs', (table: Knex.TableBuilder) => {
        table.uuid('id').primary();
        table.uuid('lang_id').notNullable();
        table.string('pos').notNullable();

        table.string('name').notNullable();
        table.string('type').notNullable();
        table.json('props');
        table.dateTime('add_time').notNullable().defaultTo(knex.fn.now());

        table.foreign('lang_id').references('langs.id').onDelete('cascade');

        table.index(['lang_id', 'pos']);
    });
}

export async function down(): Promise<void> {
    throw new Error('Method not implemented.');
}
