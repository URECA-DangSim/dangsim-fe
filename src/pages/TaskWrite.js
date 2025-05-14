"use client";

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import "../styles/TaskWrite.css";
import cameraIcon from "../assets/camera.png";
import api from "../service/api";

export default function TaskWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState(dayjs().add(30, "minute"));
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  // 사진 추가 클릭 처리: 최대 3장까지 업로드
  const handleAddPhotoClick = () => {
    const totalCount = previewUrls.length + imageUrls.length;
    if (totalCount >= 3) {
      alert("사진은 최대 3장까지 업로드할 수 있습니다.");
      return;
    }
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Calculate how many more images can be added
    const availableSlots = 3 - previewUrls.length;
    const filesToAdd = selectedFiles.slice(0, availableSlots);
    if (filesToAdd.length === 0) {
      return; // no slots available or no files selected
    }

    // Generate and append local previews
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    // Upload only the new files
    const formData = new FormData();
    filesToAdd.forEach((file) => formData.append("files", file));
    try {
      console.log("이미지 업로드 요청!!");
      const uploadRes = await api.post("/api/files/images", formData);
      console.log("Uploaded URLs:", uploadRes.data.uploadedFileUrls);
      // Append returned URLs, limit to 3 total
      setImageUrls((prev) =>
        [...prev, ...(uploadRes.data.uploadedFileUrls || [])].slice(0, 3)
      );
      console.log("이미지 업로드 성공!!");
    } catch (err) {
      console.error("Image upload failed", err);
      alert("이미지 업로드에 실패했습니다.");
      // Roll back previews on failure
      setPreviewUrls((prev) => prev.slice(0, prev.length - filesToAdd.length));
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
      const res = await api.post("/api/tasks/task", body);
      const { taskId, result } = res.data;
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

      <div className="task-write-image-uploader">
        <div className="task-images">
          <img
            src={cameraIcon}
            alt="사진 추가"
            className="task-write-camera-icon"
            onClick={handleAddPhotoClick}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <div className="task-write-previews">
          {(imageUrls.length > 0 ? imageUrls : previewUrls).map((url, idx) => (
            <div className="task-images" key={idx}>
              <img src={url} alt={`preview-${idx}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="task-write-container">
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
