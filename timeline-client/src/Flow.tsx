import { useState, MouseEvent as ReactMouseEvent, useEffect, useMemo, ReactNode } from 'react'
import {Background, Panel, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import PlotPointDialog from './components/PlotPointDialog';
import ChapterSelect from './components/ChapterSelect';
import { useDialog } from './hooks/useDialog';
import { useFlow } from './hooks/useFlow';
import { useNodeEdgeUpdate } from './hooks/useNodeEdgeUpdate';
import { PlotPointData, createPlotPointData, StoryBatch, storyBatchesToChapterList } from './Definitions';
import { ReactFlowStyled, MiniMapStyled, ControlsStyled} from './components/StyledReactFlow';

import PlotPointNode from './components/PlotPointNode';
import { Checkbox } from '@mui/material';

const minimapStyle = {
  height: 120
};

const storyBatches: StoryBatch[] = [{name: "Volume 1", chapters: ["1.01", "1.02", "1.03"]}, {name: "Volume 2", chapters: ["2.01"]}];
const allChapters: string[] = storyBatchesToChapterList(storyBatches);

const initialNodes: Node[] = [{"id":"0-0",type:'custom',position:{x:0,y:0},data:{label:"origin"}}];
const initialEdges: Edge[] = [];

let initialPlotPointData = createPlotPointData("0-0", 0);
initialNodes[0].data = initialPlotPointData;
let intialSelectedNodeId = initialNodes[0].id;

interface FlowProps {
    children: ReactNode
}

function Flow ({children}: FlowProps): any {

    const [selectedNodeId, setSelectedNodeId] = useState<string>(intialSelectedNodeId);
    const [selectedNodeData, setSelectedNodeData] = useState<PlotPointData>(initialPlotPointData);
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
    const [hideEnabled, setHideEnabled] =  useState<boolean>(true);
    const [chapterNodeIdsMap, setChapterNodeIdsMap] = useState<Map<number, number[]>>(new Map());

    useEffect(()=> {

        allChapters.forEach((_, index) => {
            let nodeIDs: number[] = [];

            if(index === 0) {

                nodeIDs.push(0);
            }

            // need to make sure they are in order when doing it for real

            chapterNodeIdsMap.set(index, nodeIDs);
        })

        setChapterNodeIdsMap(chapterNodeIdsMap);
    }, [setChapterNodeIdsMap, chapterNodeIdsMap])

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
        onUpdateFromChapterChange,
        onUpdateFromCharacterChange
    } = useNodeEdgeUpdate({initialNodes, initialEdges, selectedNodeId, hideEnabled});

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

        console.info(chapterNodeIdsMap);

        let nodeIds: number[] | undefined = chapterNodeIdsMap.get(selectedChapterIndex);

        if(nodeIds == undefined) {

            nodeIds = [];
            setChapterNodeIdsMap(chapterNodeIdsMap.set(selectedChapterIndex, nodeIds));
        }

        let plotPointId: number = -1;
        const lastId = nodeIds.slice(-1);

        if(lastId.length == 0) {

            // first node for this cahpter
            plotPointId = 0;

        } else if (lastId.length == 1) {

            plotPointId = lastId[0] + 1;
        }

        nodeIds.push(plotPointId);

        onAddNode(selectedChapterIndex, plotPointId);
    }

    const onChapterIdChange = (newChapterIndex: number) => {

        setSelectedChapterIndex(newChapterIndex);
        onUpdateFromChapterChange(newChapterIndex);
    }

    const onHideChange = (_: any, checked: boolean) => {

        setHideEnabled(checked);
    };

    // used to hide/ unhide when not changing chapters
    useEffect(() => {

        onUpdateFromChapterChange(selectedChapterIndex);
    }, [hideEnabled])

    return (
        <div style={{height: "100vh", width: "100vw"}}>
            <ChapterSelect storyBatches={storyBatches} onChapterIndexChange={onChapterIdChange}/>
            <Checkbox id="hideEnabled" aria-label='Enable Hide' checked={hideEnabled} onChange={onHideChange}/>
            <ReactFlowStyled
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
                {children}
                <Panel position="top-right">
                    <button onClick={onSave}>save</button>
                    <button onClick={onRestore}>restore</button>
                    <button onClick={addNewNode}>add node</button>
                </Panel>
                <Background color="#aaa" gap={16} />
            </ReactFlowStyled>

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

export default Flow;
