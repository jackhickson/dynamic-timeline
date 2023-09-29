import { useCallback, useState } from "react";
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges, Connection, addEdge } from "reactflow";
import { PlotPointData, createPlotPointData } from "../Definitions";

interface UseFlowProps {
    initialNodes: Node[];
    initialEdges: Edge[];
    selectedNodeId: string;
}

export const useNodeEdgeUpdate = ( props: UseFlowProps ) => {

    const { initialNodes, initialEdges } = props;

    let { selectedNodeId } = props;

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds: Edge[]) => addEdge(connection, eds)),
        [setEdges]
    );

    const onAddNode = useCallback((selectedChapterIndex: number, plotPointId: number) => {

        const id = selectedChapterIndex + "-" + plotPointId;

        const addedPlotPointData = createPlotPointData(id, selectedChapterIndex);

        console.info("add", id, addedPlotPointData,selectedChapterIndex);

        const newNode = {
          id: id,
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

    // nodes and edges have hidden option
    // when the chapter selection changes, map the hidden setting depending on the node
    //https://reactflow.dev/docs/examples/nodes/update-node/

    return {nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, onAddNode, onUpdateNode};
}