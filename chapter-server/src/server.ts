import express, {Request, Response} from "express";
import bodyParser from "body-parser";
const cors = require('cors');

import { getAppData, getCharacterAliasList, getStoryBatches, saveAllData, saveCharacterAliasList, saveStoryBatches, testStuff } from "./timeline-files";
import { isAppData, isCharacterAliasList, isStoryBatchArray } from "./api-types";


const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000"
}));
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/all", ( _: Request, res: Response ) => {

    res.send( getAppData());
});

app.get( "/characters", ( _: Request, res: Response ) => {

    res.send( getCharacterAliasList());
});

app.get( "/storyBatches", ( _: Request, res: Response ) => {

    res.send( getStoryBatches());
});

app.post( "/save", ( req: Request, res: Response ) => {

    let appData: Object = req.body;

    if(isAppData(appData)) {

        saveAllData(appData);

        res.send("Saved appData");

    } else {

        res.send("Could Not save appdata: "+ Object.keys(appData));
    }
});

app.post( "/save/characters", ( req: Request, res: Response ) => {

    let characterAliasList: Object = req.body;

    if(isCharacterAliasList(characterAliasList)) {

        saveCharacterAliasList(characterAliasList);

        res.send("Saved characterAliasList");

    } else {

        res.send("Could Not save characterAliasList: "+ characterAliasList);
    }
});

app.post( "/save/storyBatches", ( req: Request, res: Response ) => {

    let storyBatches: Object = req.body;

    if(isStoryBatchArray(storyBatches)) {

        saveStoryBatches(storyBatches);

        res.send("Saved storyBatches");

    } else {

        res.send("Could Not save storyBatches: "+ storyBatches);
    }
});

// just for testing things
app.get( "/test", ( _: Request, res: Response ) => {

    testStuff();
    res.send("tested");
})

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );