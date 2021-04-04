import { PartOfSpeech } from '@model/Entry';
import { GraphQLEnumType } from 'graphql';

export const PartOfSpeechEnumType = new GraphQLEnumType({
    name: 'PartOfSpeech',
    values: Object.fromEntries(
        Object.entries(PartOfSpeech).map(([key, str]) => [key, { value: str }]),
    ),
});
