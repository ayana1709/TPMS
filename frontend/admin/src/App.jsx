import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// Import the axios instance
import "./css/style.css";
import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import api from "./api";
import { StoreProvider, useStores } from "./contexts/storeContext";

function App() {
  const location = useLocation();
  // const { isAuthenticated } = useStores();
  // console.log(isAuthenticated);

  // useEffect(() => {
  //   document.querySelector("html").style.scrollBehavior = "auto";
  //   window.scroll({ top: 0 });
  //   document.querySelector("html").style.scrollBehavior = "";
  // }, [location.pathname]); // triggered on route change

  return (
    <>
      <StoreProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </StoreProvider>
    </>
  );
}

export default App;
