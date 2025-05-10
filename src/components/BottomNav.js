import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../styles/BottomNav.css";

// ReactComponent로 import
import { ReactComponent as HomeIcon } from "../assets/bottombar/home.svg";
import { ReactComponent as ChatIcon } from "../assets/bottombar/chat.svg";
import { ReactComponent as UserIcon } from "../assets/bottombar/user.svg";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "홈", path: "/", Icon: HomeIcon },
    { label: "채팅", path: "/chat", Icon: ChatIcon },
    { label: "마이 프로필", path: "/mypage", Icon: UserIcon },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ label, path, Icon }) => {
        const isActive = location.pathname === path;

        return (
          <Button
            key={path}
            onClick={() => navigate(path)}
            color="inherit"
            sx={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: 0,
              minWidth: 0,
              color: isActive ? "#000" : "#ccc",
              fontWeight: isActive ? "bold" : "normal",
            }}
          >
            <Icon
              style={{
                width: 24,
                height: 24,
                stroke: isActive ? "#000" : "#ccc",
                fill: "none",
              }}
            />
            <span style={{ fontSize: 12, marginTop: 4 }}>{label}</span>
          </Button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
