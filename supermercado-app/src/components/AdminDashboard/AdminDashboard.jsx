import React, { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DashboardEntregas from "./DashboardEntregas";

const AdminDashboard = () => {
  const [option, setOption] = useState("verEntregas");

  const renderContent = () => {
    switch (option) {
      case "verEntregas":
        return <DashboardEntregas />;
      default:
        return <div>Selecciona una opción del menú</div>;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Header />
      <Sidebar setOption={setOption} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#f9f9f9", overflow: "auto" }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
