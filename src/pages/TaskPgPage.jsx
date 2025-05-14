import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import api from "../service/api";

const PaymentPage = () => {
  const [userNickname, setUserNickname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [requesterSelectedAmount, setRequesterSelectedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { taskId } = useParams(); // URL로부터 taskId를 가져온다고 가정
  // const location = useLocation();

  // const taskId = location.state?.taskId; // taskId는 이전 페이지에서 넘겨줘야 함

  // 포트원 스크립틀 로딩
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 사용자 정보 및 Task 정보 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, taskRes] = await Promise.all([
          api.get("/api/users/me"), // 현재 로그인 사용자 정보 by 서버
          api.get(`/api/tasks/${taskId}`), // 해당 Task 정보 by 서버
        ]);
        setUserNickname(userRes.data.nickname);
        setTaskTitle(taskRes.data.title);
        setRequesterSelectedAmount(taskRes.data.reward);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("사용자 또는 게시글 정보를 불러오는데 실패했습니다.");
        navigate("/");
      }
    };
    fetchData();
  }, [taskId, navigate]);

  const onClickPayment = async () => {
    if (!window.IMP) {
      alert("결제 모듈 로딩 실패");
      return;
    }

    const { IMP } = window;
    IMP.init("imp54283017");

    // 이메일 입력은 선택
    // if (!userNickname || !userEmail || !taskTitle || !requesterSelectedAmount) {
    // alert("모든 항목을 입력해주세요");
    // return;
    // }

    setLoading(true);

    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: taskTitle,
        amount: Number(requesterSelectedAmount),
        buyer_name: userNickname,
        buyer_email: userEmail,
      },
      async (response) => {
        if (response.success) {
          console.log(response);
          try {
            await api.post("/api/payments/completion", {
              impUid: response.imp_uid,
              merchantUid: response.merchant_uid,
              amount: response.paid_amount,
              taskId: taskId,
            });
            alert("결제 성공 및 서버 검증 완료");
            navigate("/detail");
          } catch (err) {
            console.error("서버 에러 응답:", err.response);
            alert("서버 결제 검증 실패");
            navigate("/");
          }
        } else {
          alert(`결제 실패: ${response.error_msg}`);
        }
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>심부름 상세 - 결제 요청 페이지</h1>

      {/* <div style={{ marginBottom: "10px" }}>
        <label>사용자 이름:</label>
        <br />
        <input
          type="text"
          value={userNickname}
          onChange={(e) => setUserNickname(e.target.value)}
          placeholder="닉네임"
        />
      </div> */}

      <div style={{ marginBottom: "10px" }}>
        <label>사용자 이름:</label>
        <br />
        <input type="text" value={userNickname} readOnly />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>사용자 이메일:</label>
        <br />
        <input
          type="text"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="email"
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>게시글 제목:</label>
        <br />
        <input type="text" value={taskTitle} readOnly />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>결제 요청 금액 (원):</label>
        <br />
        <input type="number" value={requesterSelectedAmount} readOnly />
      </div>

      {loading ? (
        <div>결제요청중입니다... 잠시만 기다려주세요 🙏</div>
      ) : (
        <button onClick={onClickPayment}>결제 요청</button>
      )}
    </div>
  );
};

export default PaymentPage;
