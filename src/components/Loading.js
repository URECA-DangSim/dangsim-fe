import React from "react";
import "../styles/Loading.css";
import spinner from "../assets/spinner.gif";

export const Loading = () => {
  return (
    <div className="loading-container">
      <img src={spinner} alt="로딩 중..." className="loading-spinner" />
    </div>
  );
};

export default Loading;
