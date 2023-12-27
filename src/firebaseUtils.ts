import { Edge, Node } from "reactflow";
import { db } from "./firebase";
import { setDoc, doc, addDoc, collection } from "firebase/firestore";
import { CharacterAliasList, StoryBatch } from "./api-types";

export const FLOW = "flow";
export const CHARACTERALIASES = "character-aliases";
export const STORYBATCHES = "story-batches";
export const TIMELINE = "timeline";

const NODES = "nodes"
const EDGES = "edges";

export async function setDBNode(timelineName: string, node: Node) {

    try {

        await setDoc(doc(db, timelineName, FLOW, NODES, node.id), node)
        console.debug('Node successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function setDBEdge(timelineName: string, edge: Edge) {

    try {

        await setDoc(doc(db, timelineName, FLOW, EDGES, edge.id), edge)
        console.debug('Edge successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function setDBCharacterAlias(timelineName: string, characterAlias: CharacterAliasList) {

    try {

        await addDoc(collection(db, timelineName, CHARACTERALIASES), characterAlias)
        console.debug('Character alias successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function setDBStoryBatches(timelineName: string, storyBatches: any) {

    try {

        await setDoc(doc(db, timelineName, STORYBATCHES), storyBatches)
        console.debug('Character alias successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}