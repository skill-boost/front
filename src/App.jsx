// apps/web/src/App.jsx
import { Routes, Route } from "react-router-dom";

// Feature-based 페이지들
import Home from "./features/home/Home";
import CodingTest from "./features/codingTest/CodingTest";
import CodeReview from "./features/review/CodeReview";

// 인터뷰 분리 페이지들
import Intro from "./features/interview/pages/Intro";
import Session from "./features/interview/pages/Session";
import Result from "./features/interview/pages/Result";

export default function App() {
  return (
    <Routes>
      {/* 기본 */}
      <Route path="/" element={<Home />} />

      {/* 코딩테스트 */}
      <Route path="/coding" element={<CodingTest />} />

      {/* 코드리뷰 */}
      <Route path="/review" element={<CodeReview />} />

      {/* 인터뷰: 인트로 / 세션 / 결과 */}
      <Route path="/interview" element={<Intro />} />
      <Route path="/interview/session" element={<Session />} />
      <Route path="/interview/result" element={<Result />} />

      {/* 404 */}
      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}
