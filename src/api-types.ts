export interface AppData {
    characterAliasList: any,
    flow: any,
    storyBatches: any
}

export function isAppData(object: any): object is AppData {
    return 'characterAliasList' in object && 'flow' in object && 'storyBatches' in object;
}

// ie volumes, books, audio books
export interface StoryBatch {
    name: string;
    chapters: string[];
}

export function isStoryBatchArray(object: any): object is StoryBatch[] {

    return Array.isArray(object) && (object.length === 0 || ('name' in object[0] && 'chapters' in object[0]))
}

export interface PlotPointChapter extends PlotPointChapterInfo {
    chapterIndex: number;
}

export interface PlotPointChapterInfo {
    characters: SelectedCharacterAlias[];
    description: string;
}

export interface CharacterAliasList {
    characterId: string;
    aliases: string[];
};

export function isCharacterAliasList(object: any): object is CharacterAliasList[] {

    return Array.isArray(object) && (object.length === 0 || ('id' in object[0] && 'aliases' in object[0]))
}

export interface SelectedCharacterAlias {
    characterId: string;
    alias: string;
};