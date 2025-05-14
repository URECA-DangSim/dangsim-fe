import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../service/api";

const PaymentPage = () => {
  // const [userNickname, setUserNickname] = useState("");
  // const [userEmail, setUserEmail] = useState(""); // 사용자 입력
  // const [taskTitle, setTaskTitle] = useState("");
  // const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // const { taskId } = useParams(); // url 파라미터에서 추출

  // TaskWrite에서 보낸 정보 받기
  const {
    taskId,
    merchantUid,
    amount = 0,
    taskTitle = "",
  } = location.state || {};

  console.log("taskid : ", taskId);
  console.log("merchantUid : ", merchantUid);
  console.log("amount : ", amount);
  console.log("taskTitle : ", taskTitle);

  useEffect(() => {
    if (!taskId || !amount || !taskTitle || !merchantUid) {
      alert("결제할 값이 없습니다.");
      navigate("/"); // 또는 navigate(-1) 로 이전 페이지로
    }
  }, [taskId, amount, taskTitle, merchantUid, navigate]);

  const [userNickname, setUserNickname] = useState("");

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const res = await api.get("/api/users/user/profile");
        setUserNickname(res.data.nickname);
      } catch (error) {
        console.error("사용자 닉네임 정보가 없습니다.", error);
      }
    };
    fetchNickname();
  }, []);

  console.log("nickname : ", setUserNickname);

  // 포트원 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 결제 요청
  const onClickPayment = () => {
    if (!window.IMP) {
      alert("결제 모듈이 로딩되지 않았습니다.");
      return;
    }

    // if (!userEmail) {
    // alert("이메일을 입력해주세요.");
    // return;
    // }

    const { IMP } = window;
    IMP.init("imp54283017");

    setLoading(true);

    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: merchantUid,
        amount: amount,
        taskTitle: taskTitle,
        buyer_name: userNickname,
        // buyer_email: userEmail,
      },
      async (rsp) => {
        if (rsp.success) {
          try {
            // 포트원이 정상적으로 되면 서버로 전송
            const res = await api.post("/api/payments/validation", {
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              taskId: taskId,
            });

            const { taskId: verifiedTaskId } = res.data;

            alert("결제가 완료되었습니다.");
            navigate(`/task/${verifiedTaskId}`);
          } catch (err) {
            console.error("결제 검증 실패", err);
            alert("서버 결제 검증에 실패했습니다.");
            navigate("/");
          }
        } else {
          alert(`결제 실패: ${rsp.error_msg}`);
        }
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>심부름 결제 요청</h1>

      {/* 로그인한 사용자 닉네임 가져올 예정 */}
      {/* <div style={{ marginBottom: "10px" }}>
        <label>사용자 닉네임:</label>
        <br />
        <input type="text" value={userNickname} readOnly />
      </div> */}

      {/* <div style={{ marginBottom: "10px" }}>
        <label>이메일:</label>
        <br />
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="example@example.com"
        />
      </div> */}

      <div style={{ marginBottom: "10px" }}>
        <label>심부름 제목:</label>
        <br />
        <input type="text" value={taskTitle} readOnly />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>결제 금액:</label>
        <br />
        <input type="number" value={amount} readOnly />
      </div>

      {loading ? (
        <div>결제 요청 중입니다... 잠시만 기다려주세요 🙏</div>
      ) : (
        <button onClick={onClickPayment}>결제 요청</button>
      )}
    </div>
  );
};

export default PaymentPage;
