import Koa from 'koa';
import Knex from 'knex';
import { Controller } from '@controller/Controller';
import { Session } from '@controller/Session';
import { Identifiers } from '@app/identifiers';
import { container } from '@app/container';

export interface AppContext {
    session: Session;
}

export type App = Koa<Koa.DefaultState, AppContext>;

const app: App = new Koa();

export async function run(port: number): Promise<void> {
    const database = container.get<Knex>(Identifiers.Database);
    await database.migrate.up();

    for (const controller of container.getAll<Controller>(
        Identifiers.Controller,
    )) {
        controller.register(app);
        console.log(`Registered ${controller.constructor.name}`);
    }

    app.listen(port);
}
