import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "../../assets/back-btn.png"; // 뒤로가기 아이콘
import taskAvatar from "../../assets/logo.png"; // Task 썸네일 더미 이미지

// ChatRoomInfoResponse 더미 데이터
const chatRoomInfo = {
  chatRoomId: 3,
  taskInfo: {
    title: "바퀴벌레 잡아주세요",
    date: "24.05.01 15:00",
    price: "5,000원",
    status: "심부름 완료",
  },
  chatPartnerId: 42,
  partnerNickname: "심부름꾼 2",
};

// ChatMessageDetailResponse 더미 데이터
const dummyMessages = [
  {
    messageId: 1,
    senderId: 42,
    content: "안녕하세요! 바퀴벌레가 집에 있어요.",
    timeStamp: "15:01",
  },
  {
    messageId: 2,
    senderId: 1,
    content: "지금 출발할게요.",
    timeStamp: "15:02",
  },
  {
    messageId: 3,
    senderId: 42,
    content: "감사합니다!",
    timeStamp: "2024. 05. 12 15:03",
  },
  {
    messageId: 4,
    senderId: 42,
    content: "감사합니다!",
    timeStamp: "2024. 05. 12 15:03",
  },
  {
    messageId: 5,
    senderId: 42,
    content:
      "감사합니다!감사합니다!감사합니다!감사합니다!감사합니다!감사합니다!감사합니다!감사합니다!감사합니다!감사합니다!감사합니다!감사합니다!",
    timeStamp: "2024. 05. 12 15:03",
  },
  {
    messageId: 6,
    senderId: 42,
    content: "감사합니다!",
    timeStamp: "2024. 05. 12 15:03",
  },
  {
    messageId: 7,
    senderId: 42,
    content: "감사합니다!",
    timeStamp: "2024. 05. 12 15:03",
  },
  {
    messageId: 8,
    senderId: 42,
    content: "감사합니다!",
    timeStamp: "2024. 05. 12 15:03",
  },
];

const currentUserId = 1; // 본인 ID 더미

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMsg = {
      messageId: Date.now(),
      senderId: currentUserId,
      content: input,
      timeStamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* 헤더: 뒤로가기 + 상대방 닉네임 */}
      <header className="chat-header">
        <img
          src={backIcon}
          alt="뒤로가기"
          className="back-btn"
          onClick={() => navigate(-1)}
        />
        <h2 className="partner-name">{chatRoomInfo.partnerNickname}</h2>
      </header>

      {/* Task Info 카드 */}
      <div className="task-card">
        <img src={taskAvatar} alt="Task" className="task-avatar" />
        <div className="task-details">
          <div className="task-title">{chatRoomInfo.taskInfo.title}</div>
          <div className="task-meta">
            <span className="task-date">{chatRoomInfo.taskInfo.date}</span>
            <span className="task-price">{chatRoomInfo.taskInfo.price}</span>
          </div>
        </div>
        <button className="task-status">{chatRoomInfo.taskInfo.status}</button>
      </div>

      {/* 메시지 리스트 */}
      <div className="message-list">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={msg.messageId}
              className={isMine ? "bubble mine" : "bubble partner"}
            >
              <p className="bubble-text">{msg.content}</p>
              <span className="bubble-time">{msg.timeStamp}</span>
            </div>
          );
        })}
      </div>

      {/* 입력창 + 전송 버튼 */}
      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="send-btn" onClick={handleSend}>
          전송
        </button>
      </div>
    </div>
  );
};

export default Chat;
