// // src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import ChatRoom from "./pages/chat/ChatRoom";
import MyPage from "./pages/MyPage";
import TaskWrite from "./pages/TaskWrite";
import Login from "./pages/LoginPage";
import OAuthRedirctHandler from "./pages/OAuthRedirectHandler";
import ExtraInfo from "./pages/ExtraInfoPage";
import "./App.css";
import RewardRefundPage from "./pages/RewardRefundPage";
import Chat from "./pages/chat/Chat";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/chatroom/:chatRoomId" element={<Chat />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/write" element={<TaskWrite />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/login/oauth2/code/kakao"
            element={<OAuthRedirctHandler />}
          />
          <Route path="/extra-info" element={<ExtraInfo />} />
          <Route path="/reward-refund" element={<RewardRefundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
