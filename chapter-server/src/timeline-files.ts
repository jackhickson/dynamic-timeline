import * as fs from 'fs';

import { AppData, CharacterAliasList, StoryBatch } from './api-types';
import path from 'path';

const CHARACTER_ALIASES_FILENAME = "characterAliases.json";
const FLOW_FILENAME = "flow.json";
const STORY_BATCHES_FILENAME = "storyBatches.json";

const assetFolder = "./src/assets/";

function getJsonFromAssetsFile(filename: string) : Object {

    let characterAliasesString = fs.readFileSync(__dirname + "/assets/" + filename, 'utf8');

    return JSON.parse(characterAliasesString);
}

export function getAppData(): AppData {

    return {
        characterAliasList: getJsonFromAssetsFile(CHARACTER_ALIASES_FILENAME),
        flow: getJsonFromAssetsFile(FLOW_FILENAME),
        storyBatches: getJsonFromAssetsFile(STORY_BATCHES_FILENAME)
    };
}

// fix return
export function getCharacterAliasList(): any {

    return getJsonFromAssetsFile(CHARACTER_ALIASES_FILENAME);
}

// fix return
export function getStoryBatches(): any {

    return getJsonFromAssetsFile(STORY_BATCHES_FILENAME);
}

export function saveAllData(json: AppData) {

    saveToFile(CHARACTER_ALIASES_FILENAME, json.characterAliasList);
    saveToFile(FLOW_FILENAME, json.flow);
    saveToFile(STORY_BATCHES_FILENAME, json.storyBatches);
}

export function saveCharacterAliasList(characterAliasList: CharacterAliasList[]) {

    saveToFile(CHARACTER_ALIASES_FILENAME, characterAliasList);
}

export function saveStoryBatches(storyBatches: StoryBatch[]) {

    saveToFile(STORY_BATCHES_FILENAME, storyBatches);
}


function saveToFile(filename: string, json: any) {

    const data = JSON.stringify(json, null, 4);

    // save to current execution
    fs.writeFile(__dirname + "/assets/" + filename, data, 'utf8', (()=>{}));

    // save to permanent
    fs.writeFile(assetFolder + filename, data, 'utf8', (()=>{}));
}

export function testStuff() {

    console.info(path.resolve(assetFolder, FLOW_FILENAME))
}