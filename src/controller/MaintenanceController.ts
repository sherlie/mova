import KoaRouter from 'koa-router';
import { injectable } from 'inversify';
import { App, AppContext } from '@app/index';
import { Controller } from './Controller';
import { ExtendableContext } from 'koa';

@injectable()
export class MaintenanceController implements Controller {
    register(app: App): void {
        const router = new KoaRouter<any, AppContext>({ prefix: '/api/maint' });

        router.get('/test', (ctx: ExtendableContext) => {
            ctx.body = JSON.stringify('ok');
        });

        router.get(
            '/gen-langs',
            async (ctx: AppContext & ExtendableContext) => {
                const { langService } = ctx.session;
                await langService.create({ name: 'Estonian' });
                await langService.create({ name: 'Spanish' });
                await langService.create({ name: 'German' });
                ctx.body = 'ok';
            },
        );

        app.use(router.routes()).use(router.allowedMethods());
    }
}
