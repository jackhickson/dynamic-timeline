import { all } from 'axios';
import {Node, Edge} from 'reactflow';

export const DEFAULT_LABEL = "Plot Name";

export function nodeJsonToData(json: any) : PlotPointData {

    let data: PlotPointData = {
        id: json.id,
        location: json.location,
        label: json.label,
        chaptersMap: new Map(),
        chapterAction: ChapterAction.None
    };

    let chapterMapObject = Object.entries(json.chaptersMap);

    console.info(chapterMapObject);

    chapterMapObject.forEach((chapterProperty: [string, any]) => (data.chaptersMap.set(+chapterProperty[0], chapterProperty[1])))

    console.info(data);

    return data;
}

export function nodeDataToJson(data: PlotPointData): any {

    let jsonPlotData: any = {
        ...data,
        chaptersMap: Object.fromEntries(data.chaptersMap)
    }

    return jsonPlotData;
}

export interface ChaptersJsonData {
    base: NodesEdgesPair;
    chapters: Map<String, NodesEdgesPair>;
};

export interface NodesEdgesPair {
    nodes: Node<PlotPointData>[];
    edges: Edge[];
};

export interface PlotPointData {
    chaptersMap: Map<number, PlotPointChapter>;
    id: string;
    label: string;
    location: string;
    chapterAction: ChapterAction;
};

export function isNodePlotPointData(object: Node): object is Node<PlotPointData> {
    return 'chaptersMap' in object.data && 'chapterAction' in object.data;
}

export function createPlotPointData(id: string, selectedChapterIndex: number) : PlotPointData {

    let chapterData: PlotPointChapter  = createPlotPointChapterData(selectedChapterIndex);

    let chaptersMap: Map<number, PlotPointChapter> = new Map();

    chaptersMap.set(selectedChapterIndex, chapterData);

    let plotPointData: PlotPointData = {id: id, location: "", label: DEFAULT_LABEL, chaptersMap: chaptersMap, chapterAction: ChapterAction.Added};

    return plotPointData;
}

export function createPlotPointChapterData(selectedChapterIndex: number) : PlotPointChapter {

    if(selectedChapterIndex < 0) {

        console.error(`when creating a new plot point chapter object the selected chapter was found to be ${selectedChapterIndex}`);
    }

    let data: PlotPointChapter  = {chapterIndex: selectedChapterIndex, characters:[], description: ''};

    return data;
}

export interface PlotPointChapter extends PlotPointChapterInfo {
    chapterIndex: number;
}

export interface PlotPointChapterInfo {
    characters: string[];
    description: string;
}

export interface CharacterAlias {
    id: string;
    realName: string;
    aliases: string[];
};

export enum ChapterAction {
    None,
    Added,
    Modified
}

// ie volumes, books, audio books
export interface StoryBatch {
    name: string;
    chapters: string[];
}

export function storyBatchesToChapterList(storyBatches: StoryBatch[]): string[] {

    let allChapters: string[] = [];

    storyBatches.forEach((batch) => {

        allChapters = allChapters.concat(batch.chapters);
    })

    return allChapters;
}