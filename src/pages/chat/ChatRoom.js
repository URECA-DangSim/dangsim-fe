import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Home.module.css";
import "../../styles/ChatRoom.css";
import api from "../../service/api";
import logo from "../../assets/logo.png";

const PAGE_SIZE = 15;

export default function ChatRoom() {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const hasNextRef = useRef(hasNext);
  const isLoadingRef = useRef(isLoading);
  const loadChatRoomsRef = useRef(null);
  const listRef = useRef(null);

  const loadChatRooms = useCallback(async () => {
    if (!hasNextRef.current || isLoadingRef.current) return;
    setIsLoading(true);
    isLoadingRef.current = true;
    try {
      const params = { size: PAGE_SIZE };
      if (cursor) params.cursor = cursor;
      const res = await api.get("/api/chat-rooms", { params });
      const { items = [], nextCursor, hasNext: next } = res.data;
      setChatRooms((prev) => [...prev, ...items]);
      setCursor(nextCursor);
      setHasNext(next);
    } catch (err) {
      console.error("Failed to load chat rooms", err);
      setHasNext(false);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [cursor]);

  useEffect(() => {
    hasNextRef.current = hasNext;
  }, [hasNext]);
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  useEffect(() => {
    loadChatRoomsRef.current = loadChatRooms;
  }, [loadChatRooms]);
  useEffect(() => {
    loadChatRoomsRef.current();
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      if (
        hasNextRef.current &&
        !isLoadingRef.current &&
        el.scrollTop + el.clientHeight >= el.scrollHeight - 100
      ) {
        loadChatRoomsRef.current();
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

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
        <div className="menuName">채팅</div>
      </header>

      <ul className="chat-list" ref={listRef}>
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
        {isLoading && <li className="loading">로딩 중...</li>}
      </ul>
    </div>
  );
}
