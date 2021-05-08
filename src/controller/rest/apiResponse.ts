import { Context } from 'koa';

export async function apiResponse<T>(ctx: Context, next: () => T): Promise<void> {
    try {
        const result = await next();
        ctx.body = result;
    } catch (err) {
        ctx.body = {
            message: err.message,
        };
        ctx.status = 400;
    }
}
