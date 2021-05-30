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

    private async batchLoad(langIds: ReadonlyArray<LangId>): Promise<Lang[]> {
        const langs = await this.langService.getByIds([...langIds]);
        return langIds.map(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (langId) => langs.get(langId)!,
        );
    }
}
