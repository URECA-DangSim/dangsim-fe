import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import styles from "../../styles/Home.module.css";
import "../../styles/ChatRoom.css";
import logo from "../../assets/logo.png";

const ChatRoom = () => {
  const navigate = useNavigate();
  const listRef = useRef(null);

  const [chatRooms, setChatRooms] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchChatRooms = useCallback(async () => {
    if (!hasNext || loading) return;
    setLoading(true);
    try {
      const params = { size: 20 };
      if (cursor) {
        params.cursor = cursor;
      }
      const response = await api.get("/api/chat-rooms", { params });
      // CursorPageResponse 구조: { items: [...], nextCursor: string, hasNext: boolean }
      const { items, nextCursor, hasNext: more } = response.data;
      const rooms = Array.isArray(items) ? items : [];
      setChatRooms((prev) => [...prev, ...rooms]);
      setCursor(nextCursor);
      setHasNext(more);
    } catch (err) {
      console.error("Failed to load chat rooms", err);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasNext, loading]);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      fetchChatRooms();
    }
  };

  return (
    <div className="chat-room-container">
      <header
        className={styles.header}
        style={{ justifyContent: "flex-start" }}
      >
        <img
          src={logo}
          alt="당심 로고"
          className={styles.logo}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
        <div
          className="menuName"
          style={{ fontSize: 32, textAlign: "left", marginLeft: 16 }}
        >
          채팅
        </div>
      </header>

      <ul
        className="chat-list"
        ref={listRef}
        onScroll={onScroll}
        style={{ overflowY: "auto", height: "calc(100vh - 64px)" }}
      >
        {chatRooms.map((chat) => (
          <li
            key={chat.chatRoomId}
            className="chat-item"
            onClick={() => navigate(`/chatroom/${chat.chatRoomId}`)}
          >
            <div className="chat-info">
              <div className="name">{chat.nickname}</div>
              <div className="message-line">
                <span className="last-message">{chat.content}</span>
                <span className="time">{chat.timestamp}</span>
              </div>
            </div>
            {chat.isRead === false && <div className="unread-dot" />}
          </li>
        ))}
        {loading && <li className="loading">로딩 중...</li>}
      </ul>
    </div>
  );
};

export default ChatRoom;
