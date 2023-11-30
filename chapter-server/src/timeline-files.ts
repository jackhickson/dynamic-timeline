import * as fs from 'fs';

import { InitialState } from './api-types';

const CHARACTER_ALIASES_FILENAME = "characterAliases.json";
const FLOW_FILENAME = "flow.json";
const STORY_BATCHES_FILENAME = "storyBatches.json";

function getJsonFromAssetsFile(filename: string) : Object {

    let characterAliasesString = fs.readFileSync(__dirname + "/assets/" + filename, 'utf8');

    return JSON.parse(characterAliasesString);
}

export function getAllData(): InitialState {

    return {
        characterAliasList: getJsonFromAssetsFile(CHARACTER_ALIASES_FILENAME),
        flow: getJsonFromAssetsFile(FLOW_FILENAME),
        storyBatches: getJsonFromAssetsFile(STORY_BATCHES_FILENAME)
    };
}


function saveToFile(filename: string, json: string) {

    fs.writeFile(__dirname + "/assets/" + filename, json, 'utf8', (()=>{}));
}