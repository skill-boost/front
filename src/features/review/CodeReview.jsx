import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IconArrowLeft,
  IconSparkles,
  IconLoader2,
  IconAlertTriangle,
  IconCopy,
} from "@tabler/icons-react";
import Particles from "@tsparticles/react";
import { fetchCodeReview } from "../../api/reviewService";

const particlesOptions = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  interactivity: {
    events: {
      resize: true,
    },
  },
  particles: {
    color: { value: "#8eb5ff" },
    links: { enable: true, opacity: 0.22, width: 1 },
    move: { enable: true, speed: 0.45 },
    number: { value: 42 },
    opacity: { value: 0.25 },
    size: { value: { min: 1, max: 3 } },
  },
};

<<<<<<< HEAD
=======
const API_BASE_URL = "http://52.79.181.115:30000/api";

function formatReviewText(review) {
  if (!review) return "";
  return review
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^- /, "□ "))
    .join("\n\n");
}

>>>>>>> origin/feature/frontend-init
export default function Review() {
  const [code, setCode] = useState("");
  const [userComment, setUserComment] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);
    setReview("");

    try {
<<<<<<< HEAD
      const data = await fetchCodeReview(code, userComment, repoUrl);
      if (data?.review) {
        setReview(data.review);
      } else {
        throw new Error(data?.error || "Unknown error");
=======
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          code,
          comment: userComment,
          repoUrl: mode === "repo" ? repoUrl : null,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error("로그인이 필요합니다. GitHub 로그인 후 다시 시도해 주세요.");
>>>>>>> origin/feature/frontend-init
      }
    } catch (err) {
      setError(err.message || "Failed to fetch review");
    } finally {
      setIsLoading(false);
    }
  };

  const copyReview = async () => {
    try {
      await navigator.clipboard.writeText(review || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="relative min-h-screen bg-app text-white px-6 py-10 overflow-y-auto">
      <Particles
        options={particlesOptions}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <IconArrowLeft size={18} />
            <span>Home</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">
            <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              AI Code Review
            </span>
          </h1>

          <div className="w-16 md:w-24" />
        </header>

        {/* FIXED: 페이지 전체 스크롤 및 우측 패널 스크롤 안정화 */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto min-h-[600px]">
          {/* LEFT */}
          <section className="flex flex-col h-full">
            <div className="gcard h-full">
              <div className="ginner glass-sheen h-full flex flex-col overflow-hidden">
                <div className="gheader flex items-center justify-between">
                  <span>Paste Your Code</span>
                </div>

                <div className="flex-1 p-5 pt-4 pb-3 overflow-y-auto custom-scrollbar">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="여기에 리뷰할 코드를 붙여넣으세요..."
                    className="w-full h-full bg-transparent text-sm md:text-[15px] leading-relaxed text-slate-100 placeholder:text-slate-500/80 resize-none focus:outline-none"
                    spellCheck="false"
                  />
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="border-t border-white/5 px-5 pt-3 pb-4 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300/80 mb-1">
                        사용자 코멘트 (선택)
                      </label>
                      <textarea
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="직접 생각한 개선 포인트나 고민되는 부분을 적어주세요."
                        className="w-full h-[72px] rounded-xl bg-slate-900/40 border border-slate-700/60 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500/80 resize-none focus:outline-none custom-scrollbar"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300/80 mb-1">
                        GitHub Repository URL (선택)
                      </label>
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="예: https://github.com/username/repo"
                        className="w-full rounded-xl bg-slate-900/40 border border-slate-700/60 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500/80 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading || !code.trim()}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-medium shadow-lg hover:from-sky-400 hover:to-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <IconLoader2 size={18} className="animate-spin" />
                          Reviewing...
                        </>
                      ) : (
                        <>
                          <IconSparkles size={18} /> AI 리뷰 요청
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* RIGHT FEEDBACK */}
          <section className="flex flex-col h-full">
            <div className="gcard h-full">
              <div className="ginner glass-sheen h-full flex flex-col overflow-hidden">
                <div className="gheader flex items-center justify-between">
                  <span>Review Feedback</span>
                  <button
                    type="button"
                    onClick={copyReview}
                    className="flex items-center gap-1 text-slate-300 hover:text-sky-300 transition-colors"
                    disabled={!review}
                  >
                    <IconCopy size={18} />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                {/* FIXED: 스크롤이 잘리던 부분 → min-h-0 + overflow-y-auto */}
                <div className="flex-1 p-6 overflow-y-auto min-h-0 custom-scrollbar">
                  {isLoading && !review && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <IconLoader2 size={40} className="animate-spin mb-4" />
                      <p className="text-base md:text-lg mb-1">AI가 코드를 분석 중...</p>
                      <p className="text-sm text-slate-400">잠시만 기다려주세요.</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-900/50 border border-red-700/60 rounded-lg text-red-200">
                      <div className="flex items-center gap-2 font-semibold">
                        <IconAlertTriangle size={18} />
                        <span>Error</span>
                      </div>
                      <p className="mt-2 text-sm">{error}</p>
                    </div>
                  )}

                  {review && (
                    <div className="whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed text-slate-100">
                      {review}
                    </div>
                  )}

                  {!isLoading && !error && !review && (
                    <div className="h-full flex items-center justify-center text-slate-400/90 text-sm text-center">
                      코드를 제출하면 AI 리뷰가 여기에 표시됩니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}