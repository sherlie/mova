import DataLoader from 'dataloader';
import { Identifiers } from '@app/identifiers';
import { LangService } from '@service/LangService';
import { inject, injectable } from 'inversify';
import { Lang, LangId } from '@model/Lang';

@injectable()
export class LangDataLoader extends DataLoader<LangId, Lang> {
    constructor(@inject(Identifiers.LangService) private langService: LangService) {
        super((langIds) => this.batchLoad(langIds));
    }

    private async batchLoad(langIds: ReadonlyArray<LangId>): Promise<(Lang | Error)[]> {
        const langs = await this.langService.getByIds([...langIds]);

        const langById = new Map<LangId, Lang>(langs.map((lang) => [lang.id, lang]));
        return langIds.map(
            (langId) => langById.get(langId) || new Error(`Lang ${langId} not found`),
        );
    }
}
