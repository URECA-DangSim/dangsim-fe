import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    axios
      .get(`http://localhost:8080/api/auth/login/kakao?code=${code}`)
      .then((res) => {
        const { accessToken, refreshToken, role } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        if (role === "TMP_USER") {
          navigate("/extra-info");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("로그인 실패:", err);
        navigate("/login");
      });
  }, [navigate]);
  return <Loading />;
};

export default OAuthRedirectHandler;
