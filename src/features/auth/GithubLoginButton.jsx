// src/features/auth/GithubLoginButton.jsx
import { IconBrandGithub } from "@tabler/icons-react";

const API_BASE_URL = "/api";

export default function GithubLoginButton() {
  const handleGithubLogin = () => {
    // 백엔드 OAuth 진입점 (실제 GitHub 로그인 시작)
    window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
  };

  return (
    <button
      onClick={handleGithubLogin}
      className="
        w-full py-3 mt-4 flex items-center justify-center gap-2 
        rounded-xl font-semibold text-[15px]
        bg-[#0d1117]/70 hover:bg-[#0d1117]/90 
        border border-white/10 backdrop-blur-lg
        hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]
        transition-all duration-300
      "
    >
      <IconBrandGithub size={20} className="text-white" />
      <span className="text-white">Login with GitHub</span>
    </button>
  );
}
