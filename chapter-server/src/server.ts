import express, {Request, Response} from "express";
import bodyParser from "body-parser";
const cors = require('cors');

import { getAppData, saveAllData, testStuff } from "./timeline-files";
import { isAppData } from "./api-types";


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

// define a route handler for the default home page
app.post( "/save", ( req: Request, res: Response ) => {

    let appData: Object = req.body;

    if(isAppData(appData)) {

        saveAllData(req.body);

        res.send("Saved appData");

    } else {

        res.send("Could Not save appdata: "+ Object.keys(appData));
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