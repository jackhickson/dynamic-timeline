import { useCallback, useMemo } from 'react'
import { Background, Connection, Panel, addEdge, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.css'
import { useTheme } from 'styled-components'

import { initialNodes, initialEdges } from '../initial-elements';

import PlotPointNode from '../components/PlotPointNode';
import { ReactFlowStyled, MiniMapStyled, CustomControls} from '../components/StyledReactFlow';
import { miniMapNodeBackGroundStyle } from '../utils';

interface FlowProps {
    toggleMode: () => void;
}

export default function Flow ({toggleMode}: FlowProps): any {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const theme = useTheme()

    const nodeTypes = useMemo(() => ({ custom: PlotPointNode }), []);

    const onConnect = useCallback(
        (edge: Connection) =>
          setEdges((eds) => addEdge({ ...edge, animated: true, style: { stroke: '#fff' } }, eds)),
        [setEdges]
      );

    const handleAddNewNode = useCallback(()=> {

    },[]);

    const handleResetFlow = useCallback(()=> {
        setNodes(initialNodes);
        setEdges(initialEdges);
    },[setNodes, setEdges]);

    return (
        <div style={{height: "100vh", width: "100vw"}}>
                <ReactFlowStyled
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >

                    <Panel position="top-left">
                        <button onClick={toggleMode}>switch mode</button>
                    </Panel>

                    <Background color="#aaa" gap={16} />
                    <MiniMapStyled nodeColor={miniMapNodeBackGroundStyle(theme)} />
                    <CustomControls onAddNode={handleAddNewNode} onReset={handleResetFlow}/>
                </ReactFlowStyled>
        </div>
    )
}