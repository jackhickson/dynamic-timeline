import React, { MouseEvent as ReactMouseEvent } from 'react'
import {Background, Panel, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.css'

import { Checkbox, SelectChangeEvent } from '@mui/material';

import { useDialog } from '../hooks/useDialog';
import { useFlow } from '../hooks/useFlow';
import { useNodeEdgeUpdate } from '../hooks/useNodeEdgeUpdate';
import { useAppElements } from '../hooks/useAppElements';
import { useStoryBatches } from '../hooks/useStoryBatches';
import { useCharactersAliasList } from '../hooks/useCharacterAliases';
import { useTheme } from 'styled-components'

import { api } from '../axiosApi';
//import { isInitialState } from '../../chapter-server/src/api-types';
import { PlotPointData, UNSELECTED_CHARACTER_ID, firstChapterOfNode, miniMapNodeBackGroundStyle, nodeJsonToData } from '../Definitions';

import { initialNodes, initialEdges, initialCharacterAliasList, initialStoryBatches } from '../initial-elements';

import { ReactFlowStyled, MiniMapStyled, CustomControls} from '../components/StyledReactFlow';
import PlotPointNode from '../components/PlotPointNode';
import PlotPointDialog from '../components/PlotPointDialog';
import ChapterSelect from '../components/ChapterSelect';
import CharacterSelect from '../components/CharacterSelect';
import EditLinkButton from '../components/EditLinkButton';


const minimapStyle = {
  height: 120
};

interface FlowProps {
    toggleMode: () => void;
}

export default function Flow ({toggleMode}: FlowProps): any {

    const [chapterNodeIdsMap, setChapterNodeIdsMap] = React.useState(new Map());
    const { storyBatches, setStoryBatches, allChapters} = useStoryBatches({initialStoryBatches});
    const { charactersAliasList, setCharactersAliasList, selectedCharacterId, setSelectedCharacterId } = useCharactersAliasList({initialCharacterAliasList});

    const [selectedNodeId, setSelectedNodeId] = React.useState<string>(initialNodes[0].id);
    const [selectedNodeData, setSelectedNodeData] = React.useState<PlotPointData>(initialNodes[0].data);
    const [selectedChapterIndex, setSelectedChapterIndex] = React.useState<number>(0);
    const [hideEnabled, setHideEnabled] = React.useState<boolean>(true);

    const {elements, setElements, triggerUpdate, undo, redo, reset} = useAppElements({initialNodes, initialEdges});

    const {
        onNodesChange,
        onEdgesChange,
        onConnect,
        onEdgeUpdateStart,
        onEdgeUpdate,
        onEdgeUpdateEnd,
        onAddNode,
        onUpdateNode,
        onUpdateFromChapterChange,
        onUpdateFromCharacterChange,
        onDeleteNode
    } = useNodeEdgeUpdate({elements, setElements, triggerUpdate, selectedNodeId, hideEnabled});

    const { setRfInstance, onSave, onRestore } = useFlow({setElements});
    const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

    const nodeTypes = React.useMemo(() => ({ custom: PlotPointNode }), []);

    // calls chapter-server to set all the deafault information
    React.useEffect(() => {

        /*api.get("/all").then((response) => {

            const data = response.data;
        
            if(true){//isInitialState(data)) {

                data.flow.nodes = data.flow.nodes.map((node: Node) => ({...node, data: nodeJsonToData(node.data)}));
        
                onUpdateFromChapterChange(
                    0,
                    data.flow.nodes || [],
                    data.flow.edges || []
                )
        
                setCharactersAliasList(data.characterAliasList || []);
                setStoryBatches(data.storyBatches || []);
            }
        });*/

    }, [])

    React.useEffect(()=>{

        setChapterNodeIdsMap(firstChapterOfNode(allChapters.length, elements.nodes))
    },[allChapters])

    const onNodeClick = React.useCallback((_: ReactMouseEvent, node: Node) => {

        console.info("node clicked", node);

        setSelectedNodeId(node.id);
        setSelectedNodeData(node.data);
        handleDialogOpen();
    }, [setSelectedNodeId, setSelectedNodeData, handleDialogOpen])

    const addNewNode = React.useCallback(() => {

        let nodeIds: number[] | undefined = chapterNodeIdsMap.get(selectedChapterIndex);

        if(nodeIds == undefined) {

            nodeIds = [];

            // need to take a look at this again
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
    }, [chapterNodeIdsMap, selectedChapterIndex, setChapterNodeIdsMap, onAddNode])

    const onChapterIndexChange = React.useCallback((newChapterIndex: number) => {

        setSelectedChapterIndex(newChapterIndex);
        onUpdateFromChapterChange(newChapterIndex);
    }, [setSelectedChapterIndex, onUpdateFromChapterChange]);

    const onCharacterIdChange = React.useCallback((event: SelectChangeEvent<string>) => {

        const newCharacter: string = event.target.value;

        setSelectedCharacterId(newCharacter);
        onUpdateFromCharacterChange(selectedChapterIndex, newCharacter);
    }, [setSelectedCharacterId, selectedChapterIndex, onUpdateFromCharacterChange]);

    const onHideChange =  React.useCallback((_: any, checked: boolean) => {

        setHideEnabled(checked);
    }, [setHideEnabled]);

    const submitUpdatedNode =  React.useCallback((updatedData: PlotPointData) => {

        onUpdateNode(updatedData, selectedCharacterId, selectedChapterIndex);
    }, [onUpdateNode, selectedCharacterId, selectedChapterIndex])

    const saveAppData = React.useCallback(() => {

        // save already has access to the rfInstance
        onSave(storyBatches, charactersAliasList);
    }, [onSave, storyBatches, charactersAliasList])

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
                    onEdgeUpdate={onEdgeUpdate}
                    onEdgeUpdateStart={onEdgeUpdateStart}
                    onEdgeUpdateEnd={onEdgeUpdateEnd}
                    onInit={setRfInstance}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                >

                    <Panel position="top-center" style={{display: 'inline-flex'}}>
            
                        <ChapterSelect storyBatches={storyBatches} onChapterIndexChange={onChapterIndexChange}/>

                        <EditLinkButton link={`/storyBatches`}/>
                        
                        <Checkbox id="hideEnabled" aria-label='Enable Hide' checked={hideEnabled} onChange={onHideChange}/>

                        <CharacterSelect 
                            allCharacterAliasList={charactersAliasList} 
                            onCharacterIdChange={onCharacterIdChange} 
                            selectedCharacterId={selectedCharacterId} 
                        />

                        <EditLinkButton link={`/characters`}/>
                        
                    </Panel>

                    <Panel position="top-left">
                        <button onClick={toggleMode}>switch mode</button>
                    </Panel>

                    <Background color="#aaa" gap={16} />
                    <MiniMapStyled nodeColor={((node: Node<PlotPointData>): string => miniMapNodeBackGroundStyle(node, theme))} />

                    <CustomControls onAddNode={addNewNode} onRedo={redo} onReset={reset} onSave={saveAppData} onRestore={onRestore} onUndo={undo}/>

                </ReactFlowStyled>

            <PlotPointDialog
                open={dialogOpen}
                onDialogClose={handleDialogClose}
                onDeleteNode={onDeleteNode}
                onSubmit={submitUpdatedNode}
                formData={selectedNodeData}
                selectedChapterIndex={selectedChapterIndex}
                allChapters={allChapters}
                allCharacterAliasList={charactersAliasList}/>
        </div>
    )
}
