import { useCallback, useMemo } from 'react'
import ReactFlow, { Background, Connection, addEdge, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.css'

import { initialNodes, initialEdges } from '../initial-elements';

import PlotPointNode from '../components/PlotPointNode';

export default function Flow (): any {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const nodeTypes = useMemo(() => ({ custom: PlotPointNode }), []);

    const onConnect = useCallback(
        (edge: Connection) =>
          setEdges((eds) => addEdge({ ...edge, animated: true, style: { stroke: '#fff' } }, eds)),
        [setEdges]
      );

    return (
        <div style={{height: "100vh", width: "100vw"}}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >

                    <Background color="#aaa" gap={16} />
                </ReactFlow>
        </div>
    )
}