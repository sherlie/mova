import 'reflect-metadata';
import * as inv from 'inversify';
import Knex from 'knex';
//import { database } from '@repository/database';
import { LangRepo } from '@repository/LangRepo';
import { LangService, LangServiceImpl } from '@service/LangService';
import { EntryService, EntryServiceImpl } from '@service/EntryService';
import { LangDataLoader } from '@controller/graphql/dataloaders/LangDataLoader';
import { EntryDataLoader } from '@controller/graphql/dataloaders/EntryDataLoader';
import { Session } from '@controller/Session';
import { GraphQLController } from '@controller/graphql/GraphQLController';
import { Identifiers } from '@app/identifiers';
import { TestController } from '@controller/TestController';
import { database } from '@repository/database';

export const container = new inv.Container({
    defaultScope: 'Request',
    skipBaseClassChecks: true,
});

container.bind<Knex>(Identifiers.Database).toConstantValue(database);
container.bind<LangRepo>(Identifiers.LangRepo).to(LangRepo).inSingletonScope();

container.bind<LangService>(Identifiers.LangService).to(LangServiceImpl);
container.bind<LangDataLoader>(Identifiers.LangDataLoader).to(LangDataLoader);
container.bind<EntryService>(Identifiers.EntryService).to(EntryServiceImpl);
container
    .bind<EntryDataLoader>(Identifiers.EntryDataLoader)
    .to(EntryDataLoader);

export type SessionFactory = () => Session;

container.bind<Session>(Identifiers.Session).to(Session);
container
    .bind<Session>(Identifiers.SessionFactory)
    .toFactory((containerContext: inv.interfaces.Context) => () =>
        containerContext.container.get<Session>(Identifiers.Session),
    );

container
    .bind<GraphQLController>(Identifiers.Controller)
    .to(GraphQLController)
    .inSingletonScope();
container
    .bind<TestController>(Identifiers.Controller)
    .to(TestController)
    .inSingletonScope();
