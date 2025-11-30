// src/features/auth/GithubCallback.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GithubCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token"); // ?token=... 이라고 온다고 가정

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="bg-app min-h-screen flex items-center justify-center">
      <p className="text-sm text-white">GitHub 로그인 처리 중...</p>
    </div>
  );
}
