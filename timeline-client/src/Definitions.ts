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
    chaptersMap: Map<string, PlotPointChapter>;
    id: string;
    label: string;
    location: string;
};

export function createPlotPointData(id: string, selectedChapterId: string) : PlotPointData {

    let chapterData: PlotPointChapter  = createPlotPointChapterData(selectedChapterId);

    let chaptersMap = new Map();

    chaptersMap.set(selectedChapterId, chapterData);

    let plotPointData: PlotPointData = {id: id, location: "", label: DEFAULT_LABEL, chaptersMap: chaptersMap};

    return plotPointData;
}

export function createPlotPointChapterData(selectedChapterId: string) : PlotPointChapter {

    if(!selectedChapterId) {

        console.error(`when creating a new plot point chapter object the selected chapter was found to be ${selectedChapterId}`);
    }

    let data: PlotPointChapter  = {chapterId: selectedChapterId, characters:[], description: ''};

    return data;
}

export interface PlotPointChapter extends PlotPointChapterInfo {
    chapterId: string;
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