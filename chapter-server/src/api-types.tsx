export interface InitialState {
    characterAliases: any,
    flow: any,
    storyBatches: any
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