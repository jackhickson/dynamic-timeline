import { useState, MouseEvent as ReactMouseEvent } from 'react'
import ReactFlow, {Background, Panel, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import PlotPointDialog from './components/PlotPointDialog';
import { useDialog } from './hooks/useDialog';
import { useFlow } from './hooks/useFlow';
import { useNodeEdgeUpdate } from './hooks/useNodeEdgeUpdate';
import { PlotPointChapter } from './Definitions';

const minimapStyle = {
  height: 120
};

const allChapters: string[] =["1.01", "1.02", "1.03"];

const initialNodes: Node[] = [{"id":"1",position:{x:0,y:0},data:{label:"origin"}}];
const initialEdges: Edge[] = [];

let plotData = new Map<string, PlotPointChapter>();

let intialSelectedNodeId = initialNodes[0].id;

if(!intialSelectedNodeId || intialSelectedNodeId === '') {

   console.error(`Initial selected node id "${intialSelectedNodeId}" is not set`);
}

let chapters = ["1.01"];
let currentChapter = chapters[0];

function App (): any {

    const [selectedNodeId, setSelectedNodeId] = useState<string>(intialSelectedNodeId);
    const {nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onAdd,
        onUpdateNode} = useNodeEdgeUpdate({initialNodes, initialEdges, selectedNodeId, currentChapter, chapters});

    const {setRfInstance, onSave, onRestore} = useFlow({setNodes, setEdges});
    const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

    const onNodeClick = (_: ReactMouseEvent, node: Node) => {

        setSelectedNodeId(node.id)
        handleDialogOpen()
    }

    return (
        <div style={{height: "100vh", width: "100vw"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                onNodeClick={onNodeClick}
                fitView
            >
                <Panel position="top-right">
                    <button onClick={onSave}>save</button>
                    <button onClick={onRestore}>restore</button>
                    <button onClick={onAdd}>add node</button>
                </Panel>
                <Background color="#aaa" gap={16} />
            </ReactFlow>

            <PlotPointDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onSubmit={onUpdateNode}
                data={selectedNode?.data}
                selectedChapterId='1.01'/>
        </div>
    )
}

export default App
