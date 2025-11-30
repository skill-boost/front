const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")
    : "/api";

export default function GithubLoginButton() {
  const handleGithubLogin = () => {
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
