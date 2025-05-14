import React from "react";
import styles from "../../styles/TaskItem.module.css";

export default function TaskItem({ post }) {
  return (
    <div className={styles.container}>
      <img src={post.image} alt={post.title} className={styles.thumbnail} />
      <div className={styles.info}>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.meta}>
          <div>{post.time}</div> <div>{post.amount}</div>
        </p>
      </div>
    </div>
  );
}
