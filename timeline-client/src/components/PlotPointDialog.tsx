import api from '../chapterApi';
import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Dialog  } from '@mui/material';
import { NodePlotPointData, PlotPointChapterInfo, CharacterAlias, createNewPlotPointChapterData} from '../Definitions';
import MultipleSelectChip from './MultipleSelectChip';

const fandomCharacterUrl = "https://thewanderinginn.fandom.com/wiki/";

const allCharactersAlias: CharacterAlias[] = [
  {
    id:"1",
    realName: "Erin Solstice",
    aliases: [
      "The Crazy Human Innkeeper"
    ]
  },
  {
    id:"2",
    realName: "Teriarch",
    aliases: [
      "Eldalvin",
      "Bronze Dragon",
      "Demsleth"
    ]
  }
];

interface PlotPointDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: NodePlotPointData) => void;
    data: NodePlotPointData;
    selectedChapterId: string;
}

let defaultPlotNodeInfo: PlotPointChapterInfo = {
  characters: [],
  description: ''
}

function getPlotPointChapters(plotPointInfo: NodePlotPointData) {

  let chapterIds = new Set<String>();

  if(!plotPointInfo || !plotPointInfo.chapters) {
    return chapterIds;
  }

  plotPointInfo.chapters.map(chapter => {chapterIds.add(chapter.chapterId);});

  return chapterIds;
}

function PlotPointDialog( props: PlotPointDialogProps ) {

  const { open, onClose, onSubmit, data, selectedChapterId } = props;

  const [plotPointInfo, setPlotPointInfo] = useState<PlotPointChapterInfo>(defaultPlotNodeInfo);
  const [chapterIds, setChapterIds] = useState<Set<String>>(new Set());

  useMemo(() => {

    //find the chapter data on this plot point with the selectedChapterId
    let plotPointChapterdata = data.chapters.find(chapter => chapter.chapterId == selectedChapterId)

    // new chapter for this plot point
    if( plotPointChapterdata === undefined) {

      plotPointChapterdata = createNewPlotPointChapterData(selectedChapterId, ['1.01']);
    }
  
    setPlotPointInfo(plotPointChapterdata);
    setChapterIds(getPlotPointChapters(data));
  }, [data, selectedChapterId])

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { id, value } = event.target;
    setPlotPointInfo({ ...plotPointInfo, [id]: value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // if the selected chapter id is the same as the first in the chapters list then the location must also but updateable

    onSubmit(plotPointInfo);
    onClose();
  }

  return (
    <Dialog 
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">

        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            >

            <TextField id="label" label="Plot point name" defaultValue={plotPointInfo.label} onChange={handleInputChange}/>
            <TextField id="id" label="Node id" defaultValue={plotPointInfo.id} disabled/>
            {false && <TextField id="chapters" label="Chapters list" defaultValue={plotPointInfo.chapters} onChange={handleInputChange}/>}
            <MultipleSelectChip id="chapters" optionsList={allChapters} intialValues={chapterIds}/>
            <TextField id="characters" label="Charaters list" defaultValue={plotPointInfo.characters} onChange={handleInputChange}/>
            <TextField id="description" label="Description" defaultValue={plotPointInfo.description} onChange={handleInputChange}/>
            <TextField id="location" label="Location" defaultValue={plotPointInfo.location} onChange={handleInputChange}/>
            <Button type='submit'>Submit</Button>
        </Box>
    </Dialog >
  );
}

export default PlotPointDialog;