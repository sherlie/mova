import 'reflect-metadata';
import * as inv from 'inversify';
import Knex from 'knex';
import { database } from '@repository/database';
import { LangRepo } from '@repository/LangRepo';
import { EntryRepo } from '@repository/EntryRepo';
import { CustomDefRepo } from '@repository/CustomDefRepo';
import { LangService, LangServiceImpl } from '@service/LangService';
import { EntryService, EntryServiceImpl } from '@service/EntryService';
import { CustomDefService, CustomDefServiceImpl } from '@service/CustomDefService';
import { LangDataLoader } from '@controller/graphql/dataloaders/LangDataLoader';
import { EntryDataLoader } from '@controller/graphql/dataloaders/EntryDataLoader';
import { Session } from '@controller/Session';
import { Identifiers as Ids } from '@app/identifiers';
import { MaintenanceController } from '@controller/MaintenanceController';
import { CustomDefFactory, CustomDefFactoryImpl } from '@service/CustomDefFactory';
import { CustomValueFactory, CustomValueFactoryImpl } from '@service/CustomValueFactory';
import { RestController } from '@controller/rest/RestController';

export const container = new inv.Container({
    defaultScope: 'Singleton',
    skipBaseClassChecks: true,
});

container.bind<Knex>(Ids.Database).toConstantValue(database);
container.bind<LangRepo>(Ids.LangRepo).to(LangRepo);
container.bind<EntryRepo>(Ids.EntryRepo).to(EntryRepo);
container.bind<CustomDefRepo>(Ids.CustomDefRepo).to(CustomDefRepo);

container.bind<CustomDefFactory>(Ids.CustomDefFactory).to(CustomDefFactoryImpl);
container.bind<CustomValueFactory>(Ids.CustomValueFactory).to(CustomValueFactoryImpl);

container.bind<LangService>(Ids.LangService).to(LangServiceImpl);
container.bind<EntryService>(Ids.EntryService).to(EntryServiceImpl);
container.bind<CustomDefService>(Ids.CustomDefService).to(CustomDefServiceImpl);
container.bind<LangDataLoader>(Ids.LangDataLoader).to(LangDataLoader);
container.bind<EntryDataLoader>(Ids.EntryDataLoader).to(EntryDataLoader);

export type SessionFactory = () => Session;

container.bind<Session>(Ids.Session).to(Session);
container
    .bind<Session>(Ids.SessionFactory)
    .toFactory((containerContext: inv.interfaces.Context) => () =>
        containerContext.container.get<Session>(Ids.Session),
    );

//container.bind<GraphQLController>(Ids.Controller).to(GraphQLController); - temporarily disabled
container.bind<RestController>(Ids.Controller).to(RestController);
container.bind<MaintenanceController>(Ids.Controller).to(MaintenanceController);
