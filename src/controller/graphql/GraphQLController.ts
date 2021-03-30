import { ApolloServer } from 'apollo-server-koa';
import { injectable } from 'inversify';
import { Controller } from '@controller/Controller';
import { schema } from '@controller/graphql/schema';
import { App } from '@app/index';

@injectable()
export class GraphQLController implements Controller {
    public register(app: App): void {
        const server = new ApolloServer({
            schema,
            context: ({ ctx }) => ctx,
        });
        server.applyMiddleware({ app, path: '/api/graphql' });
    }
}
