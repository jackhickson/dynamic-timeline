import { Edge, Node } from 'reactflow';

export const initialNodes: Node[] = [
    { "id": "0-0", type: 'custom', position: { x: 0, y: 0 }, data: { label: "origin" } },
    { "id": "0-1", type: 'custom', position: { x: 200, y: 0 }, data: { label: "0-1" } },
    { "id": "0-2", type: 'custom', position: { x: 400, y: 0 }, data: { label: "0-2" } }
];

export const initialEdges: Edge[] = [];