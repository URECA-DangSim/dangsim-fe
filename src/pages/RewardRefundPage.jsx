import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RewardRefund.css";

export default function RewardRefund() {
  const navigate = useNavigate();
  const [bankOpen, setBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("은행 선택");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amountError, setAmountError] = useState("");

  const banks = ["국민은행", "우리은행", "농협은행", "신한은행", "IBK은행"];

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
      <h2>리워드 환급</h2>

      {/* 뒤로 가기 버튼 */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <img src="/assets/back-btn.png" alt="뒤로 가기" className="back-icon" />
      </button>

      {/* 환급 금액 입력 */}
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

      {/* 환급 계좌 입력 */}
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

      {/* 환급 버튼 */}
      <button
        className="submit-button"
        disabled={!amount || Number(amount) < 1000}
      >
        환급하기
      </button>
    </div>
  );
}
