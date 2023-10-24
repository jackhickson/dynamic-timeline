import { useCallback } from "react";
import { Node, Edge, Connection, addEdge, useNodesState, useEdgesState } from "reactflow";
import { ChapterAction, PlotPointData, createPlotPointData, isNodePlotPointData, UNSELECTED_CHARACTER_ID } from "../Definitions";
import { keysToSortedArray } from '../utils';

interface UseFlowProps {
    initialNodes: Node[];
    initialEdges: Edge[];
    selectedNodeId: string;
    hideEnabled: boolean;
}

export const useNodeEdgeUpdate = ( props: UseFlowProps ) => {

    const { initialNodes, initialEdges, selectedNodeId, hideEnabled } = props;

    const [nodes, setNodes, onNodesChange] = useNodesState<PlotPointData>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds: Edge[]) => addEdge(connection, eds)),
        [setEdges]
    );

    // new node
    const onAddNode = useCallback((selectedChapterIndex: number, plotPointId: number) => {

        const id = selectedChapterIndex + "-" + plotPointId;

        const addedPlotPointData: PlotPointData = createPlotPointData(id, selectedChapterIndex);

        const newNode: Node = {
          id: id,
          type: 'custom',
          data: addedPlotPointData,
          position: {
            x: 0,
            y: 0,
          },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    // when a submit comes back from the Plot Dialog this gets updated
    const onUpdateNode = useCallback((updatedData: PlotPointData) => {

        updatedData.chapterAction = ChapterAction.Modified;

        // this is first data for the plot point so it must have been added
        if(updatedData.chaptersMap.size == 1) {

            updatedData.chapterAction = ChapterAction.Added;
        }

        setNodes((nds) =>
            nds.map((node) => {

                if(node.id === selectedNodeId){
                    node.data = {
                        ...node.data,
                        ...updatedData
                    };
                }
                
                return node;
            })
        );
    }, [setNodes, selectedNodeId]);

    /**
     * This is used to hide nodes and edges when a chapter is change.
     * Also changes the node action to what the state of the ChapterInfo for this chapterIndex
     */
    const onUpdateFromChapterChange = useCallback((selectedChapterIndex: number) => {

        // need to do this as the both the setNodes and setEdges need the new nodes at the same time
        let updatedNodes: Node[] = nodes.map((node) => {

            if(isNodePlotPointData(node)) {

                return updateNodeByChapter(node, selectedChapterIndex, hideEnabled)
            }

            return node;
        });

        setNodes(updatedNodes);

        setEdges((edges) =>

            edges.map((edge) => {

                let edgeNodes = getNodesOfEdge(edge, updatedNodes);

                if(!edgeNodes || edgeNodes.length != 2) {
                    console.info(`Invalid nodes of edge ${edge}`)
                    return edge;
                }

                return updateEdgeByChapter(edge, edgeNodes);
            })
        );

    }, [setNodes, setEdges, selectedNodeId, nodes, hideEnabled]);

    /**
     * Update the PlotPointData of the node and other settings
     * @param node 
     * @param selectedChapterIndex 
     * @returns node
     */
    const updateNodeByChapter = (node: Node<PlotPointData>, selectedChapterIndex: number, hideEnabled: boolean): Node<PlotPointData> => {

        const newNode = structuredClone(node);

        if(!isNodePlotPointData(newNode)) {
            return node;
        }

        let plotPointData: PlotPointData = newNode.data;

        let indexes: number[] = keysToSortedArray(plotPointData.chaptersMap.keys());

        let action: ChapterAction = ChapterAction.None;

        if(indexes[0] == selectedChapterIndex) {

            action = ChapterAction.Added;

        } else if (plotPointData.chaptersMap.get(selectedChapterIndex)) {

            action = ChapterAction.Modified;
        }

        plotPointData.chapterAction = action

        // if the chapter this node was created on is in the future hide the node
        newNode.hidden = indexes[0] > selectedChapterIndex && hideEnabled ? true : false;

        newNode.data = plotPointData;

        return newNode;
    }

    /**
     * Modifiy the given edge due to properties of the nodes the edge is associated with
     * @param edge 
     * @param edgeNodes 
     * @returns 
     */
    const updateEdgeByChapter = (edge: Edge, edgeNodes: [Node<PlotPointData>, Node<PlotPointData>]): Edge => {

        edge.hidden = edgeNodes != undefined && (edgeNodes[0].hidden || edgeNodes[1].hidden);
    
        return edge;
    }

    /**
     * This is used to hide nodes and edges when a chapter is change.
     * Also changes the node action to what the state of the ChapterInfo for this chapterIndex
     */
    const onUpdateFromCharacterChange = useCallback((selectedChapterIndex: number, selectedCharacterId: string) => {

        // need to do this as the both the setNodes and setEdges need the new nodes at the same time
        let updatedNodes: Node[] = nodes.map((node) => {

            if(isNodePlotPointData(node)) {

                return updateNodeByCharacter(node, selectedChapterIndex, selectedCharacterId)
            }

            return node;
        });

        setNodes(updatedNodes);

        setEdges((edges) =>

            edges.map((edge) => {

                let edgeNodes = getNodesOfEdge(edge, updatedNodes);

                if(!edgeNodes || edgeNodes.length != 2) {
                    console.info(`Invalid nodes of edge ${edge}`)
                    return edge;
                }

                return updateEdgeByCharacter(edge, edgeNodes);
            })
        );

    }, [setNodes, setEdges, selectedNodeId, nodes, hideEnabled]);

    /**
     * Update the PlotPointData when a charaterId is selected
     * @param node 
     * @param selectedChapterIndex
     * @param selectedCharacterId 
     * @returns node
     */
    const updateNodeByCharacter = (node: Node<PlotPointData>, selectedChapterIndex: number, selectedCharacterId: string): Node<PlotPointData> => {

        const newNode = structuredClone(node);

        if(!isNodePlotPointData(newNode)) {
            return node;
        }

        let plotPointData: PlotPointData = newNode.data;

        
        if(selectedCharacterId == UNSELECTED_CHARACTER_ID) {

            // when character is unselected turn off all animated nodes and edges
            plotPointData.inCharacterTimeline = false;

        } else {

            let characterFound = false;

            for (let [chapterIndex, chapter] of plotPointData.chaptersMap.entries()){

                // if the chapter the current selected chapter doesnt have knowledge of the character do not put it in animated timeline
                if(chapterIndex <= selectedChapterIndex && chapter.characters.some((character) => character.id == selectedCharacterId)) {

                    characterFound = true;
                    break;
                }
            }

            plotPointData.inCharacterTimeline = characterFound;
        }

        newNode.data = plotPointData;
        
        return newNode;
    }

    /**
     * Modifiy the given edge due to properties of the nodes the edge is associated with
     * @param edge 
     * @param edgeNodes 
     * @returns 
     */
    const updateEdgeByCharacter = (edge: Edge, edgeNodes: [Node<PlotPointData>, Node<PlotPointData>]): Edge => {

        edge.animated = edgeNodes != undefined && (edgeNodes[0].data.inCharacterTimeline && edgeNodes[1].data.inCharacterTimeline);
    
        return edge;
    }

    /**
     * Find the two nodes that are the source and destination of the node
     * Error log if there are not two nodes, because there must only be two
     * @param edge 
     * @returns 
     */
    const getNodesOfEdge = (edge: Edge, updatedNodes: Node<PlotPointData>[]): [Node<PlotPointData>, Node<PlotPointData>] | undefined => {

        let edgeNodes: Node[] = updatedNodes.filter(node => node.id === edge.source || node.id === edge.target);

        if(edgeNodes.length > 3) {

            console.error(`Too many nodes ${updatedNodes}, found for edge : ${edge}`);

            return undefined;

        } else if(edgeNodes.length <= 1) {

            console.error(`Impossible, not enough nodes ${updatedNodes} found for edge: ${edge}`);

            return undefined;
        }

        return [edgeNodes[0], edgeNodes[1]];
    };

    return {nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange,
        onConnect, onAddNode, onUpdateNode, onUpdateFromChapterChange, onUpdateFromCharacterChange};
}