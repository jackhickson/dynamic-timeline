/**
 * Turns a IterableIterator, usually from a Map.keys() to a sorted array
 * @param keys 
 * @returns 
 */
export function keysToSortedArray<KeyType>(keys: IterableIterator<KeyType>) : KeyType[] {

    return Array.from(keys).sort();
}

// for moving menu items in the editors
export enum Direction {
    UP, DOWN
}

// checks if a move would go out of bounds
const moveWouldBeOutOfBounds = (a: any[], index: number, direction:Direction): boolean => {

    return (index === 0 && direction === Direction.UP) || (a.length-1 === index && direction === Direction.DOWN);
}

// move the item at an index in an array up or down
export const moveItemAtIndex = (a: any[], index: number, direction: Direction) => {

    if(moveWouldBeOutOfBounds(a, index, direction)) {
        return;
    }

    const delta = direction === Direction.UP ? -1 : 1;

    //swap
    [a[index], a[index + delta]] = [a[index + delta], a[index]]

    return a;
}

export const constructNodeId = (chapterId: number, nodeId: number) => {
    return chapterId + "-" + nodeId;
}

export const readUploadedFileAsJson = (file: File) => {

    const temporaryFileReader = new FileReader();
  
    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
    };
  
        temporaryFileReader.onload = () => {
            const result = temporaryFileReader.result;

            if(!result || result instanceof ArrayBuffer) {

                resolve(result);
            } else {

                resolve(JSON.parse(result));
            }
        };
        temporaryFileReader.readAsText(file);
    });
};