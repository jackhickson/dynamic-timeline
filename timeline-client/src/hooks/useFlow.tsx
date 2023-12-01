import React from "react";
import { Node, ReactFlowInstance, ReactFlowJsonObject } from "reactflow";
import { nodeDataToJson, nodeJsonToData } from "../Definitions";
import { SetElementProp } from "./useAppElements";
import { AppData, CharacterAliasList, StoryBatch } from "@backend/api-types";
import { api } from "../axiosApi";

interface UseFlowProps {
    setElements: SetElementProp;
}

const flowKey = 'flow-data';

export const useFlow = ( props: UseFlowProps ) => {

    const { setElements } = props

    const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance | null>(null);

    const onSave = React.useCallback((storyBatches: StoryBatch[], charactersAliasList: CharacterAliasList[]) => {
        if (rfInstance) {
            const flow = toObject(rfInstance);

            const json : AppData = {
                characterAliasList: charactersAliasList,
                flow: flow,
                storyBatches: storyBatches
            }

            api.post("/save", json).then((response) => {

                console.info(response);
            });
        }
    }, [rfInstance]);
    
    const onRestore = React.useCallback(() => {
        const restoreFlow = async () => {
    
            const flow = JSON.parse(localStorage.getItem(flowKey) || '{}');

            // chapterMap is a Map so needs to be converted from a json object
            flow.nodes = flow.nodes.map((node: Node) => ({...node, data: nodeJsonToData(node.data)}));
        
            if (flow) {
                setElements({
                    nodes: flow.nodes || [],
                    edges: flow.edges || []
                });
            }
        };
    
        restoreFlow();
    }, []);

    const toObject = (rfInstance: ReactFlowInstance) : ReactFlowJsonObject<any, any> => {

        return {
            nodes: rfInstance.getNodes().map((n) => ({...n,data:nodeDataToJson(n.data)})),
            edges: rfInstance.getEdges().map((e) => ({ ...e })),
            viewport: {
                x: 0,
                y: 0,
                zoom : 1,
            },
        };
    };

    return { setRfInstance, onSave, onRestore };
};

