import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/TaskDetail.css";
import logo from "../assets/logo.png";
import api from "../service/api";
import Loading from "../components/Loading";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/tasks/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => {
        console.error("Failed to load task details", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loading />;
  }
  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const isActive = post.status === "미배정" && post.isMyTask === false;
  const imageSrc = post.imageUrls?.[0] || logo;

  // 버튼 클릭 시 매칭 API 호출
  const handleMatch = async () => {
    try {
      const res = await api.delete(`/api/tasks/${id}/performer`);
      const { chatRoomId } = res.data;
      navigate(`/chatroom/${chatRoomId}`);
    } catch (err) {
      console.error("Failed to match performer", err);
      alert("매칭 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="task-detail-container">
      <button className="task-detail-back-button" onClick={() => navigate("/")}>
        ← 뒤로
      </button>
      <img src={imageSrc} alt={post.title} className="task-detail-image" />
      <div className="task-detail-content">
        <h1 className="task-detail-title">{post.title}</h1>
        <p className="task-detail-time">{post.deadline}</p>
        <p className="task-detail-amount">
          ₩{Number(post.reward).toLocaleString()}
        </p>
        <p className="task-detail-location">{post.address}</p>
        <p className="task-detail-description">{post.content}</p>
      </div>
      <button
        className={`task-detail-action-button${isActive ? "" : " disabled"}`}
        onClick={isActive ? handleMatch : undefined}
        disabled={!isActive}
      >
        {isActive ? "심부름 하기" : "신청 마감"}
      </button>
    </div>
  );
}
