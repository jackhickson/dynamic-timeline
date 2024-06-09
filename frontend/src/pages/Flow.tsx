import React, { MouseEvent as ReactMouseEvent, useCallback, useMemo } from 'react'
import { Background, Connection, Node, Edge,  Panel, addEdge, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.css'
import { useTheme } from 'styled-components'
import { useDialog } from '../hooks/useDialog';

import { initialNodes, initialEdges } from '../initial-elements';

import PlotPointNode from '../components/PlotPointNode';
import { ReactFlowStyled, MiniMapStyled, CustomControls} from '../components/StyledReactFlow';
import { miniMapNodeBackGroundStyle } from '../utils';
import PlotPointDialog from '../components/PlotPointDialog';

interface FlowProps {
    toggleMode: () => void;
}

export default function Flow ({toggleMode}: FlowProps): any {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = React.useState<Node | undefined>(undefined);
    const theme = useTheme()
    const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

    const nodeTypes = useMemo(() => ({ custom: PlotPointNode }), []);

    const onConnect = useCallback(
        (edge: Connection) =>
          setEdges((eds) => addEdge({ ...edge, animated: true, style: { stroke: '#fff' } }, eds)),
        [setEdges]
      );

    const handleAddNewNode = useCallback(()=> {

    },[]);

    const handleNodeClick = React.useCallback((_: ReactMouseEvent, node: Node) => {

        setSelectedNode(nodes.find( n => n.id === node.id));
        handleDialogOpen();
    }, [nodes, handleDialogOpen])

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
                    onNodeClick={handleNodeClick}
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

                <PlotPointDialog
                    open={dialogOpen}
                    onDialogClose={handleDialogClose}
                    node={selectedNode}
                />
        </div>
    )
}