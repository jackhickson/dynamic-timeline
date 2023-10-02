import { useState, MouseEvent as ReactMouseEvent, lazy, useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {Background, Panel, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import PlotPointDialog from './components/PlotPointDialog';
import ChapterSlider from './components/ChapterSlider';
import { useDialog } from './hooks/useDialog';
import { useFlow } from './hooks/useFlow';
import { useNodeEdgeUpdate } from './hooks/useNodeEdgeUpdate';
import { PlotPointData, chaptersInfoToMap, createPlotPointData } from './Definitions';

import PlotPointNode from './components/PlotPointNode';

const minimapStyle = {
  height: 120
};

const allChapters: string[] =["1.01", "1.02", "1.03"];

const initialNodes: Node[] = [{"id":"0-1",type:'custom',position:{x:0,y:0},data:{label:"origin"}}];
const initialEdges: Edge[] = [];

let initialPlotPointData = createPlotPointData("0-1", 0);

initialNodes[0].data = initialPlotPointData;

let intialSelectedNodeId = initialNodes[0].id;

function App (): any {

    const [selectedNodeId, setSelectedNodeId] = useState<string>(intialSelectedNodeId);
    const [selectedNodeData, setSelectedNodeData] = useState<PlotPointData>(initialPlotPointData);
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);

    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onAddNode,
        onUpdateNode,
        onUpdateFromChapterChange
    } = useNodeEdgeUpdate({initialNodes, initialEdges, selectedNodeId});

    const { setRfInstance, onSave, onRestore } = useFlow({ setNodes, setEdges });
    const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

    const nodeTypes = useMemo(() => ({ custom: PlotPointNode }), []);

    const onNodeClick = (_: ReactMouseEvent, node: Node) => {

        console.info("node clicked", node);

        setSelectedNodeId(node.id);
        setSelectedNodeData(node.data);
        handleDialogOpen();
    }

    const addNewNode = () => {

        const plotPointId = 2;

        onAddNode(selectedChapterIndex, plotPointId);
    }

    const onChapterIdChange = (newChapterIndex: number) => {

        setSelectedChapterIndex(newChapterIndex);
        onUpdateFromChapterChange(newChapterIndex);
    }

    return (
        <div style={{height: "100vh", width: "100vw"}}>
            <ChapterSlider chapters={allChapters} onChapterIndexChange={onChapterIdChange}/>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
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
                selectedChapterIndex={selectedChapterIndex}
                allChapters={allChapters}/>
        </div>
    )
}

export default App
