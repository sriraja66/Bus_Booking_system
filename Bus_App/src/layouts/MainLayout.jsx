import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";

const MainLayout = () => {
    return (
        <Box>
            <Navbar />
            <Box component="main">
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
