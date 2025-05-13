import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backButton from "../assets/back-btn.png";
import "../styles/RewardRefund.css";
import api from "../service/api";

export default function RewardRefund() {
  const navigate = useNavigate();
  const [bankOpen, setBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("은행 선택");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [amountError, setAmountError] = useState("");
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  const banks = ["국민은행", "우리은행", "농협은행", "신한은행", "IBK은행"];

  const handleRefundRequest = async () => {
    setServerErrorMessage("");

    if (Number(amount) <= 0) {
      setServerErrorMessage("잘못된 금액입니다.");
      return;
    }

    if (!selectedBank || !accountNumber || !holderName) {
      setServerErrorMessage("은행, 계좌번호, 예금주를 입력하세요.");
      return;
    }

    try {
      await api.post("/api/users/user/reward", {
        amount,
        bankName: selectedBank,
        bankAccount: accountNumber,
        holderName,
      });
      alert("정상 환급 되었습니다.");
      navigate("/mypage");
    } catch (err) {
      const message =
        err.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
      setServerErrorMessage(message);
    }
  };

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setBankOpen(false);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (!value || Number(value) < 1) {
      setAmountError("1원 이상 입력해야 합니다.");
    } else {
      setAmountError("");
    }
  };

  return (
    <div className="reward-refund-container">
      <div className="header-row">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={backButton} alt="뒤로 가기" className="back-icon" />
        </button>
        <h2>리워드 환급</h2>
      </div>

      <div className="input-section">
        <label className="form-label">
          환급 금액 <span className="required">*</span>
        </label>
        <div className="reward-row">
          <input
            type="number"
            value={amount}
            maxLength={20}
            onChange={handleAmountChange}
            placeholder="환급 받으실 금액을 입력하세요"
            className="input-reward"
          />
        </div>
        {amountError && <div className="error-message">{amountError}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">
          환급 계좌<span className="required">*</span>
        </label>
        <div className="bank-select-container">
          <div className="bank-select">
            <button
              className={`bank-button ${
                selectedBank !== "은행 선택" ? "selected" : ""
              }`}
              onClick={() => setBankOpen(!bankOpen)}
            >
              {selectedBank}
            </button>
            {bankOpen && (
              <div className="bank-dropdown">
                {banks.map((bank) => (
                  <div
                    key={bank}
                    onClick={() => handleSelectBank(bank)}
                    className="bank-option"
                  >
                    {bank}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="account-input-container">
          <input
            type="text"
            className="account-input"
            placeholder="계좌번호를 입력해주세요"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          예금주 <span className="required">*</span>
        </label>
        <input
          type="text"
          className="account-input"
          placeholder="예금주를 입력해주세요"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value)}
        />
      </div>

      {serverErrorMessage && (
        <div className="error-message server-error">{serverErrorMessage}</div>
      )}

      <button
        className="submit-button"
        disabled={!amount}
        onClick={handleRefundRequest}
      >
        환급하기
      </button>
    </div>
  );
}
