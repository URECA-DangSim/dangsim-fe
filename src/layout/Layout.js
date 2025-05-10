// src/layout/Layout.js
import React from "react";
import BottomNav from "../components/BottomNav";
import "../styles/Layout.css";

function Layout({ children }) {
  return (
    <div className="app-container">
      <main className="main-content">{children}</main>
      <BottomNav />
    </div>
  );
}

export default Layout;
