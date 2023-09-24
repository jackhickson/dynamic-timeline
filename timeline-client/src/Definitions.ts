import {Node, Edge, XYPosition} from 'reactflow';

export function toChaptersJsonData(json: any): ChaptersJsonData {

    let base: NodesEdgesPair = toNodeEdgePair(json.base);
    let chapters: Map<String, NodesEdgesPair> = json.chapters;//toNodeEdgePairMap(json.chapters);

    return {base, chapters};
}

function toNodeEdgePair(base: any): NodesEdgesPair {

    let nodes: Node<NodePlotPointData>[] = base.nodes;
    let edges: Edge[] = base.edges;

    return {nodes, edges};
}

/*function toNodeEdgePairMap(chapters: any): Map<String,NodeEdgesPair> {



}*/

/*function toNode(nodeData: any): Node<PlotNodeInfo> {

    let id: string = nodeData.id;
    let position: XYPosition = nodeData.position;
    let data: PlotNodeInfo = nodeData.data;

    return {id, position, data};
}

// dont care about the handles
function toEdge(edgeData: any): Edge {

    let id = edgeData.id;
    let source = edgeData.source;
    let target = edgeData.target;

    return {id, source, target};
}*/

export function chaptersInfoToMap(chapters: PlotPointChapter[]) : Map<String, PlotPointChapterInfo> {

    let map: Map<String, PlotPointChapterInfo> = new Map();

    chapters.map(chapter => {
        let info: PlotPointChapterInfo = {characters: chapter.characters, description: chapter.description};
        map.set(chapter.chapterId, info);
    })

    return map;
}


export interface ChaptersJsonData {
    base: NodesEdgesPair;
    chapters: Map<String, NodesEdgesPair>;
};

export interface NodesEdgesPair {
    nodes: Node<NodePlotPointData>[];
    edges: Edge[];
};

export interface NodePlotPointData {
    chapters: PlotPointChapter[];
    id: string;
    label: string;
    location: string;
};

export function createNewPlotPointChapterData(selectedChapter: string, allChapters: string[]) : PlotPointChapter {

    let data: PlotPointChapter  = {chapterId: '', characters:[], description: ''};

    if(!allChapters.includes(selectedChapter)) {

        const deaultChapterId = allChapters[0];

        console.error(`Selected Chapter not found in all chapters defaulting to ${deaultChapterId}`);
        
        data["chapterId"] = deaultChapterId;
        return data;
    }

    data["chapterId"] = selectedChapter;

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