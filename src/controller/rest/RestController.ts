import { injectable } from 'inversify';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { koaSwagger } from 'koa2-swagger-ui';
import * as yamlJs from 'yamljs';
import { Controller } from '@controller/Controller';
import { App, AppContext } from '@app/init';
import { apiResponse } from './apiResponse';
import { createDef, deleteDef, getDefs, updateDef } from './definitions';
import {
    createEntry,
    deleteEntry,
    getEntries,
    getEntry,
    getEntryDefs,
    updateEntry,
} from './entries';
import { getLangs, getLang, createLang, updateLang, deleteLang } from './langs';

@injectable()
export class RestController implements Controller {
    public register(app: App): void {
        const router = new KoaRouter<any, AppContext>({ prefix: '/api' });
        router.use(bodyParser());
        router.use(apiResponse);

        router.get('/langs', getLangs);
        router.post('/langs', createLang);
        router.get('/langs/:id', getLang);
        router.put('/langs/:id', updateLang);
        router.del('/langs/:id', deleteLang);

        router.get('/definitions', getDefs);
        router.post('/definitions', createDef);
        router.put('/definitions/:id', updateDef);
        router.del('/definitions/:id', deleteDef);

        router.get('/entries', getEntries);
        router.post('/entries', createEntry);
        router.get('/entries/:id', getEntry);
        router.put('/entries/:id', updateEntry);
        router.del('/entries/:id', deleteEntry);
        router.get('/entries/:id/definitions', getEntryDefs);

        app.use(router.routes());

        app.use(
            koaSwagger({
                routePrefix: '/api/docs',
                swaggerOptions: {
                    spec: yamlJs.load(`${__dirname}/openapi.yaml`),
                },
            }),
        );
    }
}
