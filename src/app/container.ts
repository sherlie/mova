import 'reflect-metadata';
import * as inv from 'inversify';
import Knex from 'knex';
import { database } from '@repository/database';
import { LangRepo } from '@repository/LangRepo';
import { LangService, LangServiceImpl } from '@service/LangService';
import { EntryService, EntryServiceImpl } from '@service/EntryService';
import { LangDataLoader } from '@controller/graphql/dataloaders/LangDataLoader';
import { EntryDataLoader } from '@controller/graphql/dataloaders/EntryDataLoader';
import { Session } from '@controller/Session';
import { GraphQLController } from '@controller/graphql/GraphQLController';
import { Identifiers as Ids } from '@app/identifiers';
import { MaintenanceController } from '@controller/MaintenanceController';

export const container = new inv.Container({
    defaultScope: 'Request',
    skipBaseClassChecks: true,
});

container.bind<Knex>(Ids.Database).toConstantValue(database);
container.bind<LangRepo>(Ids.LangRepo).to(LangRepo).inSingletonScope();

container.bind<LangService>(Ids.LangService).to(LangServiceImpl);
container.bind<LangDataLoader>(Ids.LangDataLoader).to(LangDataLoader);
container.bind<EntryService>(Ids.EntryService).to(EntryServiceImpl);
container.bind<EntryDataLoader>(Ids.EntryDataLoader).to(EntryDataLoader);

export type SessionFactory = () => Session;

container.bind<Session>(Ids.Session).to(Session);
container
    .bind<Session>(Ids.SessionFactory)
    .toFactory((containerContext: inv.interfaces.Context) => () =>
        containerContext.container.get<Session>(Ids.Session),
    );

container
    .bind<GraphQLController>(Ids.Controller)
    .to(GraphQLController)
    .inSingletonScope();
container
    .bind<MaintenanceController>(Ids.Controller)
    .to(MaintenanceController)
    .inSingletonScope();
