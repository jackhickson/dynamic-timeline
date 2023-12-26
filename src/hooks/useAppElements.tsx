import React from "react";
import { Edge, Node } from "reactflow";
import useUndoable, { MutationBehavior } from "use-undoable";

interface UseAppElementsProps {
    initialNodes: Node[];
    initialEdges: Edge[];
}

export interface AppElements {
    nodes: Node[];
    edges: Edge[];
}

export interface TriggerUpdateProp {
    (t: UpdateElementsMode, v: any, ignoreAction?: boolean): void
}

export interface SetElementProp {
    (payload: {
        nodes: Node[];
        edges: Edge[];
    } | ((oldValue: {
        nodes: Node[];
        edges: Edge[];
    }) => {
        nodes: Node[];
        edges: Edge[];
    }), behavior?: MutationBehavior | undefined, ignoreAction?: boolean | undefined): void
}

export enum UpdateElementsMode {
    Nodes,
    Edges
}

export const useAppElements = ( props: UseAppElementsProps ) => {

    const { initialNodes, initialEdges } = props;

    const [elements, setElements, { undo, redo, reset }] = useUndoable({
		nodes: initialNodes,
		edges: initialEdges,
	});

    /**
     * Use this only when changing one part of the elements otherwise use setElements
     */
    const triggerUpdate: TriggerUpdateProp = React.useCallback(
		(t: UpdateElementsMode, v: any, ignoreAction: boolean = false) => {

			// To prevent a mismatch of state updates,
			// we'll use the value passed into this
			// function instead of the state directly.
			setElements(e => ({
				nodes: t === UpdateElementsMode.Nodes ? v : e.nodes,
				edges: t === UpdateElementsMode.Edges ? v : e.edges,
			}), 'mergePastReversed', ignoreAction);
		},
		[setElements]
	);

    return {elements, setElements, triggerUpdate, undo, redo, reset};
}