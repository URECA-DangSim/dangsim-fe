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
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState(dayjs().add(30, "minute"));
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    // setImages(files);
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      try {
        console.log("이미지 업로드 요청!!");
        const uploadRes = await api.post("/api/files/images", formData);
        setImageUrls(uploadRes.data.uploadedFileUrls || []);
        console.log("Uploaded URLs:", uploadRes.data.uploadedFileUrls);
        console.log("이미지 업로드 성공!!");
      } catch (err) {
        console.error("Image upload failed", err);
        alert("이미지 업로드에 실패했습니다.");
      }
    } else {
      setImageUrls([]);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    try {
      // Build JSON request body
      const body = {
        title: title.trim(),
        content: description.trim(),
        deadline: deadline.format("YY.MM.DD HH:mm"),
        reward: Number(amount),
        address: location.trim(),
        imageUrls,
      };
      // Send as application/json
      // 서버로부터 taskId, result 받음
      const res = await api.post("/api/tasks/task", body);
      // const { taskId, result } = res.data;
      const { taskId, merchantUid, result } = res.data;
      if (result) {
        // navigate(`/task/${taskId}`);
        console.log(taskId);
        navigate(`/payment/${taskId}`, {
          state: {
            taskId: taskId,
            merchantUid: merchantUid,
            amount: Number(amount),
            taskTitle: title,
          },
        });
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
    description.trim() !== "" &&
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
          <label>자세한 설명*</label>
          <textarea
            value={description}
            placeholder="심부름의 세부 내용을 작성해주세요.
신뢰할 수 있는 심부름을 위하여 자세히 작성해주세요.
욕설이나 비방 등의 내용은 삭제 조치될 수 있습니다."
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
          />
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
