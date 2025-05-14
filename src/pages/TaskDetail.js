import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/TaskDetail.css";
import logo from "../assets/logo.png";
import api from "../service/api";
import deleteIcon from "../assets/delete.png";
import Loading from "../components/Loading";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // 현재 보여줄 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // 삭제 API 호출
  const handleDelete = async () => {
    if (!window.confirm("정말 이 심부름을 삭제하시겠습니까?")) return;
    try {
      const res = await api.delete(`/api/tasks/${id}`);
      if (res.data.result) {
        alert("삭제되었습니다.");
        navigate("/");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="task-detail-container">
      <header className="task-detail-header">
        <button
          className="task-detail-back-button"
          onClick={() => navigate(-1)}
        >
          ← 뒤로
        </button>
        {post.isMyTask && (
          <img
            src={deleteIcon}
            alt="삭제"
            className="task-detail-delete-icon"
            onClick={handleDelete}
          />
        )}
      </header>
      <div className="task-detail-image-wrapper">
        {/* 좌우 네비게이션 버튼 */}
        {post.imageUrls.length > 1 && (
          <>
            <button
              className="image-nav left"
              onClick={() =>
                setCurrentImageIndex((idx) => Math.max(0, idx - 1))
              }
              aria-label="이전 이미지"
            >
              ◀
            </button>
            <button
              className="image-nav right"
              onClick={() =>
                setCurrentImageIndex((idx) =>
                  Math.min(post.imageUrls.length - 1, idx + 1)
                )
              }
              aria-label="다음 이미지"
            >
              ▶
            </button>
          </>
        )}

        {/* 메인 이미지 */}
        <img
          src={post.imageUrls[currentImageIndex] || logo}
          alt={post.title}
          className="task-detail-image"
        />

        {/* 페이지 인디케이터 */}
        {post.imageUrls.length > 1 && (
          <div className="image-indicators">
            {post.imageUrls.map((_, idx) => (
              <span
                key={idx}
                className={`indicator-dot${
                  idx === currentImageIndex ? " active" : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="task-detail-content">
        <h1 className="task-detail-title">{post.title}</h1>
        <p className="task-detail-time">{post.deadline}</p>
        <p className="task-detail-amount">
          ₩{Number(post.reward).toLocaleString()}
        </p>
        <p className="task-detail-location">{post.address}</p>
        <p className="task-detail-description">{post.content}</p>
      </div>
      {!post.isMyTask && (
        <button
          className={`task-detail-action-button${
            post.status === "미배정" ? "" : " disabled"
          }`}
          onClick={post.status === "미배정" ? handleMatch : undefined}
          disabled={post.status !== "미배정"}
        >
          {post.status === "미배정" ? "심부름 하기" : "신청 마감"}
        </button>
      )}
    </div>
  );
}
