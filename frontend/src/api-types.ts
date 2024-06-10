import { Edge, Node, Viewport } from "reactflow";

export interface TimeLineData {
    characters: any,
    flow: {nodes: Node[], edges: Edge[], viewport: Viewport},
    storyBatches: any
}

export function isTimeLineData(object: any): object is TimeLineData {
    return 'characters' in object && 'flow' in object && 'storyBatches' in object;
}

// ie volumes, books, audio books
export interface StoryBatch {
    name: string;
    chapters: string[];
}

export function isStoryBatchArray(object: any): object is StoryBatch[] {

    return Array.isArray(object) && (object.length === 0 || ('name' in object[0] && 'chapters' in object[0]))
}