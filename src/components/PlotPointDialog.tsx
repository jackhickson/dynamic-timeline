import React, { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { Button, Dialog, Chip, Box, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PlotPointData, createPlotPointChapterData, selectedCharacterAliasToMap } from '../Definitions';
import MultipleSelectChip from './MultipleSelectChip';
import {keysToSortedArray} from '../utils';
import { CharacterAliasList, SelectedCharacterAlias, PlotPointChapter } from '../api-types';
import CustomTextArea from './CustomTextArea';
import {PullRightDiv} from './PullRightDiv';
import { Delete } from '@mui/icons-material';

const fandomCharacterUrl = "https://thewanderinginn.fandom.com/wiki/";

interface PlotPointDialogProps {
  open: boolean;
  onDialogClose: () => void;
  onDeleteNode: (id: string) => void;
  onSubmit: (data: PlotPointData) => void;
  formData: PlotPointData;
  selectedChapterIndex: number;
  allChapters: string[];
  allCharacterAliasList: CharacterAliasList[];
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

  const { open, onDialogClose, onSubmit, formData, selectedChapterIndex, allChapters, allCharacterAliasList } = props;

  let chapterIds: ChapterId[] = React.useMemo(()=>getPlotPointChapters(formData, allChapters),[formData, allChapters]);

  /**
   * Get the chapterData from the formData for the selectedChapterId
   * If it doesnt exist it will be created
   * 
   */
  let plotPointChapter: PlotPointChapter = React.useMemo(() => {
    makeSureChapterMapExists(formData)

    return getChapterDataFromMap(formData, selectedChapterIndex)
  }, [formData, selectedChapterIndex]);

  const handleChapterInputChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    plotPointChapter = { ...plotPointChapter, [id]: value };
  }, [plotPointChapter]);

  const handlCharaterInputChange = React.useCallback((selectedAliases: SelectedCharacterAlias[]) => {

    plotPointChapter.characters = selectedAliases;
  }, [plotPointChapter]);

  const handleLocationChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    formData.location = event.target.value;
  }, [formData])

  const handleLabelChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    formData.label = event.target.value;
  },[formData])

  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if the selected chapter id is the same as the first in the chapters list then the location must also but updateable

    formData.chaptersMap.set(selectedChapterIndex, plotPointChapter);

    onSubmit(formData);
    onDialogClose();
  },[formData, selectedChapterIndex, onSubmit, onDialogClose])

  function sameChapterIndexAsSelected(chapterIndex: number): boolean {

    return chapterIndex === selectedChapterIndex;
  }

  const onDelete = React.useCallback((chapterIndex: number) =>{

    removeChapterDataFromFormDataMap(formData, selectedChapterIndex);
    onDialogClose()
  }, [formData, selectedChapterIndex, onDialogClose])

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

      <PullRightDiv>

        <IconButton
          aria-label="delete"
          //onClick={() => props.onDeleteNode(formData.id)}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Delete />
        </IconButton>

        <IconButton
          aria-label="close"
          onClick={onDialogClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </PullRightDiv>

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

        <MultipleSelectChip id="characters" allCharacterAliasList={allCharacterAliasList} 
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