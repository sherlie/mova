import Knex from 'knex';
import { injectable, inject } from 'inversify';
import { LangId } from '@model/Lang';
import { PartOfSpeech } from '@model/Entry';
import { CustomDefinitionScope } from '@service/CustomService';

const TABLE = 'custom_defs';

export interface CustomDefinitionRow {
    id: string;
    lang_id: string;
    pos: string;
    name: string;
    type: string;
    props: string;
}

export interface GetAllScope {
    langId: LangId;
    pos?: PartOfSpeech;
}

@injectable()
export class CustomRepo {
    constructor(@inject('database') private database: Knex) {}

    getAll({
        langId,
        pos,
    }: CustomDefinitionScope): Promise<CustomDefinitionRow[]> {
        const query = this.database<CustomDefinitionRow>(TABLE)
            .select('*')
            .where('lang_id', langId);

        if (pos) {
            query.where('pos', pos);
        }

        return query.then();
    }
}
