// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import MyPage from "./pages/MyPage";
import Login from "./pages/LoginPage";
import OAuthRedirctHandler from "./pages/OAuthRedirectHandler";
import ExtraInfo from "./pages/ExtraInfoPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/login/oauth2/code/kakao"
            element={<OAuthRedirctHandler />}
          />
          <Route path="/extra-info" element={<ExtraInfo />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
