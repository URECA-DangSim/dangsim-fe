// 백엔드로 결제 검증 요청

import axios from 'axios';

export const requestPayment = async(imp_uid, merchant_uid) => {
    return axios.post('/api/payments/validate', {
    imp_uid,
    merchant_uid,
  });
};