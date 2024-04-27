export const DEFAULT_LABEL = "Plot Name";
export const NODE_ID_SPLITTER = ":";

// used in PlotPointDialog
export interface PlotPointFormData {
    id: string;
    label: string;
    location: string;
    characters: string[];
    chapterIndex: number;
    description: string;
}

export interface NodeData {
    chapterIndex: number;
    label: string;
};

export interface NodeMetaData extends NodeData {
    chapterAction: ChapterAction;
    inCharacterTimeline: boolean;
};

// TODO: not sure what to do with this for now
export const UNSELECTED_CHARACTER_ID = "None";

export enum ChapterAction {
    None,
    Added,
}

export interface Timeline {
    author: string;
    fandom: string;
    id: string;
    name: string;
    url: string
}