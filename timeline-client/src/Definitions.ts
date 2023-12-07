import {Node} from 'reactflow';
import { PlotPointChapter, SelectedCharacterAlias, StoryBatch } from '@backend/api-types';
import { keysToSortedArray } from './utils';

export const DEFAULT_LABEL = "Plot Name";

export function nodeJsonToData(json: any) : PlotPointData {

    let data: PlotPointData = {
        id: json.id,
        location: json.location,
        label: json.label,
        chaptersMap: new Map(),
        chapterAction: ChapterAction.None,
        inCharacterTimeline: false
    };

    let chapterMapObject = Object.entries(json.chaptersMap);

    chapterMapObject.forEach((chapterProperty: [string, any]) => {data.chaptersMap.set(+chapterProperty[0], chapterProperty[1])})

    // if this plot point was created at the first chapter then make it added. 
    // might want to make the selected chapter dynamic
    if(!!data.chaptersMap.get(0)) {
        data.chapterAction = ChapterAction.Added
    }

    return data;
}

export function nodeDataToJson(data: PlotPointData): any {

    let jsonPlotData: any = {
        ...data,
        chaptersMap: Object.fromEntries(data.chaptersMap)
    }

    return jsonPlotData;
}

export interface PlotPointData {
    chaptersMap: Map<number, PlotPointChapter>;
    id: string;
    label: string;
    location: string;
    chapterAction: ChapterAction;
    inCharacterTimeline: boolean;
};

export function isNodePlotPointData(object: Node): object is Node<PlotPointData> {
    return 'chaptersMap' in object.data && 'chapterAction' in object.data;
}

export function createPlotPointData(id: string, selectedChapterIndex: number) : PlotPointData {

    let chapterData: PlotPointChapter  = createPlotPointChapterData(selectedChapterIndex, undefined);

    let chaptersMap: Map<number, PlotPointChapter> = new Map();

    chaptersMap.set(selectedChapterIndex, chapterData);

    let plotPointData: PlotPointData = {id: id, location: "", label: DEFAULT_LABEL, chaptersMap: chaptersMap, chapterAction: ChapterAction.Added, inCharacterTimeline: false};

    return plotPointData;
}

export function createPlotPointChapterData(selectedChapterIndex: number, defaultChapterInfo: PlotPointChapter| undefined) : PlotPointChapter {

    if(selectedChapterIndex < 0) {

        console.error(`when creating a new plot point chapter object the selected chapter was found to be ${selectedChapterIndex}`);
    }

    let data: PlotPointChapter  = {chapterIndex: selectedChapterIndex, characters:[], description: ''};

    // when a new chapter is opened default the data to this chapterInfo
    if(defaultChapterInfo) {

        data.characters = defaultChapterInfo.characters;
        data.description = defaultChapterInfo.description;
    }

    return data;
}

export function mapToSelectedCharacterAliases(characterAliasMap: Map<string, string>): SelectedCharacterAlias[] {

    let selectedAliases: SelectedCharacterAlias[] = [];

    for (let [id, alias] of characterAliasMap) {

        selectedAliases.push({id, alias})
    }

    return selectedAliases;
}

export function selectedCharacterAliasToMap(selectedAliases: SelectedCharacterAlias[]): Map<string, string> {

    return new Map(selectedAliases.map((alias) => [alias.id, alias.alias]));
}

// TODO: not sure what to do with this for now
export const UNSELECTED_CHARACTER_ID = "None";

export enum ChapterAction {
    None,
    Added,
    Modified
}

export function storyBatchesToChapterList(storyBatches: StoryBatch[]): string[] {

    let allChapters: string[] = [];

    storyBatches.forEach((batch) => {

        allChapters = allChapters.concat(batch.chapters);
    })

    return allChapters;
}

export function miniMapNodeBackGroundStyle(node: Node<PlotPointData>, theme: any): string {

    //console.info(node, theme.nodeBg, theme.nodeAdded);

    return nodeBackGroundStyle(node.data.chapterAction, theme);
}

export function nodeBackGroundStyle(action: ChapterAction, theme: any): string {

    //console.info(action, theme)

    let backgroundColor = theme.nodeBg;

    if(action == ChapterAction.Added) {
        backgroundColor = theme.nodeAdded;
    } else if( action == ChapterAction.Modified) {
        backgroundColor = theme.nodeModified;
    } else if (action == ChapterAction.None) {
        backgroundColor = theme.nodeNone;
    }

    return backgroundColor;
}

export function firstChapterOfNode(allChaptersLength: number, nodes: Node[]) {

    const chapterNodeIdsMap: Map<number, number[]> = new Map();

    // populate the map
    for(let i = 0; i < allChaptersLength; i++) {
            
        let nodeIDs: number[] = [];

        chapterNodeIdsMap.set(i, nodeIDs);
    }

    nodes.forEach((node, _) => {

        if(!isNodePlotPointData(node)) {
            return;
        }

        const data = node.data;

        const numofChapter = Number(node.id.split('-')[1]);

        const chapters: number[] = keysToSortedArray(data.chaptersMap.keys());

        if(chapters.length > 0) {

            const firstChapterOfNode = chapters[0];

            let nodeIds: number[] | undefined = chapterNodeIdsMap.get(firstChapterOfNode);

            if(nodeIds == undefined) {

                nodeIds = [];

                // need to take a look at this again
                chapterNodeIdsMap.set(firstChapterOfNode, nodeIds);
            }

            nodeIds.push(numofChapter);
        }
    })

    return chapterNodeIdsMap;
}