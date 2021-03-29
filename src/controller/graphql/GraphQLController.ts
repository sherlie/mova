import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { inject, injectable } from 'inversify';
import { Controller } from '@controller/Controller';
import { schema } from '@controller/graphql/schema';
import { App, AppContext } from '@app/index';
import { Identifiers } from '@app/identifiers';
import { SessionFactory } from '@app/container';

@injectable()
export class GraphQLController implements Controller {
    constructor(
        @inject(Identifiers.SessionFactory)
        private sessionFactory: SessionFactory,
    ) {}

    public register(app: App): void {
        app.use(async (ctx: AppContext, next: Koa.Next) => {
            ctx.session = this.sessionFactory();
            await next();
        });

        const server = new ApolloServer({
            schema,
            context: ({ ctx }) => ctx,
        });
        server.applyMiddleware({ app, path: '/api/graphql' });
    }
}
