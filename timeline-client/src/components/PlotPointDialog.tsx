import React, { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { Button, Dialog, Chip, Box, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PlotPointData, createPlotPointChapterData, selectedCharacterAliasToMap } from '../Definitions';
import MultipleSelectChip from './MultipleSelectChip';
import {keysToSortedArray} from '../utils';
import { CharacterAliasList, SelectedCharacterAlias, PlotPointChapter } from '@backend/api-types';
import CustomTextArea from './CustomTextArea';

const fandomCharacterUrl = "https://thewanderinginn.fandom.com/wiki/";

interface PlotPointDialogProps {
  open: boolean;
  onDialogClose: () => void;
  onSubmit: (data: PlotPointData) => void;
  formData: PlotPointData;
  selectedChapterIndex: number;
  allChapters: string[];
  allCharacterAlias: CharacterAliasList[];
}

interface ChapterId {
  index: number;
  id: string;
}

function getPlotPointChapters(formData: PlotPointData, allChapters: string[]): ChapterId[] {

  if (!formData || !formData.chaptersMap) {
    return [];
  }

  const chapterIndexes: number[] = keysToSortedArray(formData.chaptersMap.keys());

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

    const mostRecenetChapterInfo: PlotPointChapter| undefined = Array.from(formData.chaptersMap.values()).pop();

    chapter = createPlotPointChapterData(selectedChapterIndex, mostRecenetChapterInfo);
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

  const { open, onDialogClose, onSubmit, formData, selectedChapterIndex, allChapters, allCharacterAlias } = props;

  let chapterIds: ChapterId[] = React.useMemo(()=>getPlotPointChapters(formData, allChapters),[formData, allChapters]);

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

  function handlCharaterInputChange(selectedAliases: SelectedCharacterAlias[]) {

    plotPointChapter.characters = selectedAliases;
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
      aria-describedby="modal-modal-description"
      maxWidth={"md"}
      fullWidth={true}
      scroll={'paper'}
    >

      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Plot Point Editor
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onDialogClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
          </IconButton>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: 'auto' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        style={{display:'grid'}}
      >

        <TextField id="id" label="Node id" defaultValue={formData.id} disabled />
        <TextField id="label" label="Plot point name" defaultValue={formData.label} onChange={handleLabelChange} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {chapterIds.map((chapterId) => {
            return <Chip 
                      key={"form-chip-" + chapterId.id} 
                      label={chapterId.id} 
                      variant={sameChapterIndexAsSelected(chapterId.index) ? 'filled': 'outlined'} 
                      onDelete={() => {if(chapterIds.length != 1) onDelete}}/>
          })}
        </Box>

        <MultipleSelectChip id="characters" allCharacterAliases={allCharacterAlias} 
          map={selectedCharacterAliasToMap(plotPointChapter.characters)} onCharactersChange={handlCharaterInputChange} sx={{margin: '8px'}}/>

        <br/>
        <TextField id="location" label="Location" defaultValue={formData.location} onChange={handleLocationChange} fullWidth={true}/>
        <br/>
        <CustomTextArea id="description" label="Description" defaultValue={plotPointChapter.description} onChange={handleChapterInputChange} />
        <Button type='submit'>Submit</Button>
      </Box>
    </Dialog >
  );
}

export default PlotPointDialog;