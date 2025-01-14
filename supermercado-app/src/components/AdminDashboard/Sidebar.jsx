import React from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material"; // Importar Box correctamente
import { FaTable } from "react-icons/fa";

const Sidebar = ({ setOption }) => {
  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: "#f4f4f4",
        height: "100vh",
        boxShadow: "2px 0 5px rgba(14, 3, 3, 0.1)",
        display: "flex",
        flexDirection: "column",
        padding: "30px",
      }}
    >
      <h3>Admin Panel</h3>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => setOption("verEntregas")}
          sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#e0e0e0" } }}
        >
          <ListItemIcon>
            <FaTable />
          </ListItemIcon>
          <ListItemText primary="Ver Entregas" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
