import { App } from '@app/index';

export interface Controller {
    register(app: App): void;
}
