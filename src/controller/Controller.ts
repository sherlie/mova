import { App } from '@app/init';

export interface Controller {
    register(app: App): void;
}
