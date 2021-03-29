export function cast<E>(type: E, key: string): E[keyof E] {
    return type[key as keyof E];
}
