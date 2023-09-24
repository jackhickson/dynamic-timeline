import { useCallback, useState } from "react";
import { Node, Edge, ReactFlowInstance } from "reactflow";

interface UseFlowProps {
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const flowKey = 'flow-data';

export const useFlow = ( props: UseFlowProps ) => {

    const { setNodes, setEdges } = props

    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            const json = JSON.stringify(flow, null, 2);
            console.info(json);
            localStorage.setItem(flowKey, json);
        }
    }, [rfInstance]);
    
    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
    
            const flow = JSON.parse(localStorage.getItem(flowKey) || '{}');
        
            if (flow) {
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
            }
        };
    
        restoreFlow();
    }, [setNodes]);

    return { setRfInstance, onSave, onRestore };
};

