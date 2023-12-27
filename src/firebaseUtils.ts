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

export async function addDBNode(timelineName: string, node: Node) {

    try {

        await addDoc(collection(db, NODES), {timeline: timelineName, ...node})
        console.debug('Node successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function addDBEdge(timelineName: string, edge: Edge) {

    try {

        await addDoc(collection(db, EDGES), {timeline: timelineName, ...edge})
        console.debug('Edge successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function addDBCharacterAlias(timelineName: string, characterAlias: CharacterAliasList) {

    try {

        await addDoc(collection(db, CHARACTERALIASES),  {timeline: timelineName, ...characterAlias})
        console.debug('Character alias successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function addDBStoryBatch(timelineName: string, storyBatch: any) {

    try {

        await addDoc(collection(db, STORYBATCHES), {timeline: timelineName, ...storyBatch})
        console.debug('Character alias successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}