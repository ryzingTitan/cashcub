"use client";

import { useState } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import AddTransactionDialog from "./AddTransactionDialog";

export default function AddTransactionModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => setIsOpen(true);

  return (
    <>
      <Tooltip title={"Add Transaction"}>
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleOpen}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <AddTransactionDialog open={isOpen} onClose={handleClose} />
    </>
  );
}
