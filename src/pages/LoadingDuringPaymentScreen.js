import React from 'react';
import './LoadingDuringPaymentScreen.css'; // 스타일 따로 분리

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="spinner-container">
        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
          <circle className="spinner-path" cx="25" cy="25" r="20" />
        </svg>
      </div>
      <p className="loading-text">결제가 진행중입니다.</p>
    </div>
  );
};

export default LoadingScreen;