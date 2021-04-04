export type Maybe<T> = T | undefined;

export type Replace<T, R> = Omit<T, keyof R> & R;
