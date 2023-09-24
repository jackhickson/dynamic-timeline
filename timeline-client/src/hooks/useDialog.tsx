import { useState } from "react";

export const useDialog = () => {

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  return { dialogOpen, handleDialogOpen, handleDialogClose };
};