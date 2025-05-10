import React, { useEffect, useState } from "react";
import axios from "axios";
// import { compose } from "@mui/system";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [userNickname, setUserNickname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [requesterSelectedAmount, setRequesterSelectedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 페이지 이동용

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onClickPayment = async () => {
    if (!window.IMP) {
      alert("결제 모듈 로딩 실패");
      return;
    }

    const { IMP } = window;
    IMP.init("imp54283017");

    if (!userNickname || !userEmail || !taskTitle || !requesterSelectedAmount) {
      alert("모든 항목을 입력해주세요");
      return;
    }

    setLoading(true);

    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`, // 고유 주문번호 : 상점에서 생성
        name: taskTitle, // taskID
        amount: Number(requesterSelectedAmount), // 포트원에 전송하는 사용자 결제 요청 금액
        buyer_name: userNickname, // 사용자 닉네임
        buyer_email: userEmail, // 사용자 이메일
      },
      async (response) => {
        if (response.success) {
          console.log(response);
          try {
            // 결제 성공 시, imp_uid, merchant_uid 서버로 전송
            await axios.post("/api/payments/completion", {
              impUid: response.imp_uid,
              merchantUid: response.merchant_uid,
              amount: response.paid_amount,
            });
            // alert("결제 성공 및 서버 검증 완료");
            navigate("/DetailPage");
          } catch (err) {
            console.error("서버 에러 응답:", err.response);
            alert("서버 결제 검증 실패");
            navigate("/ListPage");
          }
        } else {
          alert(`결제 실패: ${response.error_msg}`);
          navigate("/ListPage"); // 결제 자체 실패했을 때도 list로
        }
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>결제 요청 페이지</h1>

      <div style={{ marginBottom: "10px" }}>
        <label>사용자 이름:</label>
        <br />
        <input
          type="text"
          value={userNickname}
          onChange={(e) => setUserNickname(e.target.value)}
          placeholder="닉네임"
        />
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
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="게시글 제목을 입력하세요"
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>결제 요청 금액 (원):</label>
        <br />
        <input
          type="number"
          value={requesterSelectedAmount}
          onChange={(e) => setRequesterSelectedAmount(e.target.value)}
          placeholder="10000"
        />
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
