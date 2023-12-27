import { CharacterAliasList, StoryBatch } from './api-types';
import { Edge, Node } from 'reactflow';
import { createPlotPointData } from './Definitions';

export const initialNodes: Node[] = [{ "id": "0-0", type: 'custom', position: { x: 0, y: 0 }, data: { label: "origin" } }];
let initialPlotPointData = createPlotPointData("0-0", 0);
initialNodes[0].data = initialPlotPointData;

export const initialEdges: Edge[] = [];

export const initialCharacterAliasList: CharacterAliasList[] = [
    {
        "characterId": "Character 1",
        "aliases": [
            "one",
            "I"
        ]
    },
    {
        "characterId": "Character 2",
        "aliases": [
            "two",
            "II"
        ]
    },
    {
        "characterId": "Character 3",
        "aliases": [
        ]
    },
    {
        "characterId": "Character 5",
        "aliases": [
        ]
    },
    {
        "characterId": "Character 6",
        "aliases": [
        ]
    },
    {
        "characterId": "Character 7",
        "aliases": [
        ]
    },
    {
        "characterId": "Character 8",
        "aliases": [
        ]
    },
    {
        "characterId": "Character 9",
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

