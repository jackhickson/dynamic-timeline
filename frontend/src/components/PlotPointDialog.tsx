import TextField from '@mui/material/TextField';
import { Button, Dialog, Grid, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PullRightDiv from './PullRightDiv'
import { Node } from 'reactflow';
import React from 'react';

interface PlotPointDialogProps {
  open: boolean;
  onDialogClose: () => void;
  node: Node | undefined
}

/**
 * 
 * @param props : PlotPointDialogProps
 * 
 * @returns Material Dialog component to update plot point node data
 */
function PlotPointDialog(props: PlotPointDialogProps) {

  const { node, open, onDialogClose } = props;

  const [formData, setFormData] = React.useState<{id: string, label: string}>({id: "N/A", label: "N/A"});

  React.useEffect(() => {

    if(node !== undefined) {

      setFormData({id: node.id, label: node.data.label});
    }

  }, [node])

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
          aria-label="close"
          onClick={onDialogClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </PullRightDiv>

        <form>
          <Grid container spacing={{ sm: 2 }} sx={{
            '& .MuiTextField-root, & .Custom-Textarea, & .MuiFormControl-root': { m: 1, width: '100%' },
          }}>

            <Grid item xs={6}>
              <TextField
                id="id"
                label="Node id"
                value={formData.id}
                disabled 
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="label"
                label="Plot point name"
                value={formData.label}
              />
            </Grid>

            <Button type='submit'>Submit</Button>
          </Grid></form>
    </Dialog >
  );
}

export default PlotPointDialog;