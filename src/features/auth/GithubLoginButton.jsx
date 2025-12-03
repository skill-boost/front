import { IconBrandGithub } from "@tabler/icons-react";

// 환경 변수에서 백엔드 BASE URL 가져오기
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GithubLoginButton() {
  const handleGithubLogin = () => {
    // OAuth2 로그인 엔드포인트
    window.location.href = `${BASE_URL}/oauth2/authorization/github`;
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
