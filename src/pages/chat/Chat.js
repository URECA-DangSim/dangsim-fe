import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../service/api";
import { Client } from "@stomp/stompjs";
import backIcon from "../../assets/back-btn.png";
import taskAvatar from "../../assets/logo.png";
import "../../styles/Chat.css";

const Chat = () => {
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  const [chatRoomInfo, setChatRoomInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const isLoadingRef = useRef(false);
  const initialLoadRef = useRef(true);
  const stompRef = useRef(null);
  const cursorRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/api/chat-rooms/${chatRoomId}/taskInfo`);
        setChatRoomInfo(res.data);
        setCurrentUserId(res.data.myId);
      } catch (err) {
        console.error("채팅방 정보 조회 실패", err);
      }
    };
    fetchInfo();
  }, [chatRoomId]);

  const loadMessages = async () => {
    if (!hasNext || isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const params = { size: 15 };
      if (cursorRef.current) params.cursor = cursorRef.current;

      const res = await api.get(`/api/chat-rooms/${chatRoomId}`, { params });
      const older = res.data.items.flatMap((i) => i.messages).reverse();

      setMessages((prev) => [...older, ...prev]);

      setCursor(res.data.nextCursor);
      cursorRef.current = res.data.nextCursor;

      setHasNext(res.data.hasNext);

      if (initialLoadRef.current) {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (err) {
      console.error("메시지 로딩 실패", err);
    } finally {
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    initialLoadRef.current = true;
    setMessages([]);
    cursorRef.current = null;
    setCursor(null);
    setHasNext(true);
    loadMessages();
  }, [chatRoomId]);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (initialLoadRef.current) {
        const nearBottom =
          window.innerHeight + window.scrollY >=
          document.body.scrollHeight - 50;
        if (nearBottom) {
          initialLoadRef.current = false;
        }
      }

      if (
        window.scrollY <= 100 &&
        hasNext &&
        !isLoadingRef.current &&
        !initialLoadRef.current
      ) {
        loadMessages();
      }
    };

    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [chatRoomId, hasNext]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const client = new Client({
      brokerURL: `ws://localhost:8080/ws-chat`,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/sub/chat-rooms/${chatRoomId}`, (frame) => {
        const payload = JSON.parse(frame.body);
        setMessages((prev) => {
          const next = [...prev, payload];
          setTimeout(() => {
            scrollToBottom();
          }, 100);
          return next;
        });
      });
    };
    client.onStompError = (frame) => console.error("STOMP 에러", frame);
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [chatRoomId]);

  const handleSend = () => {
    if (!input.trim()) return;
    const client = stompRef.current;
    if (!client?.connected) return;
    client.publish({
      destination: `/pub/chat-rooms/${chatRoomId}`,
      body: JSON.stringify({
        content: input,
        type: "TALK",
        senderId: currentUserId,
      }),
    });
    setInput("");
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  if (!chatRoomInfo) return <div>로딩 중...</div>;

  const handleTaskClick = () => {
    navigate(`/task/${chatRoomInfo.taskInfo.taskId}`);
  };

  return (
    <>
      <header className="chat-header">
        <img
          src={backIcon}
          alt="뒤로가기"
          className="back-btn"
          onClick={() => navigate(-1)}
        />
        <h2 className="partner-name">{chatRoomInfo.partnerNickname}</h2>
      </header>

      <div className="task-card">
        <img src={taskAvatar} alt="Task" className="task-avatar" />
        <div className="task-details" onClick={handleTaskClick}>
          <div className="task-title">{chatRoomInfo.taskInfo.title}</div>
          <div className="task-meta">
            <span className="task-date">{chatRoomInfo.taskInfo.deadline}</span>
            <span className="task-price">{chatRoomInfo.taskInfo.reward}</span>
          </div>
        </div>
        <button className="task-status">
          {chatRoomInfo.taskInfo.isCompleted ? "완료됨" : "진행 중"}
        </button>
      </div>

      <div className="message-list" ref={listRef}>
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={msg.messageId || `${msg.senderId}-${msg.timeStamp}`}
              className={`bubble ${isMine ? "mine" : "partner"}`}
            >
              <p className="bubble-text">{msg.content}</p>
              <span className="bubble-time">{msg.timeStamp}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="send-btn" onClick={handleSend}>
          전송
        </button>
      </div>
    </>
  );
};

export default Chat;
