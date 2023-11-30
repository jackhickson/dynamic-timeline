import { CharacterAliasList, StoryBatch } from '@backend/api-types';
import {Edge, Node } from 'reactflow';
import { createPlotPointData } from './Definitions';

export const initialNodes: Node[] = [{"id":"0-0", type:'custom',position:{x:0,y:0},data:{label:"origin"}}];
let initialPlotPointData = createPlotPointData("0-0", 0);
initialNodes[0].data = initialPlotPointData;

console.info(initialNodes);

export const initialEdges: Edge[] = [];

export const initialChapterAliasList: CharacterAliasList[] = [];

export const initialStoryBatches: StoryBatch[] = [];

