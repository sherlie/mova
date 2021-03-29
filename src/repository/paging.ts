import Knex from 'knex';

export interface PageScope {
    start: number;
    limit: number;
}

export interface Page<T> {
    items: T[];
    hasMore: boolean;
}

export async function page<T>(
    query: Knex.QueryBuilder<T>,
    { start, limit }: PageScope,
): Promise<Page<T>> {
    const items = await query
        .offset(start)
        .limit(limit + 1)
        .then();

    return {
        items: items.slice(0, items.length - 1),
        hasMore: items.length > limit,
    };
}

export function mapPage<T, U>(page: Page<T>, fn: (item: T) => U): Page<U> {
    return {
        items: page.items.map(fn),
        hasMore: page.hasMore,
    };
}
