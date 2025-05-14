import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Home.module.css";
import "../../styles/ChatRoom.css";
import logo from "../../assets/logo.png";

// 더미 채팅방 데이터
const dummyChats = [
  {
    chatRoomId: 1,
    name: "심부름꾼 1",
    lastMessage: "바퀴벌레 잡았습니다. 확인을 눌러주세요.",
    time: "2025.05.05 15:41",
    unread: true,
  },
  {
    chatRoomId: 2,
    name: "요청자 1",
    lastMessage: "바퀴벌레 잡으러 몇시까지 오실 수 있나요?",
    time: "15:41",
    unread: false,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
  {
    chatRoomId: 3,
    name: "심부름꾼 2",
    lastMessage:
      "바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!바퀴벌레 발견했어요!",
    time: "15:40",
    unread: true,
  },
];

const ChatRoom = () => {
  const navigate = useNavigate();

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

      <ul className="chat-list">
        {dummyChats.map((chat) => (
          <li
            key={chat.chatRoomId}
            className="chat-item"
            onClick={() => navigate(`/chatroom/${chat.chatRoomId}`)}
          >
            <div className="chat-info">
              <div className="name">{chat.name}</div>
              <div className="message-line">
                <span className="last-message">{chat.lastMessage}</span>
                <span className="time">{chat.time}</span>
              </div>
            </div>
            {chat.unread && <div className="unread-dot" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoom;
