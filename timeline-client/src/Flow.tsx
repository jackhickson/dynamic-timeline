import React, { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import {Background, Panel, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { Checkbox, SelectChangeEvent } from '@mui/material';

import { useDialog } from './hooks/useDialog';
import { useFlow } from './hooks/useFlow';
import { useNodeEdgeUpdate } from './hooks/useNodeEdgeUpdate';
import { useAppElements } from './hooks/useAppElements';
import { useTheme } from 'styled-components'

import { PlotPointData, createPlotPointData, storyBatchesToChapterList, miniMapNodeBackGroundStyle } from './Definitions';
import { CharacterAliasList, StoryBatch } from '@backend/api-types';

import { ReactFlowStyled, MiniMapStyled, CustomControls} from './components/StyledReactFlow';
import PlotPointNode from './components/PlotPointNode';
import PlotPointDialog from './components/PlotPointDialog';
import ChapterSelect from './components/ChapterSelect';
import CharacterSelect from './components/CharacterSelect';

const minimapStyle = {
  height: 120
};

const allCharactersAlias: CharacterAliasList[] = [
    {
      id: "Erin Solstice",
      aliases: [
        "The Crazy Human Innkeeper"
      ]
    },
    {
      id: "Teriarch",
      aliases: [
        "Eldalvin",
        "Bronze Dragon",
        "Demsleth"
      ]
    }
];

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

    const [selectedNodeId, setSelectedNodeId] = React.useState<string>(intialSelectedNodeId);
    const [selectedNodeData, setSelectedNodeData] = React.useState<PlotPointData>(initialPlotPointData);
    const [selectedChapterIndex, setSelectedChapterIndex] = React.useState<number>(0);
    const [hideEnabled, setHideEnabled] = React.useState<boolean>(true);
    const [chapterNodeIdsMap, setChapterNodeIdsMap] = React.useState<Map<number, number[]>>(new Map());
    const [selectedCharacterId, setSelectedCharacterId] = React.useState<string>('');

    React.useEffect(()=> {

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

    const {elements, setElements, triggerUpdate, undo, redo, reset} = useAppElements({initialNodes, initialEdges});

    const {
        onNodesChange,
        onEdgesChange,
        onConnect,
        onAddNode,
        onUpdateNode,
        onUpdateFromChapterChange,
        onUpdateFromCharacterChange
    } = useNodeEdgeUpdate({elements, setElements, triggerUpdate, selectedNodeId, hideEnabled});

    const { setRfInstance, onSave, onRestore } = useFlow({setElements});
    const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

    const nodeTypes = React.useMemo(() => ({ custom: PlotPointNode }), []);

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

    const onChapterIndexChange = (newChapterIndex: number) => {

        setSelectedChapterIndex(newChapterIndex);
        onUpdateFromChapterChange(newChapterIndex);
    }

    const onCharacterIdChange = (event: SelectChangeEvent<string>) => {

        const newCharacter: string = event.target.value;

        setSelectedCharacterId(newCharacter);
        onUpdateFromCharacterChange(selectedChapterIndex,newCharacter);
    }

    const onHideChange = (_: any, checked: boolean) => {

        setHideEnabled(checked);
    };

    const submitUpdatedNode = (updatedData: PlotPointData) => {

        onUpdateNode(updatedData, selectedCharacterId, selectedChapterIndex);
    } 

    // used to hide/ unhide when not changing chapters
    React.useEffect(() => {

        onUpdateFromChapterChange(selectedChapterIndex);
    }, [hideEnabled])

    const theme = useTheme()

    return (
        <div style={{height: "100vh", width: "100vw"}}>

            <ReactFlowStyled
                nodes={elements.nodes}
                edges={elements.edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
            >
                {children}

                <Panel position="top-center" style={{display: 'inline-flex'}}>
        
                    <ChapterSelect storyBatches={storyBatches} onChapterIndexChange={onChapterIndexChange}/>
                    <Checkbox id="hideEnabled" aria-label='Enable Hide' checked={hideEnabled} onChange={onHideChange}/>

                    <CharacterSelect 
                        allCharactersAlias={allCharactersAlias} 
                        onCharacterIdChange={onCharacterIdChange} 
                        selectedCharacterId={selectedCharacterId} 
                    />
                </Panel>

                <Panel position="top-right">

                </Panel>

                <Background color="#aaa" gap={16} />
                <MiniMapStyled nodeColor={((node: Node<PlotPointData>): string => miniMapNodeBackGroundStyle(node, theme))} />

                <CustomControls onAddNode={addNewNode} onRedo={redo} onReset={reset} onSave={onSave} onRestore={onRestore} onUndo={undo}/>

            </ReactFlowStyled>

            <PlotPointDialog
                open={dialogOpen}
                onDialogClose={handleDialogClose}
                onSubmit={submitUpdatedNode}
                formData={selectedNodeData}
                selectedChapterIndex={selectedChapterIndex}
                allChapters={allChapters}
                allCharacterAlias={allCharactersAlias}/>
        </div>
    )
}

export default Flow;
