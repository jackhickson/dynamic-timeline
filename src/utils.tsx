import { ChapterAction, DEFAULT_LABEL, NODE_ID_SPLITTER, NodeMetaData, PlotPointFormData } from "./Definitions";
import { StoryBatch } from "./api-types";
import { Connection, Node } from 'reactflow';

/**
 * Turns a IterableIterator, usually from a Map.keys() to a sorted array
 * @param keys 
 * @returns 
 */
export function keysToSortedArray<KeyType>(keys: IterableIterator<KeyType>): KeyType[] {

    return Array.from(keys).sort();
}

// for moving menu items in the editors
export enum Direction {
    UP, DOWN
}

// checks if a move would go out of bounds
const moveWouldBeOutOfBounds = (a: any[], index: number, direction: Direction): boolean => {

    return (index === 0 && direction === Direction.UP) || (a.length - 1 === index && direction === Direction.DOWN);
}

// move the item at an index in an array up or down
export const moveItemAtIndex = (a: any[], index: number, direction: Direction) => {

    if (moveWouldBeOutOfBounds(a, index, direction)) {
        return;
    }

    const delta = direction === Direction.UP ? -1 : 1;

    //swap
    [a[index], a[index + delta]] = [a[index + delta], a[index]]

    return a;
}

export const constructNodeId = (chapterId: number, nodeId: number) => {
    return chapterId + NODE_ID_SPLITTER + nodeId;
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

            if (!result || result instanceof ArrayBuffer) {

                resolve(result);
            } else {

                resolve(JSON.parse(result));
            }
        };
        temporaryFileReader.readAsText(file);
    });
};

export function nodeJsonToData(json: any): NodeMetaData {

    // if this plot point was created at the first chapter then make it added. 
    // might want to make the selected chapter dynamic

    let data: NodeMetaData = {
        chapterIndex: json.chapterIndex,
        label: json.label,
        chapterAction: json.chapterIndex == 0 ? ChapterAction.Added : ChapterAction.None,
        inCharacterTimeline: false
    };

    return data;
}

export const constructNewNode = (id: string, selectedChapterIndex: number): Node => {

    const addedPlotPointData: NodeMetaData = createNodeMetaData(id, selectedChapterIndex);

    return {
        id: id,
        type: 'custom',
        data: addedPlotPointData,
        position: {
            x: 0,
            y: 50,
        },
    };
}

export const updateDBNode = (node: Node): Node => {

    return {
        id: node.id,
        type: 'custom',
        data: {
            chapterIndex: node.data.chapterIndex,
            label: node.data.label,
            chapterAction: node.data.chapterIndex === 0 ? ChapterAction.Added : ChapterAction.None,
            inCharacterTimeline: false
        },
        position: node.position
    };
}

export function isNodeMetaData(object: Node): object is Node<NodeMetaData> {
    return 'inCharacterTimeline' in object.data
        && 'chapterAction' in object.data
        && 'chapterIndex' in object.data
        && 'label' in object.data;
}

export function createPlotPointFormData(id: string, selectedChapterIndex: number): PlotPointFormData {

    return {
        id: id,
        label: DEFAULT_LABEL,
        location: "",
        characters: [],
        chapterIndex: selectedChapterIndex,
        description: "",
    }
}

export function createNodeMetaData(id: string, selectedChapterIndex: number): NodeMetaData {

    let nodeMetaData: NodeMetaData = {
        chapterIndex: selectedChapterIndex,
        label: DEFAULT_LABEL,
        chapterAction: ChapterAction.Added,
        inCharacterTimeline: false
    };

    return nodeMetaData;
}

export function storyBatchesToChapterList(storyBatches: StoryBatch[]): string[] {

    let allChapters: string[] = [];

    storyBatches.forEach((batch) => {

        allChapters = allChapters.concat(batch.chapters);
    })

    return allChapters;
}

export function miniMapNodeBackGroundStyle(node: Node<NodeMetaData>, theme: any): string {

    //console.info(node, theme.nodeBg, theme.nodeAdded);

    return nodeBackGroundStyle(node.data.chapterAction, theme);
}

export function nodeBackGroundStyle(action: ChapterAction, theme: any): string {

    //console.info(action, theme)

    let backgroundColor = theme.nodeBg;

    if (action == ChapterAction.Added) {
        backgroundColor = theme.nodeAdded;
    } else if (action == ChapterAction.None) {
        backgroundColor = theme.nodeNone;
    }

    return backgroundColor;
}

export function firstChapterOfNode(allChaptersLength: number, nodes: Node<NodeMetaData>[]) {

    const chapterNodeIdsMap: Map<number, number[]> = new Map();

    // populate the map
    for (let chapterIndex = 0; chapterIndex < allChaptersLength; chapterIndex++) {

        let nodeIDs: number[] = [];

        chapterNodeIdsMap.set(chapterIndex, nodeIDs);
    }

    nodes.forEach((node, _) => {

        if (!isNodeMetaData(node)) {
            return;
        }

        const plotPointIndexofChapter = Number(node.id.split('-')[1]);

        let nodeIds: number[] | undefined = chapterNodeIdsMap.get(node.data.chapterIndex);

        if (nodeIds == undefined) {

            console.error("Undefined node ids, it should atleast be empty")

        } else {

            nodeIds.push(plotPointIndexofChapter);
        }
    })

    return chapterNodeIdsMap;
}

/* taken from reactflow github
 https://github.com/xyflow/xyflow/blob/5f07e1423b766ea53e55587c190672c351e1550a/packages/core/src/utils/graph.ts#L44
 */
export const getEdgeId = ({ source, sourceHandle, target, targetHandle }: Connection): string =>
    `reactflow__edge-${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;
