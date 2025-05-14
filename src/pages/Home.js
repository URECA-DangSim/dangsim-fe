import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "../components/TaskItem/TaskItem";
import styles from "../styles/Home.module.css";
import logo from "../assets/logo.png";
import api from "../service/api";

const PAGE_SIZE = 7;

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadPosts = useCallback(async () => {
    if (!hasNext || isLoading) return;
    setIsLoading(true);
    try {
      const params = { size: PAGE_SIZE };
      if (cursor) {
        params.cursor = cursor;
      }

      const res = await api.get("/api/tasks", { params });
      const { items = [], nextCursor, hasNext: next } = res.data;
      console.log("Fetched tasks data:", res.data);

      const mapped = items.map((item) => ({
        id: item.taskId,
        image: item.imageUrl || logo,
        title: item.title,
        time: item.deadline,
        amount: `₩${Number(item.reward).toLocaleString()}`,
      }));

      setPosts((prev) => [...prev, ...mapped]);
      setCursor(nextCursor);
      setHasNext(next);
    } catch (err) {
      console.error("Failed to load tasks", err);
      setHasNext(false);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasNext, isLoading]);

  useEffect(() => {
    api
      .get("/api/users/user/profile")
      .then((res) => {
        setIsLoggedIn(true);
        setUserAddress(res.data.address);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setIsLoggedIn(false);
        }
      });
  }, []);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (
        hasNext &&
        !isLoading &&
        window.innerHeight + window.pageYOffset + 100 >=
          document.body.offsetHeight
      ) {
        loadPosts();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadPosts]);

  return (
    <>
      <header className={styles.header}>
        <img
          src={logo}
          alt="당심 로고"
          className={styles.logo}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
        <div className={styles.userArea}>
          {isLoggedIn ? (
            <span className={styles.userInfo}>{userAddress}</span>
          ) : (
            <button
              className={styles.loginButton}
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
          )}
        </div>
      </header>

      <main className={styles.container}>
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/task/${post.id}`)}
            style={{ cursor: "pointer" }}
          >
            <TaskItem post={post} />
          </div>
        ))}

        <button
          className={styles.writeButton}
          onClick={() => navigate("/write")}
        >
          + 작성하기
        </button>
      </main>
    </>
  );
}
