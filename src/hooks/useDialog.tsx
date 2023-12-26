import React from "react";

export const useDialog = () => {

  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const handleDialogOpen = React.useCallback(() => setDialogOpen(true),[]);
  const handleDialogClose = React.useCallback(() => setDialogOpen(false), []);

  return { dialogOpen, handleDialogOpen, handleDialogClose };
};