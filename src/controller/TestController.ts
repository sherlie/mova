import { ParameterizedContext } from 'koa';
import KoaRouter from 'koa-router';
import { App, AppContext } from '@app/index';
import { injectable } from 'inversify';
import { Controller } from './Controller';

@injectable()
export class TestController implements Controller {
    register(app: App): void {
        const router = new KoaRouter<any, AppContext>();

        router.get('/test', (ctx: ParameterizedContext) => {
            ctx.body = 'hello';
        });

        app.use(router.routes()).use(router.allowedMethods());
    }
}
