import { Edge, Node, XYPosition } from "reactflow";
import { db } from "./firebase";
import { setDoc, doc, addDoc, collection, QueryDocumentSnapshot, DocumentData, getDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { StoryBatch } from "./api-types";
import { PlotPointFormData, Timeline } from "./Definitions";
import { Label } from "@mui/icons-material";
import { createPlotPointFormData } from "./utils";

export const FLOW = "flow";
export const CHARACTERS = "characters";
export const STORYBATCHES = "story-batches";
export const TIMELINES = "Timelines";

const NODES = "nodes"
const NODE_DATA = "node-data"
const EDGES = "edges";

const nodeConverter = {
    toFirestore: (node: Node) => {
        return {
            id: node.id,
            data: {
                label: node.data.label,
                chapterIndex: node.data.chapterIndex
            },
            position: node.position
        }
    },
    fromFirestore: (snapshot: any, options:any) : Node => {
        const node = snapshot.data(options);
        return {
            id: node.id,
            data: {
                label: node.label,
                chapterIndex: node.chapterIndex
            },
            position: node.position
        }
    }
};

const nodeDataConverter = {
    toFirestore: (data: PlotPointFormData) => {
        return {
            chapterIndex: data.chapterIndex,
            characters: data.characters,
            description: data.description,
            id: data.id,
            label: data.label,
            location: data.location,
        }
    },
    fromFirestore: (snapshot: any, options:any) : PlotPointFormData => {
        const data = snapshot.data(options);
        return {
            chapterIndex: data.chapterIndex,
            characters: data.characters,
            description: data.description,
            id: data.id,
            label: data.label,
            location: data.location,
        }
    }
};

const edgeConverter = {
    toFirestore: (edge: Edge) => {
        return {
            id: edge.id,
            source: edge.source,
            target: edge.target
        }
    },
    fromFirestore: (snapshot: any, options:any) : Edge => {
        const edge = snapshot.data(options);
        return {
            id: edge.id,
            source: edge.source,
            target: edge.target
        }
    }
};

const timelineConverter = {
    toFirestore: (timeline: Timeline) => {
        return {
            author: timeline.author,
            fandom: timeline.fandom,
            id: timeline.id,
            name: timeline.name,
            url: timeline.url
        }
    },
    fromFirestore: (snapshot: any, options:any) : Timeline => {
        const timeline = snapshot.data(options);
        return {
            author: timeline.author,
            fandom: timeline.fandom,
            id: timeline.id,
            name: timeline.name,
            url: timeline.url
        }
    }
};

const notFoundPlotPointData: PlotPointFormData = {
    chapterIndex: -1,
    characters: [],
    description: "data not found",
    id: "-1",
    label: "Not found",
    location: "N/A",
}

export async function deleteDBEdge(id: string) {

    await deleteDoc(doc(db, EDGES, id))
}

export async function deleteNode(id: string) {

    await deleteDoc(doc(db, NODES, id))
}

export async function deletNodeData(id: string) {

    await deleteDoc(doc(db, NODE_DATA, id))
}

export async function getDBNodes() : Promise<Node[]> {

    let response = await getDocs(collection(db, NODES).withConverter(nodeConverter))

    return response.docs.map(doc => doc.data())
}

export async function getDBNodeData(nodeId: string) : Promise<PlotPointFormData> {

    let response = await getDoc(doc(db, NODE_DATA, nodeId).withConverter(nodeDataConverter))

    if(response.exists()) {
        return response.data()
    }

    return notFoundPlotPointData
}

export async function getDBEdges() : Promise<Edge[]> {

    let response = await getDocs(collection(db, EDGES).withConverter(edgeConverter))

    return response.docs.map(doc => doc.data())
}

export async function getTimeLine(timelineId: string) : Promise<[Node[], Edge[]]> {

    let response = await getDocs(collection(db, EDGES).withConverter(edgeConverter))

    return response.docs.map(doc => doc.data())
}

export async function getTimeLines() : Promise<Timeline[]> {

    let response = await getDocs(collection(db, TIMELINES).withConverter(timelineConverter))

    return response.docs.map(doc => doc.data())
}

export async function setDBNode(node: Node) {

    let nodeDoc = {
        id: node.id,
        position: node.position,
        label: node.data.label,
        chapterIndex: node.data.chapterIndex
    }

    try {

        await setDoc(doc(db, NODES, node.id), nodeDoc)
        console.debug('Node successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function updateDBNodeLabel(nodeId: string, label: string) {

    try {

        await updateDoc(doc(db, NODES, nodeId), {label: label})
        console.debug('Node successfully updated')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function updateDBNodePosition(nodeId: string, position: XYPosition) {

    try {

        await updateDoc(doc(db, NODES, nodeId), {position: position})
        console.debug('Node successfully updated')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function addDBNodeData(id: string, chapterIndex: number) {

    let data = createPlotPointFormData(id, chapterIndex);

    setDBNodeData(data)
}

export async function setDBNodeData(nodeData: PlotPointFormData) {

    try {

        await setDoc(doc(db, NODE_DATA, nodeData.id), nodeData)
        console.debug('Node data successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function setDBEdge(edge: Edge) {

    let edgeDoc = {
        id: edge.id,
        source: edge.source,
        target: edge.target
    }

    try {

        await setDoc(doc(db, EDGES, edge.id), edgeDoc)
        console.debug('Edge successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function setDBCharacter(character: string) {

    try {

        await addDoc(collection(db, CHARACTERS, character), {character})
        console.debug('Character successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}

export async function setDBStoryBatch(storyBatch: any) {

    try {

        await addDoc(collection(db, STORYBATCHES), storyBatch)
        console.debug('Story batch successfully added')
    }
    catch(e) {
        console.error('Unsuccessful', e)
    }
}


