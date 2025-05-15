import React from "react";
import styles from "../../styles/TaskItem.module.css";
import clockIcon from "../../assets/clock.png";

export default function TaskItem({ post }) {
  return (
    <div className={styles.card}>
      <div className={styles.set}>
        <img src={post.image} alt={post.title} className={styles.thumbnail} />
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{post.title}</h2>
            {post.status && (
              <span className={`${styles.badge} ${styles[post.statusClass]}`}>
                {post.status}
              </span>
            )}
          </div>
          <div className={styles.metaRow}>
            <img src={clockIcon} alt="clock" className={styles.metaIcon} />
            <span>{post.time}</span>
          </div>
          <div className={styles.amount}>{post.amount}</div>
        </div>
      </div>
    </div>
  );
}
