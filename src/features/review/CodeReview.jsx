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
  interactivity: { events: { resize: true } },
  particles: {
    color: { value: "#8eb5ff" },
    links: { enable: true, opacity: 0.22, width: 1 },
    move: { enable: true, speed: 0.45 },
    number: { value: 42 },
    opacity: { value: 0.25 },
    size: { value: { min: 1, max: 3 } },
  },
};

// 리뷰 텍스트 포맷팅: "- " → "□ " + 항목 사이 한 줄 띄우기
function formatReviewText(review) {
  if (!review) return "";
  return review
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^- /, "□ "))
    .join("\n\n");
}

export default function Review() {
  // 모드: 코드 / 레포
  const [mode, setMode] = useState("code"); // "code" | "repo"

  const [code, setCode] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [userComment, setUserComment] = useState("");

  const [review, setReview] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 아직 레포 모드는 백엔드 구현 전이라 안내만 띄우고 return
    if (mode === "repo") {
      if (!repoUrl.trim()) return;
      setError(
        "Repository URL 기반 리뷰는 아직 백엔드 구현 전입니다. 우선 코드를 직접 붙여넣어서 사용해줘. 이 UI는 나중에 레포 분석 백엔드 만들 때 그대로 연결하면 된다!"
      );
      return;
    }

    if (!code.trim()) return;

    setIsLoading(true);
    setReview("");
    setQuestions([]);
    setShowQuestions(false);

    try {
      const data = await fetchCodeReview(code, userComment);
      console.log("[CodeReview] parsed data:", data);

      // review 텍스트 후보 몇 가지에서 찾아보기
      const reviewText =
        typeof data?.review === "string"
          ? data.review
          : typeof data?.content === "string"
          ? data.content
          : typeof data === "string"
          ? data
          : "";

      if (!reviewText) {
        throw new Error("AI 응답이 비어 있습니다.");
      }

      setReview(reviewText);
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReview = async () => {
    try {
      const textToCopy = showQuestions
        ? questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n")
        : review || "";

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative min-h-screen bg-app text-white px-6 py-10">
      <Particles
        options={particlesOptions}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
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

        {/* GRID */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: 입력 카드 */}
          <section className="flex flex-col">
            <div className="gcard w-full h-[75vh]">
              <div className="ginner glass-sheen flex flex-col h-full">
                {/* 헤더: 기존 디자인 + 작게 모드 토글만 추가 */}
                <div className="gheader flex items-center justify-between">
                  <span>Paste Your Code</span>

                  <div className="inline-flex rounded-full bg-slate-900/40 p-1 text-[11px] md:text-xs">
                    <button
                      type="button"
                      onClick={() => setMode("code")}
                      className={`px-3 py-1 rounded-full transition ${
                        mode === "code"
                          ? "bg-sky-500 text-white"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("repo")}
                      className={`px-3 py-1 rounded-full transition ${
                        mode === "repo"
                          ? "bg-sky-500 text-white"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      Repo
                    </button>
                  </div>
                </div>

                {/* 본문: 코드 / 레포 입력만 조건부로 바꿈, 카드 레이아웃은 그대로 */}
                <div className="flex-1 p-5 pt-4 pb-3 overflow-y-auto custom-scrollbar">
                  {mode === "code" ? (
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="여기에 리뷰할 코드를 붙여넣으세요..."
                      className="w-full h-full bg-transparent text-sm md:text-[15px] leading-relaxed text-slate-100 placeholder:text-slate-500/80 resize-none focus:outline-none"
                      spellCheck="false"
                    />
                  ) : (
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="예: https://github.com/username/project"
                        className="w-full rounded-xl bg-slate-900/40 border border-slate-700/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500/80 focus:outline-none focus:border-sky-400/80"
                      />
                      <p className="text-[11px] md:text-xs text-slate-400">
                        Repo 모드는 UI만 먼저 만들어둔 상태야. 나중에 백엔드에서
                        레포 코드를 읽어오는 기능을 만들면 이 입력값을 그대로
                        연결해서, 전체 프로젝트 기준 코드 리뷰 + 예상 면접 질문
                        생성으로 확장할 수 있어.
                      </p>
                    </div>
                  )}
                </div>

                {/* 요구사항 + 버튼 (기존 디자인 유지) */}
                <form
                  onSubmit={handleSubmit}
                  className="border-t border-white/5 px-5 pt-3 pb-4 space-y-3"
                >
                  <div>
                    <label className="block text-xs text-slate-300/80 mb-1">
                      요구사항 (선택)
                    </label>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder={
                        mode === "code"
                          ? "예: 보안 위주로 리뷰해줘 / 성능 개선 포인트 중심으로 해줘"
                          : "예: 백엔드 구조 위주로 리뷰해줘 / 테스트 코드 품질 위주로 봐줘 (레포 모드 구현되면 사용 예정)"
                      }
                      className="w-full h-[96px] rounded-xl bg-slate-900/40 border border-slate-700/60 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500/80 resize-none focus:outline-none custom-scrollbar"
                    />
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        (mode === "code" ? !code.trim() : !repoUrl.trim())
                      }
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-medium shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {isLoading ? (
                        <>
                          <IconLoader2 size={18} className="animate-spin" />
                          Reviewing...
                        </>
                      ) : (
                        <>
                          <IconSparkles size={18} />
                          AI 리뷰 요청
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* RIGHT: 리뷰 / 질문 카드 (이전 버전 그대로 유지) */}
          <section className="flex flex-col">
            <div className="gcard w-full h-[75vh]">
              <div className="ginner glass-sheen flex flex-col h-full">
                <div className="gheader flex items-center justify-between">
                  <span>
                    {showQuestions ? "Interview Questions" : "Review Feedback"}
                  </span>

                  <div className="flex items-center gap-2">
                    {review && questions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowQuestions((prev) => !prev)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs md:text-sm rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
                      >
                        <IconSparkles size={16} />
                        {showQuestions ? "코드 리뷰 보기" : "예상 면접 질문"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={copyReview}
                      className="flex items-center gap-1 text-slate-300/90 hover:text-sky-300 transition-colors"
                      disabled={!review && questions.length === 0}
                    >
                      <IconCopy size={18} />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                  {/* 로딩 */}
                  {isLoading && !review && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <IconLoader2 size={40} className="animate-spin mb-4" />
                      <p className="text-base">
                        AI가 코드를 분석 중입니다...
                      </p>
                    </div>
                  )}

                  {/* 에러 */}
                  {error && (
                    <div className="p-4 bg-red-900/40 border border-red-700/50 rounded-lg text-red-200">
                      <div className="flex items-center gap-2 font-semibold mb-1">
                        <IconAlertTriangle size={18} />
                        <span>Error</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{error}</p>
                    </div>
                  )}

                  {/* 초기 상태 */}
                  {!isLoading && !error && !review && (
                    <div className="h-full flex items-center justify-center text-slate-400/90 text-center">
                      코드를 제출하면 AI 리뷰와 예상 면접 질문이 표시됩니다.
                    </div>
                  )}

                  {/* 리뷰 화면 */}
                  {!showQuestions && review && (
                    <pre className="whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed text-slate-100">
                      {formatReviewText(review)}
                    </pre>
                  )}

                  {/* 질문 화면 */}
                  {showQuestions && questions.length > 0 && (
                    <ol className="list-decimal list-inside space-y-3 text-sm md:text-[15px] leading-relaxed text-slate-100">
                      {questions.map((q, idx) => (
                        <li key={idx} className="whitespace-pre-wrap">
                          {q.trim()}
                        </li>
                      ))}
                    </ol>
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
