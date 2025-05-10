// App.jsx (혹은 index.jsx 등)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DetailPage from "./pages/DetailPage"; // 네가 만든 DetailPage 컴포넌트 가져오기
import PaymentPage from "./pages/PaymentPage"; // 현재 있는 결제 페이지

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/DetailPage" element={<DetailPage />} />
        <Route path="/PaymentPage" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
