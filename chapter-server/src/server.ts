import express, {Request, Response} from "express";
import bodyParser from "body-parser";
const cors = require('cors');

import { getAllData } from "./timeline-files";


const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000"
}));
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/all", ( _: Request, res: Response ) => {

    res.send( getAllData());
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );