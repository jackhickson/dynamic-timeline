/**
 * Turns a IterableIterator, usually from a Map.keys() to a sorted array
 * @param keys 
 * @returns 
 */
export function keysToSortedArray<KeyType>(keys: IterableIterator<KeyType>) : KeyType[] {

    return Array.from(keys).sort();
}