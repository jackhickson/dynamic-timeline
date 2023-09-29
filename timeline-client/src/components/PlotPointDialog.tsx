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
  selectedChapterId: string;
}

function getPlotPointChapters(formData: PlotPointData): string[] {

  if (!formData || !formData.chaptersMap) {
    return [];
  }

  return Array.from(formData.chaptersMap.keys());
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
 * @param selectedChapterId 
 * @returns chapterData: PlotPointChapter
 */
function getChapterDataFromMap(formData: PlotPointData, selectedChapterId: string): PlotPointChapter {

  //find the chapter data on this plot point with the selectedChapterId
  let chapter = formData.chaptersMap.get(selectedChapterId);

  // new chapter for this plot point
  if (chapter === undefined) {

    chapter = createPlotPointChapterData(selectedChapterId);

    // TODO: maybe dont set as when data isnt added the map will have an empty 
    formData.chaptersMap.set(selectedChapterId, chapter);
  }

  return chapter;
}

function removeChapterDataFromFormDataMap(formData: PlotPointData, selectedChapterId: string) {

  if(!formData.chaptersMap) {
    return;
  }

  formData.chaptersMap.delete(selectedChapterId);
}

/**
 * 
 * @param props : PlotPointDialogProps
 * 
 * @returns Material Dialog component to update plot point node data
 */
function PlotPointDialog(props: PlotPointDialogProps) {

  const { open, onDialogClose, onSubmit, formData, selectedChapterId } = props;

  let chapterIds = getPlotPointChapters(formData);

  const getPlotPointChapter = (): PlotPointChapter => {

    makeSureChapterMapExists(formData);

    return getChapterDataFromMap(formData, selectedChapterId);
  }

  let plotPointChapter: PlotPointChapter = getPlotPointChapter();

  function handleChapterInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { id, value } = event.target;

    plotPointChapter = { ...plotPointChapter, [id]: value };

    formData.chaptersMap.set(selectedChapterId, plotPointChapter);
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

    formData.chaptersMap.set(selectedChapterId, plotPointChapter);

    onSubmit(formData);
    onDialogClose();
  }

  /**
   * This is used when the data is not submitted so do not keep the inputed chapterData
   * When a node is added it will, by default have a placeholder for the chapter that it was created on
   */
  function onClose() {

    removeChapterDataFromFormDataMap(formData, selectedChapterId);
    onDialogClose()
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

        <TextField id="label" label="Plot point name" defaultValue={formData.label} onChange={handleLabelChange} />
        <TextField id="id" label="Node id" defaultValue={formData.id} disabled />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {chapterIds.map((chapterId) => {
            return <Chip key={chapterId} label={chapterId} />
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