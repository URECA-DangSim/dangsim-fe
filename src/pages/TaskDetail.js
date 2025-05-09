import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/TaskDetail.css";
import logo from "../assets/logo.png";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 임시 더미 데이터 (나중에 API 연동)
  const post = {
    image: logo,
    title: `게시글 제목 ${id}`,
    time: "2025-05-07 10:00",
    amount: "₩10,000",
    location: "서울 강남구",
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      Vivamus lacinia odio vitae vestibulum vestibulum. 
      Cras venenatis euismod malesuada. 
      Donec fermentum, urna vitae aliquet mollis, 
      nisl risus malesuada urna, a posuere dolor magna a orci.
    `,
    stats: "미배정2", // 미배정, 배정됨 등
    isMyTask: false, // 사용자가 작성한 글인지 여부
  };

  const isActive = post.stats === "미배정" && post.isMyTask === false;

  return (
    <div className="task-detail-container">
      {/* <header className="task-detail-header"> */}
      <button className="task-detail-back-button" onClick={() => navigate("/")}>
        ← 뒤로
      </button>
      {/* </header> */}

      <img src={post.image} alt={post.title} className="task-detail-image" />

      <div className="task-detail-content">
        <h1 className="task-detail-title">{post.title}</h1>
        <p className="task-detail-time">{post.time}</p>
        <p className="task-detail-amount">{post.amount}</p>
        <p className="task-detail-location">{post.location}</p>
        <p className="task-detail-description">{post.description}</p>
      </div>

      <button
        className={`task-detail-action-button${isActive ? "" : " disabled"}`}
        onClick={isActive ? () => navigate("/chat") : undefined}
        disabled={!isActive}
      >
        {isActive ? "심부름 하기" : "신청 마감"}
      </button>
    </div>
  );
}
