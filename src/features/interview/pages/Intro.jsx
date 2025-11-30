import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      setError("GitHub 레포지토리 URL을 입력해주세요.");
      return;
    }
    setError("");
    navigate("/interview/session", { state: { repoUrl } });
  };

  return (
    // 전체 배경: 깊은 어둠 속에 은은한 오로라 효과
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden text-white selection:bg-indigo-500/30">
      
      {/* 배경 장식 요소 (Glow Blobs) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 메인 카드 컨테이너 */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:border-white/20">
          
          {/* 상단 장식 라인 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          <div className="p-8 md:p-10 space-y-8">
            
            {/* 헤더 섹션 */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20 mb-4">
                {/* AI Robot Icon SVG */}
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                AI Interview
              </h1>
              <p className="text-slate-400 text-sm">
                GitHub 코드를 분석하여 맞춤형 면접을 진행합니다.
              </p>
            </div>

            {/* 설명 섹션 (카드 형태의 안내) */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2" />
                <p className="text-sm text-slate-300 leading-relaxed">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/20">기술 문항</span>과 
                      <span className="inline-block px-1.5 py-0.5 mx-1 rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/20">인성 문항</span>
      총 <span className="text-white font-bold border-b border-indigo-500/50 pb-0.5">5문항</span>입니다.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-500 mt-2" />
                <p className="text-sm text-slate-300 leading-relaxed">
                  각 문항: <span className="text-white font-medium">준비 5초</span> / <span className="text-white font-medium">답변 60초</span>
                </p>
              </div>
            </div>

            {/* 입력 폼 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                  Repository URL
                </label>
                <div 
                  className={`relative flex items-center transition-all duration-300 rounded-xl border ${
                    isFocused 
                      ? "bg-slate-900/80 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]" 
                      : "bg-black/20 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="pl-4 text-slate-500">
                    {/* Github Icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-4 py-3.5 bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none rounded-xl"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-400 text-xs animate-pulse">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all duration-200 overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                {/* 버튼 내부 그라데이션 효과 */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative flex items-center gap-2">
                  면접 시작
                </span>
              </button>
            </form>

            <div className="text-center pt-2">
              <a
                href="/"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200 flex items-center justify-center gap-1"
              >
                홈으로 돌아가기
              </a>
            </div>
          </div>
        </div>  
      </div>
    </div>
  );
}