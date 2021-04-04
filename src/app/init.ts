import Koa from 'koa';
import Knex from 'knex';
import cors from '@koa/cors';
import { Controller } from '@controller/Controller';
import { Session } from '@controller/Session';
import { Identifiers } from '@app/identifiers';
import { container, SessionFactory } from '@app/container';

export interface AppContext {
    session: Session;
}

export type App = Koa<Koa.DefaultState, AppContext>;

export async function init(port: number): Promise<void> {
    console.log('Initializing...');

    const app: App = new Koa();

    app.use(cors());

    const database = container.get<Knex>(Identifiers.Database);
    await database.migrate.up();
    console.log('Database migrated');

    const sessionFactory = container.get<SessionFactory>(Identifiers.SessionFactory);
    app.use(async (ctx: AppContext, next: Koa.Next) => {
        ctx.session = sessionFactory();
        await next();
    });

    for (const controller of container.getAll<Controller>(Identifiers.Controller)) {
        controller.register(app);
        console.log(`Controller ${controller.constructor.name} registered`);
    }
    console.log('App initialized');

    app.listen(port);
}
