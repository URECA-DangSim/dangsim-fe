// 결제화면

import react from 'react'
import { requestPayment } from '../../service/paymentService';

const PaymentPage  = () => {
    const onClickPayment = async () => {
        if (!window.IMP) {
            alert('IMP 모듈 로딩 실패');
            return;
        }
    const {IMP} = window;
    IMP.init(imp54283017);  // 포트원 가맹점 식별 코드 (v1 api 고객사 식별코드?)

    // 요청 페이지에서 값을 넘겨 받아서?
    try {
        const response = await IMP.request_pay({
            pg: 'html5_inicis' // kg이니시스
            , pay_method: 'card' // 결제 수단
            , merchant_uid: 'mid_${new Date().getTime}' 
            // 결제 성공시 포트원에서 제공해주는 값+날짜 ? 결제 요청시 사용한 ID
            , name: '테스트 결제'
            , amount: 10000 // 결제 금액
            , task_id: 3 // 심부름 id
            , imp_uid: '' // 포트원 결제 고유 id
            , currency: 'KRW' // 통화코드
            , pg_tid: '' // pg사 거래 고유 번호
            , status: 'READY' // 결제 상태
            , requested_at: '' // 결제 요청 시각
            , approved_at: '' // 결제 승인 시각
            , requester_authID: ''
            , requester_nickname: '닉네임'
            , requester_adress: '서울시 도봉구'

        })
        
        if (response.success) {
            // 결제 성공시 imp_uid, merchant_uid 백엔드로 전송
            await requestPayment(response.imp_uid, response.merchant_uid);
            alert('게시글이 등록되었습니다!');
        } else {
            alert('결제가 실패하였습니다. ${resonse.error_msg');
        } 
        } catch(error) {
            console.error(error);
            alert('결제 중 오류 발생')
        }
    }

    // 결제 페이지로 돌아가기
    return (
        <div>
          <h1>결제 페이지</h1>
          <button onClick={onClickPayment}>결제하기</button>
        </div>
      );
}
    
    export default PaymentPage;