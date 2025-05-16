import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "../components/TaskItem/TaskItem";
import api from "../service/api";
import logo from "../assets/logo.png";
import styles from "../styles/RequestedTasksHeader.module.css";

export default function RequestedTasks() {
  const [tasks, setTasks] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const isLoadingRef = useRef(false);
  const containerRef = useRef();
  const navigate = useNavigate();

  // 데이터 불러오기 함수
  const loadTasks = useCallback(
    async (currentCursor = null) => {
      if (!hasNext || isLoadingRef.current) return;

      isLoadingRef.current = true;

      try {
        const res = await api.get("/api/users/tasks/requested", {
          params: {
            cursor: currentCursor,
            size: 7,
          },
        });

        const { items, nextCursor, hasNext: next } = res.data;

        const mapped = items.map((item) => ({
          id: item.taskId,
          image: item.imageUrl || logo,
          title: item.title,
          time: item.deadline,
          amount: `₩${Number(item.reward).toLocaleString()}`,
          status: item.status,
          statusClass: item.status,
        }));

        setTasks((prev) => [...prev, ...mapped]);
        setCursor(nextCursor);
        setHasNext(next);
      } catch (err) {
        console.error("요청 내역 불러오기 실패:", err);
      } finally {
        isLoadingRef.current = false;
      }
    },
    [hasNext]
  );

  // 첫 요청
  useEffect(() => {
    loadTasks(null);
  }, [loadTasks]);

  // 무한 스크롤
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        (containerRef.current?.offsetHeight || 0) - 200;

      if (nearBottom && hasNext && !isLoadingRef.current) {
        loadTasks(cursor);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [cursor, hasNext, loadTasks]);

  return (
    <>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ⬅
          </button>
          <h2 className={styles.title}>심부름 요청 내역</h2>
        </div>
      </header>

      {/* 본문 */}
      <div ref={containerRef} style={{ padding: "16px", paddingTop: "70px" }}>
        {tasks.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/task/${post.id}`)}
            style={{ cursor: "pointer" }}
          >
            <TaskItem post={post} />
          </div>
        ))}
        {isLoadingRef.current && (
          <p style={{ textAlign: "center", marginTop: "16px" }}>
            불러오는 중...
          </p>
        )}
      </div>
    </>
  );
}
