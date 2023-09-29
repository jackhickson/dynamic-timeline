import { useState, MouseEvent as ReactMouseEvent, lazy, useCallback, useEffect } from 'react'
import ReactFlow, {Background, Panel, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import PlotPointDialog from './components/PlotPointDialog';
import ChapterSlider from './components/ChapterSlider';
import { useDialog } from './hooks/useDialog';
import { useFlow } from './hooks/useFlow';
import { useNodeEdgeUpdate } from './hooks/useNodeEdgeUpdate';
import { PlotPointData, chaptersInfoToMap, createPlotPointData } from './Definitions';

const minimapStyle = {
  height: 120
};

const allChapters: string[] =["1.01", "1.02", "1.03"];

const initialNodes: Node[] = [{"id":"1.01-1",position:{x:0,y:0},data:{label:"origin"}}];
const initialEdges: Edge[] = [];

let initialPlotPointData = createPlotPointData("1.01-1", "1.01");

initialNodes[0].data = initialPlotPointData;

let intialSelectedNodeId = initialNodes[0].id;

let chapters = ["1.01"];

function App (): any {

    const [selectedNodeId, setSelectedNodeId] = useState<string>(intialSelectedNodeId);
    const [selectedNodeData, setSelectedNodeData] = useState<PlotPointData>(initialPlotPointData);
    const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]);

    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onAddNode,
        onUpdateNode
    } = useNodeEdgeUpdate({initialNodes, initialEdges, selectedChapterId, chapters, selectedNodeId});

    const { setRfInstance, onSave, onRestore } = useFlow({ setNodes, setEdges });
    const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

    const onNodeClick = (_: ReactMouseEvent, node: Node) => {

        console.info("node clicked", node);

        setSelectedNodeId(node.id);
        setSelectedNodeData(node.data);
        handleDialogOpen();
    }

    const addNewNode = () => {

        onAddNode(selectedChapterId + "-" + "2");
    }

    const onChapterIdChange = (newChapterId: string) => {
        console.info(newChapterId);
    }

    return (
        <div style={{height: "100vh", width: "100vw"}}>
            <ChapterSlider chapters={allChapters} onChapterIdChange={onChapterIdChange}/>
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
                    <button onClick={addNewNode}>add node</button>
                </Panel>
                <Background color="#aaa" gap={16} />
            </ReactFlow>

            <PlotPointDialog
                open={dialogOpen}
                onDialogClose={handleDialogClose}
                onSubmit={onUpdateNode}
                formData={selectedNodeData}
                selectedChapterId={selectedChapterId}/>
        </div>
    )
}

export default App
