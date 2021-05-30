/* eslint-disable @typescript-eslint/no-non-null-assertion */
import KoaRouter from 'koa-router';
import { injectable } from 'inversify';
import { App } from '@app/init';
import { Controller } from './Controller';
import { PartOfSpeech } from '@model/Entry';
import { CustomType, SingleOptionCustomDef, TableCustomDef } from '@model/CustomDef';
import { Context } from 'koa';

@injectable()
export class MaintenanceController implements Controller {
    register(app: App): void {
        const router = new KoaRouter({ prefix: '/api/maint' });

        router.get('/', async (ctx: Context) => {
            const { langService, customDefService, entryService } = ctx.session;

            await langService.deleteAll();

            const lang1 = await langService.create({ name: 'Spanish' });
            const lang2 = await langService.create({ name: 'German' });
            const def1 = await customDefService.create({
                langId: lang1.id,
                partOfSpeech: PartOfSpeech.Noun,
                name: 'Gender',
                type: CustomType.SingleOption,
                options: ['Masculine', 'Feminine'],
            });
            const def2 = await customDefService.create({
                langId: lang2.id,
                partOfSpeech: PartOfSpeech.Noun,
                name: 'Gender',
                type: CustomType.SingleOption,
                options: ['Masculine', 'Feminine', 'Neutral'],
            });
            const def3 = await customDefService.create({
                langId: lang2.id,
                partOfSpeech: PartOfSpeech.Verb,
                name: 'Past Participle',
                type: CustomType.Text,
            });
            const def4 = await customDefService.create({
                langId: lang2.id,
                partOfSpeech: PartOfSpeech.Verb,
                name: 'Present Tense (Präsens)',
                type: CustomType.Table,
                table: ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'Sie'],
            });

            const def1OptMasculine = Array.from(
                (def1 as SingleOptionCustomDef).options.entries(),
            ).find(([, opt]) => opt === 'Masculine')![0];

            await entryService.create({
                original: 'sol',
                translation: 'sun',
                langId: lang1.id,
                partOfSpeech: PartOfSpeech.Noun,
                customValues: { [def1.id]: { option: def1OptMasculine } },
            });

            const def2OptMasculine = Array.from(
                (def2 as SingleOptionCustomDef).options.entries(),
            ).find(([, opt]) => opt === 'Masculine')![0];

            await entryService.create({
                original: 'Auto',
                translation: 'car',
                langId: lang2.id,
                partOfSpeech: PartOfSpeech.Noun,
                customValues: { [def2.id]: { option: def2OptMasculine } },
            });

            const def4CellIch = Array.from((def4 as TableCustomDef).table.entries()).find(
                ([, cell]) => cell.name === 'ich',
            )![0];
            const def4CellDu = Array.from((def4 as TableCustomDef).table.entries()).find(
                ([, cell]) => cell.name === 'du',
            )![0];

            await entryService.create({
                original: 'sagen',
                translation: 'say',
                langId: lang2.id,
                partOfSpeech: PartOfSpeech.Verb,
                customValues: {
                    [def3.id]: { text: 'gesagt' },
                    [def4.id]: {
                        table: {
                            [def4CellIch]: 'sage',
                            [def4CellDu]: 'sagst',
                        },
                    },
                },
            });

            ctx.body = 'success';
        });

        app.use(router.routes()).use(router.allowedMethods());
    }
}
