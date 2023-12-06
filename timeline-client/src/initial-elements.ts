import { CharacterAliasList, StoryBatch } from '@backend/api-types';
import { Edge, Node } from 'reactflow';
import { createPlotPointData } from './Definitions';

export const initialNodes: Node[] = [{ "id": "0-0", type: 'custom', position: { x: 0, y: 0 }, data: { label: "origin" } }];
let initialPlotPointData = createPlotPointData("0-0", 0);
initialNodes[0].data = initialPlotPointData;

export const initialEdges: Edge[] = [];

export const initialCharacterAliasList: CharacterAliasList[] = [
    {
        "id": "Character 1",
        "aliases": [
            "one",
            "I"
        ]
    },
    {
        "id": "Character 2",
        "aliases": [
            "two",
            "II"
        ]
    },
    {
        "id": "Character 3",
        "aliases": [
        ]
    },
    {
        "id": "Character 5",
        "aliases": [
        ]
    },
    {
        "id": "Character 6",
        "aliases": [
        ]
    },
    {
        "id": "Character 7",
        "aliases": [
        ]
    },
    {
        "id": "Character 8",
        "aliases": [
        ]
    },
    {
        "id": "Character 9",
        "aliases": [
        ]
    }
];

export const initialStoryBatches: StoryBatch[] = [
    {
        "name": "Batch 1",
        "chapters": ["ch 1", "ch 2"]
    },
    {
        "name": "Batch 2",
        "chapters": ["ch 1", "ch 2"]
    }
]

