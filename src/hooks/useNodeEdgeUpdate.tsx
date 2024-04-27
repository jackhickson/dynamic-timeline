import {
    Node,
    Edge,
    Connection,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    EdgeChange,
    NodeChange,
    useUpdateNodeInternals,
    updateEdge
} from "reactflow";
import { ChapterAction, NodeMetaData, UNSELECTED_CHARACTER_ID, NODE_ID_SPLITTER } from "../Definitions";
import { constructNewNode, constructNodeId, createNodeMetaData, getEdgeId, isNodeMetaData } from '../utils';
import React from "react";
import { AppElements, TriggerUpdateProp, SetElementProp } from "./useAppElements";
import { deleteDBEdge, setDBEdge, setDBNodeData } from "../firebaseUtils";

interface UseNodeUpdateProps {
    elements: AppElements;
    setElements: SetElementProp;
    triggerUpdate: TriggerUpdateProp;
    selectedNodeId: string;
    hideEnabled: boolean;
}

enum UpdateElementsMode {
    Nodes,
    Edges
}

export const useNodeEdgeUpdate = (props: UseNodeUpdateProps) => {

    const { elements, setElements, triggerUpdate, selectedNodeId, hideEnabled } = props;
    const edgeUpdateSuccessful = React.useRef(true);
    const updateNodeInternals = useUpdateNodeInternals();

    // We declare these callbacks as React Flow suggests,
    // but we don't set the state directly. Instead, we pass
    // it to the triggerUpdate function so that it alone can
    // handle the state updates.

    const onNodesChange = React.useCallback(
        (changes: NodeChange[]) => {

            // we want to ignore the changes for the undo/redo when the node is still being dragged
            const ignoreChanges = hasDraggingChange(changes);

            triggerUpdate(UpdateElementsMode.Nodes, applyNodeChanges(changes, elements.nodes), ignoreChanges);
        },
        [triggerUpdate, elements.nodes]
    );

    const hasDraggingChange = (changes: NodeChange[]): boolean => {

        return changes.some(change => {

            if ('dragging' in change) {

                return change.dragging == true;
            }

            return true;
        });
    }

    const onEdgesChange = React.useCallback(
        (changes: EdgeChange[]) => {
            triggerUpdate(UpdateElementsMode.Edges, applyEdgeChanges(changes, elements.edges));
        },
        [triggerUpdate, elements.edges]
    );

    const onConnect = React.useCallback(
        (connection: Connection) => {
            setDBEdge({
                id: getEdgeId(connection), 
                source: connection.source || "",
                target: connection.target || ""
            })
            triggerUpdate(UpdateElementsMode.Edges, addEdge(connection, elements.edges));
        },
        [triggerUpdate, elements.edges]
    );

    const onEdgeUpdateStart = React.useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = React.useCallback((oldEdge: Edge, newConnection: Connection) => {
        edgeUpdateSuccessful.current = true;
        triggerUpdate(UpdateElementsMode.Edges, updateEdge(oldEdge, newConnection, elements.edges));
    }, [triggerUpdate]);

    const onEdgeUpdateEnd = React.useCallback((_: any, edge: Edge) => {
        if (!edgeUpdateSuccessful.current) {
            deleteDBEdge(edge.id)
            triggerUpdate(UpdateElementsMode.Edges, elements.edges.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, [triggerUpdate]);

    // new node
    const onAddNode = React.useCallback((id: string, selectedChapterIndex: number): Node => {

        const newNode = constructNewNode(id, selectedChapterIndex);

        triggerUpdate(UpdateElementsMode.Nodes, elements.nodes.concat(newNode));

        return newNode;
    }, [triggerUpdate]);

    // when a submit comes back from the Plot Dialog this gets updated
    const onUpdateNodeLabel = React.useCallback((label: string) => {

        triggerUpdate(UpdateElementsMode.Nodes,
            elements.nodes.map((node) => {

                if (node.id === selectedNodeId) {
                    node.data.label = label
                }

                return node;
            })
        );

        updateNodeInternals(selectedNodeId);

    }, [triggerUpdate, selectedNodeId, updateNodeInternals]);

    /**
     * This is used to hide nodes and edges when a chapter is change.
     * Also changes the node action to what the state of the ChapterInfo for this chapterIndex
     */
    const onUpdateFromChapterChange = React.useCallback((selectedChapterIndex: number, providedNodes?: Node[], providedEdges?: Edge[]) => {

        let nodes = !!providedNodes ? providedNodes : elements.nodes
        let edges = !!providedEdges ? providedEdges : elements.edges

        if (nodes.length == 0) {
            return;
        }

        // need to do this as the both the setNodes and setEdges need the new nodes at the same time
        let updatedNodes: Node[] = nodes.map((node) => {

            if (isNodeMetaData(node)) {

                return updateNodeByChapter(node, selectedChapterIndex, hideEnabled)
            }

            return node;
        });

        let updatedEdges = edges.map((edge) => {

            let edgeNodes = getNodesOfEdge(edge, updatedNodes);

            if (!edgeNodes || edgeNodes.length != 2) {
                console.info(`Invalid nodes of edge ${edge.id}`)
                return edge;
            }

            return updateEdgeByChapter(edge, edgeNodes);
        })

        setElements(e => ({
            nodes: updatedNodes,
            edges: updatedEdges,
        }), 'mergePastReversed', true)

    }, [setElements, selectedNodeId, elements, hideEnabled]);

    /**
     * Update the PlotPointData of the node and other settings
     * @param node 
     * @param selectedChapterIndex 
     * @returns node
     */
    const updateNodeByChapter = (node: Node<NodeMetaData>, selectedChapterIndex: number, hideEnabled: boolean): Node<NodeMetaData> => {

        const newNode = structuredClone(node);

        if (!isNodeMetaData(newNode)) {
            return node;
        }

        let nodeMetaData: NodeMetaData = newNode.data;
        let nodeChapterIndex = node.data.chapterIndex;

        nodeMetaData.chapterAction = nodeChapterIndex === selectedChapterIndex ? ChapterAction.Added : ChapterAction.None

        // if the chapter this node was created on is in the future hide the node
        newNode.hidden = nodeChapterIndex > selectedChapterIndex && hideEnabled ? true : false;

        newNode.data = nodeMetaData;

        return newNode;
    }

    /**
     * Modifiy the given edge due to properties of the nodes the edge is associated with
     * @param edge 
     * @param edgeNodes 
     * @returns 
     */
    const updateEdgeByChapter = (edge: Edge, edgeNodes: [Node, Node]): Edge => {

        edge.hidden = edgeNodes != undefined && (edgeNodes[0].hidden || edgeNodes[1].hidden);

        return edge;
    }

    /**
     * This is used to hide nodes and edges when a chapter is change.
     * Also changes the node action to what the state of the ChapterInfo for this chapterIndex
     */
    const onUpdateFromCharacterChange = React.useCallback((selectedChapterIndex: number, selectedCharacterId: string) => {

        if (elements.nodes.length == 0) {
            return;
        }

        // need to do this as the both the setNodes and setEdges need the new nodes at the same time
        let updatedNodes: Node[] = elements.nodes.map((node) => {

            if (isNodeMetaData(node)) {

                return updateNodeByCharacter(node, [], selectedChapterIndex, selectedCharacterId)
            }

            return node;
        });

        let updatedEdges = elements.edges.map((edge) => {

            let edgeNodes = getNodesOfEdge(edge, updatedNodes);

            if (!edgeNodes || edgeNodes.length != 2) {
                console.error(`Invalid nodes of edge ${edge}`)
                return edge;
            }

            return updateEdgeByCharacter(edge, edgeNodes);
        })

        setElements(e => ({
            nodes: updatedNodes,
            edges: updatedEdges,
        }), 'mergePastReversed', true)

    }, [setElements, selectedNodeId, elements, hideEnabled]);

    /**
     * Update the PlotPointData when a charaterId is selected
     * @param node 
     * @param selectedChapterIndex
     * @param selectedCharacterId 
     * @returns node
     */
    const updateNodeByCharacter = (node: Node<NodeMetaData>, nodesOfCharacterId: string[], selectedChapterIndex: number, selectedCharacterId: string): Node<NodeMetaData> => {

        const newNode = structuredClone(node);

        if (!isNodeMetaData(newNode)) {
            return node;
        }

        let nodeMetaData: NodeMetaData = newNode.data;

        if (selectedCharacterId == UNSELECTED_CHARACTER_ID) {

            // when character is unselected turn off all animated nodes and edges
            nodeMetaData.inCharacterTimeline = false;

        } else {

            nodeMetaData.inCharacterTimeline = nodesOfCharacterId.indexOf(node.id) != -1;
        }

        newNode.data = nodeMetaData;

        return newNode;
    }

    /**
     * Modifiy the given edge due to properties of the nodes the edge is associated with
     * @param edge 
     * @param edgeNodes 
     * @returns 
     */
    const updateEdgeByCharacter = (edge: Edge, edgeNodes: [Node<NodeMetaData>, Node<NodeMetaData>]): Edge => {

        edge.animated = edgeNodes != undefined && (edgeNodes[0].data.inCharacterTimeline && edgeNodes[1].data.inCharacterTimeline);

        return edge;
    }

    /**
     * Find the two nodes that are the source and destination of the node
     * Error log if there are not two nodes, because there must only be two
     * @param edge 
     * @returns 
     */
    const getNodesOfEdge = (edge: Edge, updatedNodes: Node<NodeMetaData>[]): [Node<NodeMetaData>, Node<NodeMetaData>] | undefined => {

        let edgeNodes: Node[] = updatedNodes.filter(node => node.id === edge.source || node.id === edge.target);

        if (edgeNodes.length > 3) {

            console.error(`Too many nodes ${edgeNodes.length}, found for edge : ${edge.id}`);

            return undefined;

        } else if (edgeNodes.length <= 1) {

            console.error(`Impossible, not enough nodes "${edgeNodes.length}" found for edge: ${edge.id}`);

            return undefined;
        }

        return [edgeNodes[0], edgeNodes[1]];
    };

    // not complete
    const onDeleteNode = (id: string) => {

        const [deletingChapterId, ...rest] = id.split(NODE_ID_SPLITTER);

        if (rest.length === 0 || rest.length > 1) {
            console.error(`Error parsing the node for deleting, ${deletingChapterId}: ${rest}`)
        }

        const deletingNodeId = Number(rest[0]);

        // first filter out the node to be deleted and then shift the nodes on the same chapter
        triggerUpdate(UpdateElementsMode.Nodes,
            elements.nodes
                .filter((node) => {
                    node.id !== id
                })
                .map((node) => {

                    const [chapterId, ...rest] = node.id.split(NODE_ID_SPLITTER);

                    if (rest.length === 0 || rest.length > 1) {
                        console.error(`Error parsing the node while deleting, ${chapterId}: ${rest}`)
                    }

                    const nodeId = Number(rest[0]);

                    if (chapterId !== deletingChapterId) {
                        return node;
                    }

                    // dont shift if before the node being deleted
                    if (nodeId < deletingNodeId) {
                        return node;
                    } else if (nodeId === deletingNodeId) {

                        console.error("Should not get here as it should have been filtered out above")

                    } else {

                        //shift node down
                        node.id = constructNodeId(Number(chapterId), nodeId - 1);
                    }

                    return node;
                })
        );

    }

    return {
        onNodesChange, onEdgesChange, onConnect, onEdgeUpdateStart, onEdgeUpdate, onEdgeUpdateEnd, onAddNode, onUpdateNodeLabel,
        onUpdateFromChapterChange, onUpdateFromCharacterChange, onDeleteNode
    };
}
