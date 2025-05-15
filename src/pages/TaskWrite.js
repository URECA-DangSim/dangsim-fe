"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import "../styles/TaskWrite.css";
import api from "../service/api";

export default function TaskWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState(dayjs().add(30, "minute"));
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [merchantUid, setMerchant] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [userNickname, setUserNickname] = useState("");

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const res = await api.get("/api/users/user/profile");
        setUserNickname(res.data.nickname);
        console.log("닉네임 응답:", res.data.nickname);
      } catch (error) {
        console.error("닉네임 요청 실패:", error);
      }
    };
    fetchNickname();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleImageChange = async (e) => {
    console.log("이미지 선택됨:", e.target.files);
    const files = Array.from(e.target.files).slice(0, 3);
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("files", file);
        console.log(`FormData 파일 ${index}:`, file.name);
      });

      try {
        console.log("이미지 업로드 요청 시작");
        const uploadRes = await api.post("/api/files/images", formData);
        setImageUrls(uploadRes.data.uploadedFileUrls || []);
        console.log("이미지 업로드 성공:", uploadRes.data.uploadedFileUrls);
      } catch (err) {
        console.error("이미지 업로드 실패:", err);
        alert("이미지 업로드에 실패했습니다.");
      }
    } else {
      console.log("이미지 선택 안 됨 또는 0장");
      setImageUrls([]);
    }
  };

  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    amount !== "" &&
    !isNaN(amount) &&
    Number(amount) >= 100 &&
    Number(amount) <= 1000000 &&
    deadline.isValid() &&
    dayjs().add(30, "minute").isBefore(deadline) &&
    location.trim() !== "";

  useEffect(() => {}, [
    title,
    amount,
    deadline,
    location,
    description,
    imageUrls,
    userNickname,
  ]);

  const onClickPayment = (merchantUidParam) => {
    console.log("결제 버튼 클릭됨");

    if (!window.IMP) {
      alert("결제 모듈이 로딩되지 않았습니다.");
      return;
    }

    const { IMP } = window;
    IMP.init("imp54283017");

    setLoading(true);

    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: merchantUid,
        amount: amount,
        name: title,
        buyer_name: userNickname,
      },
      async (rsp) => {
        console.log("결제 응답:", rsp);
        if (rsp.success) {
          try {
            const res = await api.post("/api/payments/validation", {
              impUid: rsp.imp_uid,
              merchantUid: merchantUidParam,
              taskId: taskId,
              buyer_name: userNickname,
            });
            console.log("결제 검증 응답:", res.merchant_uid);

            const { taskId: verifiedTaskId } = res.data;

            alert("결제가 완료되었습니다.");
            navigate(`/task/${verifiedTaskId}`);
          } catch (err) {
            console.error("결제 검증 실패:", err);
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

  const handleSubmit = async () => {
    console.log("submit 버튼 클릭됨");

    if (!isFormValid) {
      console.log("유효하지 않은 폼 데이터");
      return;
    }

    try {
      const body = {
        title: title.trim(),
        content: description.trim(),
        deadline: deadline.format("YY.MM.DD HH:mm"),
        reward: Number(amount),
        address: location.trim(),
        imageUrls,
      };

      console.log("심부름 요청 데이터:", body);

      const res = await api.post("/api/tasks/task", body);
      console.log("심부름 생성 응답:", res.data);

      const { taskId, merchantUid, result } = res.data;

      if (result) {
        setTaskId(taskId);
        setMerchant(merchantUid);
        alert("심부름 요청 성공!");
        // onClickPayment(merchantUid);
        return { merchantUid };
      } else {
        alert("심부름 요청에 실패했습니다.");
      }
    } catch (err) {
      console.error("심부름 요청 실패:", err);
      alert("심부름 요청 중 오류가 발생했습니다.");
    }
  };

  // 버튼 클릭 시
  const onButtonClick = async () => {
    const success = await handleSubmit();
    if (success) {
      onClickPayment(success.merchantUid); // 후속 로직 실행
    }
  };

  return (
    <div className="task-detail-container">
      <header className="task-detail-header">
        <button
          className="task-detail-back-button"
          onClick={() => {
            console.log("뒤로가기 클릭됨");
            navigate(-1);
          }}
        >
          ← 뒤로
        </button>
      </header>

      <div className="task-write-container">
        <div className="form-group">
          <label>사진 업로드 (최대 3장)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        <div className="form-group">
          <label>심부름 명</label>
          <input
            type="text"
            value={title}
            placeholder="심부름 명을 입력하세요"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <label>심부름 보상 금액</label>
          <input
            type="number"
            value={amount}
            placeholder="100 ~ 1,000,000"
            min={100}
            max={1000000}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <label>심부름 수행 마감 시간</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                value={deadline}
                onChange={(newValue) => {
                  setDeadline(newValue);
                }}
                minDateTime={dayjs().add(30, "minute")}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="form-group">
          <label>자세한 설명*</label>
          <textarea
            value={description}
            rows={4}
            placeholder="심부름의 세부 내용을 작성해주세요.
신뢰할 수 있는 심부름을 위하여 자세히 작성해주세요.
욕설이나 비방 등의 내용은 삭제 조치될 수 있습니다."
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <label>심부름 희망 장소</label>
          <input
            type="text"
            value={location}
            placeholder="희망 장소를 입력하세요"
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </div>
      </div>

      <button
        className="task-detail-action-button"
        disabled={!isFormValid || loading}
        onClick={onButtonClick}
      >
        결제하기
      </button>
    </div>
  );
}
