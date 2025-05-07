// LoginPage.jsx - 소셜 로그인 (카카오/구글) 구현
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";
import logo from "../assets/logo.png";
import logoName from "../assets/logo-name.png";
import kakaoButton from "../assets/kakao-login.png"
import googleButton from "../assets/google-login.svg"

const LoginPage = () => {
  const navigate = useNavigate();

  /**
   * 카카오 로그인
   * - 인가 코드 발급용 authorize URL로 이동
   */
  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  };


  return (
    <div className={styles.loginContainer}>
      <img src={logo} alt="logo" className={styles.logo} />
      {/* <h2>당신의 심부름</h2> */}
      <img src={logoName} alt="logo-name" className={styles.logo} />

      <img 
        src = {kakaoButton}
        alt="카카오 로그인"
        className={styles.kakaoBtn}
        onClick={handleKakaoLogin}
      />

      <img 
        src = {googleButton}
        alt="구글 로그인"
        className={styles.googleBtn}
        onClick={handleGoogleLogin}
      />
    </div>
  );
};

export default LoginPage;
