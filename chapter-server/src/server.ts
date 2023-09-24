import express, {Express, Request, Response} from "express";
import { getMediaMap } from './timeline-files.js';
import bodyParser from "body-parser";
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000"
}));
const port = 8080; // default port to listen

const mediaMap = getMediaMap("volumes");

// define a route handler for the default home page
app.get( "/series/:media/:mediaId", ( req: Request, res: Response ) => {

    let media = "volumes"; //req.media
    let mediaId = "vol-1"; //req.mediaId

    let map = getMediaMap(media);

    var obj = Object.fromEntries(map);
    var jsonString = JSON.stringify(obj);

    console.info({jsonString})

    res.send( jsonString);
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );