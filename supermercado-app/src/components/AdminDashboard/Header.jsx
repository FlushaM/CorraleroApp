import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard del Administrador
        </Typography>
        <Button color="inherit" onClick={() => console.log("Logout")}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
