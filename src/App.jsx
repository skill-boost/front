import { Routes, Route } from "react-router-dom";

// Auth
import Login from "@/features/auth/Login";
import GithubCallback from "@/features/auth/GithubCallback";

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
      {/* 기본 홈 */}
      <Route path="/" element={<Home />} />

      {/* 코딩테스트 */}
      <Route path="/coding" element={<CodingTest />} />

      {/* 코드리뷰 */}
      <Route path="/review" element={<CodeReview />} />

      {/* 인터뷰: 인트로 / 세션 / 결과 */}
      <Route path="/interview" element={<Intro />} />
      <Route path="/interview/session" element={<Session />} />
      <Route path="/interview/result" element={<Result />} />

      {/* 로그인 페이지 */}
      <Route path="/login" element={<Login />} />

      {/* 🔥 GitHub OAuth 콜백 (백엔드에서 http://localhost:3000/oauth2/redirect 로 보냄) */}
      <Route path="/oauth2/redirect" element={<GithubCallback />} />

      {/* 404 */}
      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}
