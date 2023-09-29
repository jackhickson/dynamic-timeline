import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import { Button, Dialog, Chip, Box } from '@mui/material';
import { PlotPointData, PlotPointChapterInfo, CharacterAlias, createPlotPointChapterData, PlotPointChapter } from '../Definitions';
import MultipleSelectChip from './MultipleSelectChip';

const fandomCharacterUrl = "https://thewanderinginn.fandom.com/wiki/";

const allCharactersAlias: CharacterAlias[] = [
  {
    id: "1",
    realName: "Erin Solstice",
    aliases: [
      "The Crazy Human Innkeeper"
    ]
  },
  {
    id: "2",
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
  onDialogClose: () => void;
  onSubmit: (data: PlotPointData) => void;
  formData: PlotPointData;
  selectedChapterIndex: number;
  allChapters: string[];
}

interface ChapterId {
  index: number;
  id: string;
}

function getPlotPointChapters(formData: PlotPointData, allChapters: string[]): ChapterId[] {

  if (!formData || !formData.chaptersMap) {
    return [];
  }

  const chapterIndexes: number[] = Array.from(formData.chaptersMap.keys()).sort();

  return chapterIndexes.map(index => ({index, id: allChapters[index]}));
}

/**
 * Verify that the formData objects chapterMap exists, if it doesnt then empty initialize a Map
 * @param formData 
 */
function makeSureChapterMapExists(formData: PlotPointData) {

  if (!formData.chaptersMap) {

    formData.chaptersMap = new Map();
  }
}

/**
 * Get the chapterData from the formData chapterMap based on what on the selectedChapterId
 * If the chapterData does not exist then create it
 * 
 * @param formData 
 * @param selectedChapterIndex 
 * @returns chapterData: PlotPointChapter
 */
function getChapterDataFromMap(formData: PlotPointData, selectedChapterIndex: number): PlotPointChapter {

  //find the chapter data on this plot point with the selectedChapterId
  let chapter = formData.chaptersMap.get(selectedChapterIndex);

  // new chapter for this plot point
  if (chapter === undefined) {

    chapter = createPlotPointChapterData(selectedChapterIndex);
  }

  return chapter;
}

function removeChapterDataFromFormDataMap(formData: PlotPointData, selectedChapterIndex: number) {

  if(!formData.chaptersMap) {
    return;
  }

  formData.chaptersMap.delete(selectedChapterIndex)
}

/**
 * 
 * @param props : PlotPointDialogProps
 * 
 * @returns Material Dialog component to update plot point node data
 */
function PlotPointDialog(props: PlotPointDialogProps) {

  const { open, onDialogClose, onSubmit, formData, selectedChapterIndex, allChapters } = props;

  let chapterIds: ChapterId[] = getPlotPointChapters(formData, allChapters);

  /**
   * Get the chapterData from the formData for the selectedChapterId
   * If it doesnt exist it will be created
   * 
   */
  const getPlotPointChapter = (): PlotPointChapter => {

    makeSureChapterMapExists(formData);

    return getChapterDataFromMap(formData, selectedChapterIndex);
  }

  let plotPointChapter: PlotPointChapter = getPlotPointChapter();

  function handleChapterInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { id, value } = event.target;

    plotPointChapter = { ...plotPointChapter, [id]: value };
  }

  function handleLocationChange(event: ChangeEvent<HTMLInputElement>) {
    formData.location = event.target.value;
  }

  function handleLabelChange(event: ChangeEvent<HTMLInputElement>) {
    formData.label = event.target.value;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // if the selected chapter id is the same as the first in the chapters list then the location must also but updateable

    formData.chaptersMap.set(selectedChapterIndex, plotPointChapter);

    onSubmit(formData);
    onDialogClose();
  }

  function sameChapterIndexAsSelected(chapterIndex: number): boolean {

    return chapterIndex === selectedChapterIndex;
  }

  function onDelete(chapterIndex: number) {

    removeChapterDataFromFormDataMap(formData, selectedChapterIndex);
    onDialogClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onDialogClose}
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

        <TextField id="label" label="Plot point name" defaultValue={formData.label} onChange={handleLabelChange} />
        <TextField id="id" label="Node id" defaultValue={formData.id} disabled />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {chapterIds.map((chapterId) => {
            return <Chip 
                      key={chapterId.id} 
                      label={chapterId.id} 
                      variant={sameChapterIndexAsSelected(chapterId.index) ? 'filled': 'outlined'} 
                      onDelete={() => {if(chapterIds.length != 1) onDelete}}/>
          })}
        </Box>

        <TextField id="characters" label="Charaters list" defaultValue={plotPointChapter.characters} onChange={handleChapterInputChange} />
        <TextField id="description" label="Description" defaultValue={plotPointChapter.description} onChange={handleChapterInputChange} />
        <TextField id="location" label="Location" defaultValue={formData.location} onChange={handleLocationChange} />
        <Button type='submit'>Submit</Button>
      </Box>
    </Dialog >
  );
}

export default PlotPointDialog;