// src/features/auth/GithubLoginButton.jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GithubLoginButton() {
  const handleGithubLogin = () => {
    // 백엔드 OAuth 진입점 (나중에 실제 엔드포인트로만 바꿔주면 됨)
    window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
  };

  return (
    <button
      onClick={handleGithubLogin}
      className="btn-neon w-full py-2 mt-3 text-sm"
    >
      Login with GitHub
    </button>
  );
}
