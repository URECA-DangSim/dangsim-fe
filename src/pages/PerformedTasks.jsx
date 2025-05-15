import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "../components/TaskItem/TaskItem";
import api from "../service/api";
import logo from "../assets/logo.png";
import styles from "../styles/RequestedTasksHeader.module.css";

export default function PerformedTasks() {
  const [tasks, setTasks] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const isLoadingRef = useRef(false);
  const containerRef = useRef();
  const navigate = useNavigate();

  // ✅ loadTasks는 useCallback으로 감싸고 currentCursor를 인자로 받음
  const loadTasks = useCallback(
    async (currentCursor = null) => {
      if (!hasNext || isLoadingRef.current) return;

      isLoadingRef.current = true;

      try {
        const res = await api.get("/api/users/tasks/performed", {
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
        console.error("수행 내역 불러오기 실패:", err);
      } finally {
        isLoadingRef.current = false;
      }
    },
    [hasNext] // ✅ loadTasks는 hasNext만 의존
  );

  // ✅ 최초 1회 실행
  useEffect(() => {
    loadTasks(null);
  }, [loadTasks]);

  // ✅ 스크롤 이벤트 내부에서도 loadTasks 사용 → 안전
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
  }, [cursor, hasNext, loadTasks]); // ✅ 경고 제거

  return (
    <>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ⬅
          </button>
          <h2 className={styles.title}>심부름 수행 내역</h2>
        </div>
      </header>

      {/* 본문 */}
      <div ref={containerRef} style={{ padding: "16px", paddingTop: "70px" }}>
        {tasks.map((post) => (
          <TaskItem key={post.id} post={post} />
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
