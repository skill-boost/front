// src/features/auth/GithubCallback.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GithubCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const email = params.get("email");
    const username = params.get("username");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      if (email) localStorage.setItem("userEmail", email);
      if (username) localStorage.setItem("username", username);

      navigate("/", { replace: true }); // 로그인 후 홈으로
    } else {
      navigate("/login", { replace: true }); // 실패 시 로그인 페이지로
    }
  }, [location, navigate]);

  return (
    <div className="bg-app min-h-screen flex items-center justify-center">
      <p className="text-sm text-white">GitHub 로그인 처리 중...</p>
    </div>
  );
}
