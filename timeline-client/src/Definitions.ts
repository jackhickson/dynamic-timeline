import {Node, Edge} from 'reactflow';

export const DEFAULT_LABEL = "Plot Name";

export function chaptersInfoToMap(chapters: PlotPointData[]) : Map<String, PlotPointData> {

    let map: Map<String, PlotPointData> = new Map();

    chapters.map(chapter => {
        map.set(chapter.id, chapter);
    })

    return map;
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
};

export function createPlotPointData(id: string, selectedChapterIndex: number) : PlotPointData {

    let chapterData: PlotPointChapter  = createPlotPointChapterData(selectedChapterIndex);

    let chaptersMap: Map<number, PlotPointChapter> = new Map();

    chaptersMap.set(selectedChapterIndex, chapterData);

    let plotPointData: PlotPointData = {id: id, location: "", label: DEFAULT_LABEL, chaptersMap: chaptersMap};

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