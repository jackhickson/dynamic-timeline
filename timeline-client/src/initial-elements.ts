import { CharacterAliasList, StoryBatch } from '@backend/api-types';
import { Edge, Node } from 'reactflow';
import { createPlotPointData } from './Definitions';

export const initialNodes: Node[] = [{ "id": "0-0", type: 'custom', position: { x: 0, y: 0 }, data: { label: "origin" } }];
let initialPlotPointData = createPlotPointData("0-0", 0);
initialNodes[0].data = initialPlotPointData;

console.info(initialNodes);

export const initialEdges: Edge[] = [];

export const initialChapterAliasList: CharacterAliasList[] = [
    {
        "id": "Person 1",
        "aliases": [
            "one",
             "I"
        ]
    },
    {
        "id": "Person 2",
        "aliases": [
            "two",
            "II"
        ]
    },
    {
        "id": "Person 3",
        "aliases": [
        ]
    }
];

export const initialStoryBatches: StoryBatch[] = [
    {
        "name": "Batch 1",
        "chapters": ["ch 1"]
    }
]

