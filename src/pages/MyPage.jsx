import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyPage.css";
import requestImage from "../assets/request.png";
import performImage from "../assets/perform.png";
import defaultImage from "../assets/logo.png";
import api from "../service/api";

const MyPage = () => {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState("");
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [reward, setReward] = useState(0);

  const handleClickArrow = () => {
    navigate("/extra-info", { state: { isEditMode: true } });
  };

  const handleClickRequestdButton = () => {
    navigate("/requested", { state: { isEditMode: true } });
  };

  const handleClickPerformedButton = () => {
    navigate("/performed", { state: { isEditMode: true } });
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      api
        .post("/api/auth/logout")
        .then(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        })
        .catch((err) => {
          console.error("로그아웃 실패:", err);
          alert("로그아웃 중 오류가 발생했습니다.");
        });
    }
  };

  useEffect(() => {
    const fetchUserInfo = () => {
      api
        .get("/api/users/user/profile")
        .then((res) => {
          const { profileImage, nickname, address, reward } = res.data;
          setProfileImage(profileImage);
          setNickname(nickname);
          setAddress(address);
          setReward(reward);
        })
        .catch((err) => {
          console.error("유저 정보 가져오기 실패: ", err);
        });
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="mypage-container">
      <h2 className="title">마이페이지</h2>

      <div className="profile-card">
        <div className="profile-header">
          {profileImage ? (
            <img
              src={profileImage}
              alt="프로필 이미지"
              className="profile-img"
            />
          ) : (
            <img src={defaultImage} alt="기본 이미지" className="profile-img" />
          )}
          <div className="user-info">
            <div className="nickname">{nickname}님</div>
            <div className="address">📍 {address}</div>
          </div>
          <button className="arrow-button" onClick={handleClickArrow}>
            ➔
          </button>
        </div>

        <div className="reward-section">
          <span>리워드</span>
          <span className="amount">{reward.toLocaleString()}원</span>
        </div>

        <button
          className="reward-button"
          onClick={() => navigate("/reward-refund")}
        >
          환급 받기
        </button>
      </div>

      <div className="history-card">
        <div className="history-title">나의 심부름</div>
        <div className="history-buttons">
          <button className="history-item" onClick={handleClickRequestdButton}>
            <img src={requestImage} alt="요청내역" />
            <span>요청 내역</span>
          </button>
          <button className="history-item" onClick={handleClickPerformedButton}>
            <img src={performImage} alt="수행내역" />
            <span>수행 내역</span>
          </button>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
