import { injectable } from 'inversify';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { koaSwagger } from 'koa2-swagger-ui';
import * as yamlJs from 'yamljs';
import { Controller } from '@controller/Controller';
import { App, AppContext } from '@app/init';
import { apiResponse } from './apiResponse';
import { createDef, getDefs } from './definitions';
import { getEntries, getEntry, getEntryDefs } from './entries';
import { getLangs, getLang, createLang } from './langs';
import { createEntry } from './entries/createEntry';

@injectable()
export class RestController implements Controller {
    public register(app: App): void {
        const router = new KoaRouter<any, AppContext>({ prefix: '/api' });
        router.use(bodyParser());
        router.use(apiResponse);

        router.get('/langs', getLangs);
        router.get('/langs/:id', getLang);
        router.post('/langs', createLang);

        router.get('/definitions', getDefs);
        router.post('/definitions', createDef);

        router.get('/entries', getEntries);
        router.get('/entries/:id', getEntry);
        router.post('/entries', createEntry);
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
