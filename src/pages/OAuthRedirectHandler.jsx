import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/ExtraInfoPage.css'

const OAuthRedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        if(!code) return;

        axios
            .get(`http://localhost:8080/api/auth/login/kakao?code=${code}`)
            .then((res) => {
                const { access_token, refresh_token, role} = res.data;
                localStorage.setItem("accessToken", access_token);
                localStorage.setItem("refreshToken", refresh_token);

                if(role === "TMP_USER"){
                    navigate("/extra-info");
                }else{
                    navigate("/home");
                }
            })
            .catch((err) => {
                console.error("로그인 실패:", err);
                navigate("/login");
            });
    }, [navigate]);
    return <div>로그인 처리 중...</div>
};

export default OAuthRedirectHandler;