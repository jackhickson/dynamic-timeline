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

export interface PlotPointChapter extends PlotPointChapterInfo {
    chapterIndex: number;
}

export interface PlotPointChapterInfo {
    characters: SelectedCharacterAlias[];
    description: string;
}

export interface CharacterAliasList {
    id: string;
    aliases: string[];
};

export interface SelectedCharacterAlias {
    id: string;
    alias: string;
};