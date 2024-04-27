import React, { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { Button, Dialog, Chip, Grid, DialogTitle, IconButton, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import { PlotPointFormData, DEFAULT_LABEL } from '../Definitions';
import MultipleSelectChip from './MultipleSelectChip';
import CustomTextArea from './CustomTextArea';
import PullRightDiv from './PullRightDiv';
import { getDBNodeData, setDBNodeData } from '../firebaseUtils';

const fandomCharacterUrl = "https://thewanderinginn.fandom.com/wiki/";

interface PlotPointDialogProps {
  open: boolean;
  onUpdatePlotLabel: (label: string) => void;
  onDialogClose: () => void;
  onDeleteNode: (id: string) => void;
  selectedNodeId: string;
  selectedChapterIndex: number;
  allChapters: string[];
  allCharacters: string[];
}

const defaultFormData: PlotPointFormData = {
  id: "id",
  label: DEFAULT_LABEL,
  location: "location",
  characters: ["Character"],
  chapterIndex: 0,
  description: "description",
}

function RenderSkeleton(): JSX.Element {
  return <Grid container spacing={{ sm: 2 }} >

    {Array.from({ length: 6 }, (_, i) => <Grid item xs={6}>
      <Skeleton variant="text" />
    </Grid>)}

  </Grid>
}

/**
 * 
 * @param props : PlotPointDialogProps
 * 
 * @returns Material Dialog component to update plot point node data
 */
function PlotPointDialog(props: PlotPointDialogProps) {

  const { open, onDialogClose, onUpdatePlotLabel, selectedNodeId, selectedChapterIndex, allChapters, allCharacters } = props;

  const [formData, setFormData] = React.useState<PlotPointFormData>(defaultFormData);
  const [loadingData, setLoadingData] = React.useState(true)

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {

    const { id, value } = event.target;

    setFormData({
      ...formData,
      [id]: value
    });
  }, [formData, setFormData])

  const handleCharatersChange = React.useCallback((selectedCharacters: string[]) => {

    setFormData({
      ...formData,
      characters: selectedCharacters
    });
  }, [formData, setFormData]);

  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setDBNodeData(formData);
    onUpdatePlotLabel(formData.label);
    onDialogClose();
  }, [formData])

  const onDelete = React.useCallback(() => {

    onDialogClose()
  }, [formData, selectedChapterIndex])

  React.useEffect(() => {

    if (!open) {

      return
    }

    getDBNodeData(selectedNodeId).then((data): void => {

      setFormData(data)
      setLoadingData(false)
    })
  }, [open, setFormData, setLoadingData])

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
          //onClick={onDelete}
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

      {loadingData ? (
        <RenderSkeleton />
      ) : (

        <form onSubmit={handleSubmit}>
          <Grid container spacing={{ sm: 2 }} sx={{
            '& .MuiTextField-root, & .Custom-Textarea, & .MuiFormControl-root': { m: 1, width: '100%' },
          }}>

            <Grid item xs={6}>
              <TextField
                id="id"
                label="Node id"
                value={formData.id}
                disabled />
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="chapter"
                label="Chapter Name"
                value={allChapters[selectedChapterIndex]}
                disabled />
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="label"
                label="Plot point name"
                value={formData.label}
                onChange={handleChange} />
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="location"
                label="Plot Location"
                value={formData.location}
                onChange={handleChange} />
            </Grid>

            <Grid item xs={6}>
              <MultipleSelectChip
                id="characters"
                allCharacters={allCharacters}
                selectedCharacters={formData.characters}
                onCharactersChange={handleCharatersChange}
                sx={{ margin: '8px' }} />
            </Grid>

            <Grid item xs={12}>
              <CustomTextArea
                id="description"
                label="Plot Description"
                value={formData.description}
                onChange={handleChange} />
            </Grid>
            <Button type='submit'>Submit</Button>
          </Grid></form>)}
    </Dialog >
  );
}

export default PlotPointDialog;