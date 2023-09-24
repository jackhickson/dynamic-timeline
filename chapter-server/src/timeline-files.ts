import * as fs from 'fs';
import collect from 'collect.js';

const timeAssetDir = __dirname + "/assets/timelines/";

interface NodeEdgesPair {
    "nodes": Object[]
    "edges": Object[]
  }

export function getMediaSeriesMap(media: String) : Map<String, Map<String, NodeEdgesPair>> {

    let seriesMap: Map<String, Map<String, NodeEdgesPair>> = new Map();

    const mediaFolder = timeAssetDir + media;

    // get the first for now
    let series = [fs.readdirSync(mediaFolder)[0]];

    series.forEach(function(seriesId) {

        let chaptersMap: Map<String, NodeEdgesPair> = new Map();

        let formatNumDir = mediaFolder + `/${seriesId}`

        let files = fs.readdirSync(formatNumDir);

        files.forEach(function(file) {

            let data: string = fs.readFileSync(formatNumDir +"/"+ file,'utf8')
    
            let json = JSON.parse(data);

            //console.info({file, json});

            if(!!json) {
                chaptersMap.set(file, json);
            }
        });

        seriesMap.set(seriesId, chaptersMap);
    });

    return seriesMap;
}


/** Gets the list of series Ids for the media*/
function getMediaSeriesIds(media: String) : String[] {

    const mediaFolder = timeAssetDir + media;

    return fs.readdirSync(mediaFolder);
}

function constructSeriesBases(media: String, seriesIds: String[]) : Map<String,NodeEdgesPair[]> {

    let seriesMap = getMediaSeriesMap(media);

    if(!seriesMap) {

        console.error(`Series map is not found for media: [${media}]`);
        return new Map();
    }

    let currentBase: NodeEdgesPair = {
        "nodes":[],
        "edges":[]
    };

    let bases: Map<String,NodeEdgesPair[]> = new Map();

    seriesIds.forEach(seriesId => {

        let chaptersMap = seriesMap.get(seriesId);

        if(!!chaptersMap) {

            currentBase = mergeBaseAndNewChapters(currentBase, chaptersMap)
            bases.set(seriesId, JSON.parse(JSON.stringify(currentBase)));
            
        } else {

            console.error(`Series id [${seriesId}] not found on map`);
        }
    })

    console.info(bases);

    return bases;
}

/** constructs new bases using old one, base will overwritten in this function */
function mergeBaseAndNewChapters(base: NodeEdgesPair, chapters: Map<String, NodeEdgesPair>): NodeEdgesPair {

    //for now just add the nodes and edges up
    chapters.forEach((value, key, map) => {

        if(!!value.nodes && !!value.edges) {

            base.nodes = base.nodes.concat(value.nodes);
            base.edges = base.edges.concat(value.edges);

        } else {
            console.info(`skipping chapters ${key} as nodes:[${value.edges}] or as edges[${value.nodes}]`);
        }
    })

    return base
}

export function getMediaMap(media: String) : Map<String,NodeEdgesPair[]> {

    // only use the first for now
    let seriesIds = [getMediaSeriesIds(media)[0]];

    return constructSeriesBases(media, seriesIds);
}