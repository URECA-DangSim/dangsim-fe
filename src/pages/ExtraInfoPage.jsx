import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/ExtraInfoPage.css";
import api from "../service/api";

const ExtraInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.isEditMode || false;

  const [nickname, setNickname] = useState("");
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [dongList, setDongList] = useState([]);

  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigungu, setSelectedSigungu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const [accessToken, setAccessToken] = useState(null);
  const CONSUMER_KEY = process.env.REACT_APP_SGIS_KEY;
  const CONSUMER_SECRET = process.env.REACT_APP_SGIS_SECRET;

  const getNameByCode = (list, code) =>
    list.find((item) => item.cd === code)?.addr_name || "";

  // SGIS 토큰 발급
  useEffect(() => {
    axios
      .get("https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json", {
        params: {
          consumer_key: CONSUMER_KEY,
          consumer_secret: CONSUMER_SECRET,
        },
      })
      .then((res) => setAccessToken(res.data.result.accessToken))
      .catch((err) => console.error("SGIS 인증 실패:", err));
  }, [CONSUMER_KEY, CONSUMER_SECRET]);

  // 시도
  useEffect(() => {
    if (!accessToken) return;
    axios
      .get("https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json", {
        params: { accessToken },
      })
      .then((res) => setSidoList(res.data.result))
      .catch((err) => console.error("시도 로딩 실패:", err));
  }, [accessToken]);

  // 시군구
  useEffect(() => {
    if (!selectedSido || !accessToken) return;
    axios
      .get("https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json", {
        params: { accessToken, cd: selectedSido },
      })
      .then((res) => setSigunguList(res.data.result))
      .catch((err) => console.error("시군구 로딩 실패:", err));
  }, [selectedSido, accessToken]);

  // 읍면동
  useEffect(() => {
    if (!selectedSigungu || !accessToken) return;
    axios
      .get("https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json", {
        params: { accessToken, cd: selectedSigungu },
      })
      .then((res) => setDongList(res.data.result))
      .catch((err) => console.error("읍면동 로딩 실패:", err));
  }, [selectedSigungu, accessToken]);

  const handleCheckNickname = () => {
    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }
    if (nickname.length < 2 || nickname.length > 12) {
      setNicknameError("닉네임은 2자 이상 12자 이하로 입력해주세요.");
      return;
    }

    api
      .get(`/api/users/user/check-nickname?nickname=${nickname}`) // baseURL 자동 적용
      .then((res) => {
        if (!res.data.isDuplicated) {
          alert("사용 가능한 닉네임입니다.");
          setIsNicknameChecked(true);
          setNicknameError("");
        } else {
          alert("이미 사용중인 닉네임입니다.");
          setIsNicknameChecked(false);
        }
      })
      .catch((err) => {
        alert("중복 확인 요청 중 오류 발생");
      });
  };

  const handleSubmit = () => {
    if (!isNicknameChecked) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    if (!selectedSido || !selectedSigungu || !selectedDong) {
      alert("모든 지역을 선택해주세요.");
      return;
    }

    const fullLocation = `${getNameByCode(
      sidoList,
      selectedSido
    )} ${getNameByCode(sigunguList, selectedSigungu)} ${getNameByCode(
      dongList,
      selectedDong
    )}`;

    api
      .post("/api/users/user/extra-info", { nickname, address: fullLocation })
      .then(() => {
        alert(isEditMode ? "정보 수정 완료" : "추가 정보 입력 완료");
        navigate(isEditMode ? "/mypage" : "/");
      })
      .catch((err) => alert("제출 실패: " + err));
  };

  return (
    <div className="extra-container">
      <h2>{isEditMode ? "마이페이지" : "추가 정보 입력"}</h2>

      <div className="input-section">
        <label>
          닉네임 <span className="required">*</span>
        </label>
        <div className="nickname-row">
          <input
            type="text"
            value={nickname}
            maxLength={12}
            onChange={(e) => {
              setNickname(e.target.value);
              setIsNicknameChecked(false);
              setNicknameError("");
            }}
            placeholder="2~12자 닉네임"
            className="input-nickname"
          />
          <button
            className="check-button"
            onClick={handleCheckNickname}
            disabled={isNicknameChecked}
          >
            중복확인
          </button>
        </div>
        {nicknameError && <p className="error">{nicknameError}</p>}
      </div>

      <div className="input-section">
        <label>
          관심 지역 <span className="required">*</span>
        </label>
        <div className="select-row">
          <select
            value={selectedSido}
            onChange={(e) => setSelectedSido(e.target.value)}
          >
            <option value="">시도 선택</option>
            {sidoList.map((item) => (
              <option key={item.cd} value={item.cd}>
                {item.addr_name}
              </option>
            ))}
          </select>
          <select
            value={selectedSigungu}
            onChange={(e) => setSelectedSigungu(e.target.value)}
          >
            <option value="">시군구 선택</option>
            {sigunguList.map((item) => (
              <option key={item.cd} value={item.cd}>
                {item.addr_name}
              </option>
            ))}
          </select>
          <select
            value={selectedDong}
            onChange={(e) => setSelectedDong(e.target.value)}
          >
            <option value="">읍면동 선택</option>
            {dongList.map((item) => (
              <option key={item.cd} value={item.cd}>
                {item.addr_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        {isEditMode ? "정보 수정하기" : "제출하기"}
      </button>
    </div>
  );
};

export default ExtraInfoPage;
