export interface AppData {
    allCharacters: any,
    flow: any,
    storyBatches: any
}

export function isAppData(object: any): object is AppData {
    return 'allCharacters' in object && 'flow' in object && 'storyBatches' in object;
}

// ie volumes, books, audio books
export interface StoryBatch {
    name: string;
    chapters: string[];
}

export function isStoryBatchArray(object: any): object is StoryBatch[] {

    return Array.isArray(object) && (object.length === 0 || ('name' in object[0] && 'chapters' in object[0]))
}