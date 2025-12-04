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

// --- 마크다운 & 코드 하이라이팅 ---
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// --------------------------------

import { fetchCodeReview } from "@/api/reviewService";

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

export default function Review() {
  const [mode, setMode] = useState("code");

  const [code, setCode] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [userComment, setUserComment] = useState("");

  const [review, setReview] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);

    setCode("");
    setRepoUrl("");
    setUserComment("");
    setError(null);
    setReview("");
    setQuestions([]);
    setShowQuestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError("리뷰할 코드를 입력해주세요.");
      return;
    }

    if (mode === "repo" && !repoUrl.trim()) {
      setError(
        "Repository URL을 입력해주세요. (예: https://github.com/owner/repo)"
      );
      return;
    }

    setIsLoading(true);
    setReview("");
    setQuestions([]);
    setShowQuestions(false);

    try {
      const data = await fetchCodeReview(
        code,
        userComment,
        mode === "repo" ? repoUrl : null
      );

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
      setError(err.message || "코드 리뷰 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyReview = async () => {
    try {
      const textToCopy = showQuestions
        ? questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n")
        : review || "";
      if (!textToCopy) return;

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop
    }
  };

  return (
    <div className="relative min-h-screen bg-app text-white px-6 py-10">
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

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="flex flex-col">
            <div className="gcard w-full h-[75vh]">
              <div className="ginner glass-sheen flex flex-col h-full">
                <div className="gheader flex items-center justify-between">
                  <span>Paste Your Code</span>

                  <div className="inline-flex rounded-full bg-slate-900/40 p-1 text-[11px] md:text-xs">
                    <button
                      type="button"
                      onClick={() => handleModeChange("code")}
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
                      onClick={() => handleModeChange("repo")}
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

                <div className="flex-1 p-5 pt-4 pb-3 overflow-y-auto custom-scrollbar">
                  {mode === "code" ? (
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="여기에 리뷰할 코드를 붙여넣으세요"
                      className="w-full min-h-[200px] bg-transparent text-sm md:text-[15px] leading-relaxed text-slate-100 placeholder:text-slate-500/80 resize-none focus:outline-none custom-scrollbar"
                      spellCheck="false"
                    />
                  ) : (
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="예: https://github.com/owner/repo"
                        className="w-full rounded-xl bg-slate-900/40 border border-slate-700/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500/80 focus:outline-none focus:border-sky-400/80"
                      />

                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="레포지터리 안에서 리뷰받고 싶은 주요 파일 코드를 붙여넣어 주세요"
                        className="w-full min-h-[140px] bg-transparent text-sm md:text-[15px] leading-relaxed text-slate-100 placeholder:text-slate-500/80 resize-none focus:outline-none custom-scrollbar"
                        spellCheck="false"
                      />
                    </div>
                  )}
                </div>

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
                          : "예: 백엔드 구조 위주로 리뷰해줘 / 테스트 코드 품질 위주로"
                      }
                      className="w-full h-[96px] rounded-xl bg-slate-900/40 border border-slate-700/60 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500/80 resize-none focus:outline-none custom-scrollbar"
                    />
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        (mode === "code"
                          ? !code.trim()
                          : !repoUrl.trim() || !code.trim())
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
                        onClick={() => setShowQuestions((p) => !p)}
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
                  {isLoading && !review && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <IconLoader2 size={40} className="animate-spin mb-4" />
                      <p className="text-base">AI가 코드를 분석 중입니다...</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-900/40 border border-red-700/50 rounded-lg text-red-200">
                      <div className="flex items-center gap-2 font-semibold mb-1">
                        <IconAlertTriangle size={18} />
                        <span>Error</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{error}</p>
                    </div>
                  )}

                  {!isLoading && !error && !review && (
                    <div className="h-full flex items-center justify-center text-slate-400/90 text-center">
                      코드를 제출하면 AI 리뷰와 예상 면접 질문이 표시됩니다.
                    </div>
                  )}

                  {!showQuestions && review && (
                    <div className="text-sm md:text-[15px] leading-relaxed text-slate-200">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // ★★★ node 제거됨 ★★★
                          code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <div className="my-4 rounded-md overflow-hidden border border-slate-700">
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                  customStyle={{
                                    margin: 0,
                                    padding: "1.2rem",
                                  }}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code
                                className="bg-slate-700/60 text-sky-300 px-1.5 py-0.5 rounded font-mono text-sm mx-1"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          // ★★★ node 제거됨 ★★★
                          h1: ({ ...props }) => (
                            <h1
                              className="text-2xl font-bold text-sky-400 mt-6 mb-4 pb-2 border-b border-white/10"
                              {...props}
                            />
                          ),
                          h2: ({ ...props }) => (
                            <h2
                              className="text-xl font-semibold text-indigo-300 mt-5 mb-3"
                              {...props}
                            />
                          ),
                          h3: ({ ...props }) => (
                            <h3
                              className="text-lg font-semibold text-white mt-4 mb-2"
                              {...props}
                            />
                          ),
                          ul: ({ ...props }) => (
                            <ul
                              className="list-disc list-inside space-y-1 my-3 pl-2 text-slate-300"
                              {...props}
                            />
                          ),
                          ol: ({ ...props }) => (
                            <ol
                              className="list-decimal list-inside space-y-1 my-3 pl-2 text-slate-300"
                              {...props}
                            />
                          ),
                          blockquote: ({ ...props }) => (
                            <blockquote
                              className="border-l-4 border-indigo-500 pl-4 py-1 my-4 italic bg-slate-800/30 text-slate-400 rounded-r"
                              {...props}
                            />
                          ),
                          a: ({ ...props }) => (
                            <a
                              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            />
                          ),
                          p: ({ ...props }) => (
                            <p className="mb-3 last:mb-0" {...props} />
                          ),
                        }}
                      >
                        {review}
                      </ReactMarkdown>
                    </div>
                  )}

                  {showQuestions && questions.length > 0 && (
                    <div className="text-sm md:text-[15px] leading-relaxed text-slate-100">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // ★★★ node 제거됨 ★★★
                          p: ({ ...props }) => (
                            <p
                              className="mb-4 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {questions
                          .map((q, i) => `**${i + 1}.** ${q}`)
                          .join("\n\n")}
                      </ReactMarkdown>
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