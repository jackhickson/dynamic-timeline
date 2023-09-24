import React, { useCallback, useEffect, useState, MouseEvent as ReactMouseEvent } from 'react'
import 'reactflow/dist/style.css';
import axios, {AxiosError} from "axios";

import api from './chapterApi';
import { toChaptersJsonData, ChaptersJsonData, PlotNodeInfo } from './Definitions';

let base = '{"nodes":[{"id":"1","position":{"x":0,"y":0},"data":{"label":"first","name":"first","chapters":["1.01"],"characters":["Erin"],"description":"here","location":"inn","mode":"ADDED"}}],"edges":[]}';

let data = '{"base":' + base + ',"chapters":[]}'

function App (): any {

    let media = "volumes";

    const [chaptersData, setChaptersData] = useState<ChaptersJsonData>({base: {nodes:[], edges:[]},chapters: new Map() });
    const [chapter, setChapter] = useState<string>('');
    const [selectedNode, setSelectedNode] = useState<Node>();

    const saveChangesToServer = async () => {
        try{
            const resp = await api.post(`/series/${media}`)
            console.info(resp.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log(error.status)
              console.error(error.response);
              // Do something with this error...
            } else {
              console.error(error);
            }
        }
    }

    const fetchSeriesChapters = async () => {
        try{
            const resp = await api.get(`/series/${media}/vol-1`)
            console.info(resp.data);
            let d = toChaptersJsonData(data);
            setChaptersData(d);
        } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log(error.status)
              console.error(error.response);
              // Do something with this error...
            } else {
              console.error(error);
            }
        }
    }

    useEffect(() => {
        fetchSeriesChapters();
    }, [])

    let d: ChaptersJsonData = JSON.parse(data);
    //console.info(d)
}

export default App
