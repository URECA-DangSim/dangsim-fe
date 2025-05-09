"use client";

import React, { useState } from "react";
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
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState(dayjs().add(30, "minute"));
  const [location, setLocation] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    try {
      const body = {
        title: title.trim(),
        content: title.trim(), // TODO: 본문 입력 칸 추가 필요
        deadline: deadline.format("YY.MM.DD HH:mm"),
        reward: Number(amount),
        address: location.trim(),
        imageUrls: [], // TODO: 이미지 업로드 후 URL 배열로 대체
      };
      const res = await api.post("/api/tasks/task", body);
      const { taskId, merchantUid, result } = res.data;
      if (result) {
        navigate(`/task/${taskId}`);
      } else {
        alert("심부름 요청에 실패했습니다.");
      }
    } catch (err) {
      console.error("Failed to create task", err);
      alert("심부름 요청 중 오류가 발생했습니다.");
    }
  };

  const isFormValid =
    title.trim() !== "" &&
    amount !== "" &&
    !isNaN(amount) &&
    Number(amount) >= 100 &&
    Number(amount) <= 1000000 &&
    deadline.isValid() &&
    dayjs().add(30, "minute").isBefore(deadline) &&
    location.trim() !== "";

  return (
    <div className="task-detail-container">
      <header className="task-detail-header">
        <button
          className="task-detail-back-button"
          onClick={() => navigate(-1)}
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
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>심부름 보상 금액</label>
          <input
            type="number"
            value={amount}
            placeholder="100 ~ 1,000,000"
            onChange={(e) => setAmount(e.target.value)}
            min={100}
            max={1000000}
          />
        </div>

        <div className="form-group">
          <label>심부름 수행 마감 시간</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                minDateTime={dayjs().add(30, "minute")}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="form-group">
          <label>심부름 희망 장소</label>
          <input
            type="text"
            value={location}
            placeholder="희망 장소를 입력하세요"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <button
        className="task-detail-action-button"
        disabled={!isFormValid}
        onClick={handleSubmit}
      >
        결제하기
      </button>
    </div>
  );
}
