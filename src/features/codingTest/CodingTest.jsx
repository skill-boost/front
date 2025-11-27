import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Send,
  Play,
  CheckCircle2,
  XCircle,
  Terminal,
  RefreshCw,
  Trophy,
  AlertCircle,
  ChevronRight,
  Maximize2,
  Home,
  Code2
} from "lucide-react";

// -----------------------------------------------------------
// [오류 수정] codingService.js 파일을 직접 통합하여 경로 오류 해결
// -----------------------------------------------------------

const BASE_URL = "/api";

const fetchRandomProblem = async (difficulty) => {
  const query = difficulty ? `?difficulty=${difficulty}` : "";
  // API 경로: /api/coding/problems/random
  const response = await fetch(`${BASE_URL}/coding/problems/random${query}`);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `랜덤 문제를 불러오지 못했습니다. (status: ${response.status})`);
  }

  return await response.json();
};

const submitCode = async ({ problemId, code, language, userId }) => {
  const payload = {
    problemId,
    sourceCode: code,
    language,
    userId: userId ?? 1 // userId가 null/undefined일 경우 기본값 1 사용 (Long 타입 일치)
  };

  // API 경로: /api/coding/submissions
  const response = await fetch(`${BASE_URL}/coding/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `채점 요청에 실패했습니다. (status: ${response.status})`);
  }

  return await response.json();
};

// -----------------------------------------------------------
// 컴포넌트 시작
// -----------------------------------------------------------


// 언어 옵션
const LANGUAGE_OPTIONS = [
  { value: "python", label: "Python", color: "text-blue-400", activeBorder: "border-blue-400/60 bg-blue-500/10" },
  { value: "java", label: "Java", color: "text-orange-400", activeBorder: "border-orange-400/60 bg-orange-500/10" },
  { value: "cpp", label: "C++", color: "text-purple-400", activeBorder: "border-purple-400/60 bg-purple-500/10" },
];

// 기본 템플릿
const LANGUAGE_TEMPLATES = {
  python: `import sys

def main():
    # 이곳에 코드를 작성하세요
    pass

if __name__ == "__main__":
    main()
`,
  java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        // 이곳에 코드를 작성하세요
    }
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    // 이곳에 코드를 작성하세요

    return 0;
}
`,
};

// 난이도 색
const DIFFICULTY_CONFIG = {
  EASY: { label: "쉬움", color: "text-emerald-300 bg-emerald-500/20 border-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.15)]" },
  MEDIUM: { label: "보통", color: "text-amber-300 bg-amber-500/20 border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]" },
  HARD: { label: "어려움", color: "text-rose-300 bg-rose-500/20 border-rose-400/30 shadow-[0_0_15px_rgba(251,113,133,0.15)]" },
};

export default function CodingTest() {
  const [difficulty, setDifficulty] = useState("EASY");
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.python);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // AI 피드백을 보여줄지 결과 요약을 보여줄지 토글하는 상태
  const [showFeedback, setShowFeedback] = useState(false);

  // 언어 변경
  const handleChangeLanguage = (nextLang) => {
    if (code !== LANGUAGE_TEMPLATES[language] && code.trim() !== "") {
        // window.confirm 대신 커스텀 모달이 권장되지만, 빠른 해결을 위해 일단 유지
        if (!window.confirm("언어를 변경하면 작성 중인 코드가 초기화됩니다. 계속하시겠습니까?")) {
            return;
        }
    }
    setLanguage(nextLang);
    setCode(LANGUAGE_TEMPLATES[nextLang] || "");
  };

  // 랜덤 문제 로드
  const handleLoadRandom = async () => {
    setIsLoadingProblem(true);
    setErrorMsg("");
    setResult(null);
    setShowFeedback(false);
    try {
      const data = await fetchRandomProblem(difficulty);
      setProblem(data);
    } catch (err) {
      setErrorMsg(
        err?.message || "문제 로딩 중 오류가 발생했습니다. (백엔드 서버 확인 필요)"
      );
    } finally {
      setIsLoadingProblem(false);
    }
  };

  // 제출
  const handleSubmit = async () => {
    if (!problem) {
      setErrorMsg("문제를 먼저 로드해주세요.");
      return;
    }
    if (!code.trim()) {
      setErrorMsg("솔루션 코드를 작성해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setResult(null);
    setShowFeedback(false);

    try {
      const res = await submitCode({
        problemId: problem.id,
        code,
        language,
        userId: 1, // Long 타입이므로 숫자 1 사용
      });
      setResult(res);
      // AI 피드백이 있다면, 기본적으로 피드백 화면을 보여주도록 설정
      if (res.aiFeedback) {
        setShowFeedback(true);
      } else {
        setShowFeedback(false);
      }
    } catch (err) {
      setErrorMsg(
        err?.message || "채점 서버 통신 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPassed = (status) => {
    return ["AC", "SUCCESS", "PASSED"].includes(status?.toUpperCase());
  };

  return (
    // 배경: 딥 블루 그라데이션
    <div className="h-screen w-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden flex flex-col selection:bg-cyan-500/30">
      
      {/* 배경 조명 효과 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] left-[20%] w-[70%] h-[70%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[130px] rounded-full mix-blend-screen" />
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      {/* 헤더 */}
      <header className="relative z-20 h-16 border-b border-white/5 bg-[#0f172a]/90 backdrop-blur-md shrink-0 flex items-center justify-between px-6">
        
        {/* 왼쪽: Home 버튼 */}
        <div className="flex items-center w-64">
          <Link
            to="/"
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300 hover:border-indigo-400/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <Home size={16} className="text-indigo-300 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-indigo-100/80 group-hover:text-white transition-colors">Home</span>
          </Link>
        </div>

        {/* 중앙: 타이틀 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200 drop-shadow-[0_0_15px_rgba(165,180,252,0.5)]">
              AI Coding Test
            </span>
          </h1>
          <div className="relative flex items-center justify-center w-6 h-6">
            <Sparkles className="w-5 h-5 text-cyan-300 absolute animate-pulse" />
            <div className="absolute inset-0 bg-cyan-400/30 blur-lg rounded-full" />
          </div>
        </div>

        {/* 오른쪽: 난이도 선택 & 문제 생성 버튼 */}
        <div className="flex items-center justify-end gap-4 w-auto">
          {/* 난이도 탭 */}
          <div className="hidden md:flex bg-[#1e293b]/50 rounded-lg p-1 relative border border-white/10">
            {["EASY", "MEDIUM", "HARD"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`relative px-4 py-1.5 text-[11px] font-bold rounded-md transition-all duration-300 ${
                  difficulty === d
                    ? "text-white bg-indigo-500 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {d === "EASY" ? "쉬움" : d === "MEDIUM" ? "보통" : "어려움"}
              </button>
            ))}
          </div>

          <div className="w-[1px] h-6 bg-white/10 hidden md:block" />

          {/* 생성 버튼 */}
          <button
            onClick={handleLoadRandom}
            disabled={isLoadingProblem}
            className="group flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {isLoadingProblem ? (
              <RefreshCw size={14} className="animate-spin text-white/80" />
            ) : (
              <Sparkles size={14} className="text-white/90 group-hover:text-white transition-colors" />
            )}
            <span className="tracking-wide">{isLoadingProblem ? "생성 중..." : "문제 생성"}</span>
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="relative z-10 flex-1 mx-auto max-w-[1920px] w-full p-6 flex flex-col gap-6 overflow-hidden">
        
        {/* 에러 알림 */}
        {errorMsg && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 flex items-start gap-3 text-rose-200 shadow-lg backdrop-blur-md max-w-2xl mx-auto shrink-0 absolute top-20 left-1/2 -translate-x-1/2 z-50">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-rose-400" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* 메인 작업 영역 (Grid) */}
        <div className="flex-1 min-h-0 grid lg:grid-cols-[1fr_1.2fr] gap-6 h-full">
          
          {/* 왼쪽: 문제 설명 패널 */}
          <section className="flex flex-col rounded-3xl bg-[#0B1120]/90 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl relative group h-full">
             
             {/* 패널 헤더 (고정) */}
            <div className="h-12 px-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-2.5 text-slate-400">
                <Maximize2 size={16} className="text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400/80">문제 설명</span>
              </div>
              {problem && (
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border backdrop-blur-sm ${DIFFICULTY_CONFIG[problem.difficulty].color}`}>
                  {DIFFICULTY_CONFIG[problem.difficulty].label}
                </span>
              )}
            </div>

            {/* 컨텐츠 영역 (여기가 스크롤됨) */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-indigo-500/20 hover:scrollbar-thumb-indigo-500/40 scrollbar-track-transparent">
              {isLoadingProblem ? (
                // 로딩 스켈레톤
                <div className="space-y-8 animate-pulse opacity-60">
                  <div className="h-10 bg-indigo-400/10 rounded-lg w-2/3" />
                  <div className="space-y-4">
                    <div className="h-4 bg-indigo-400/10 rounded w-full" />
                    <div className="h-4 bg-indigo-400/10 rounded w-5/6" />
                    <div className="h-4 bg-indigo-400/10 rounded w-4/6" />
                  </div>
                  <div className="h-40 bg-indigo-400/10 rounded-2xl w-full" />
                </div>
              ) : problem ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white leading-tight tracking-tight mb-2 drop-shadow-md">
                      {problem.title}
                    </h2>
                    <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"></div>
                  </div>

                  <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-indigo-100 max-w-none leading-relaxed text-base/7">
                    <div className="whitespace-pre-wrap font-normal">{problem.description}</div>
                  </div>

                  {problem.samples && problem.samples.length > 0 && (
                    <div className="mt-8 space-y-5">
                      <h3 className="text-sm font-bold text-indigo-200/80 flex items-center gap-2 uppercase tracking-wider">
                        <Terminal size={16} className="text-indigo-400"/>
                        예시 입력/출력
                      </h3>
                      <div className="grid gap-4">
                        {problem.samples.map((sample, idx) => (
                          <div key={idx} className="group/case rounded-2xl border border-white/10 bg-[#0f172a]/40 overflow-hidden hover:border-indigo-500/30 transition-colors shadow-inner">
                            <div className="px-5 py-2 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                              <span className="text-xs font-medium text-slate-400 group-hover/case:text-indigo-300 transition-colors">Case #{idx + 1}</span>
                            </div>
                            <div className="p-5 grid sm:grid-cols-2 gap-6">
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">입력</p>
                                <div className="rounded-xl bg-[#0b1120] border border-white/5 p-3.5 font-mono text-sm text-indigo-100/90 overflow-x-auto shadow-inner">
                                  {sample.inputData}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">출력</p>
                                <div className="rounded-xl bg-[#0b1120] border border-white/5 p-3.5 font-mono text-sm text-cyan-300/90 overflow-x-auto shadow-inner">
                                  {sample.expectedOutput}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center relative z-10 backdrop-blur-sm">
                      <Sparkles size={40} className="text-slate-500 group-hover:text-indigo-400 transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-slate-300">문제가 선택되지 않았습니다.</p>
                    <p className="text-sm text-slate-500">우측 상단의 "문제 생성" 버튼을 눌러 시작하세요.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 오른쪽: 코드 에디터 및 실행 결과 */}
          <div className="flex flex-col h-full gap-6">
            
            {/* 1. 코드 에디터 카드 */}
            <section className="flex-1 flex flex-col rounded-3xl bg-[#172033]/60 backdrop-blur-md border border-indigo-500/10 overflow-hidden shadow-2xl relative group min-h-0">
              {/* 에디터 툴바 */}
              <div className="h-12 px-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-1.5 bg-[#0f172a]/50 p-1 rounded-lg border border-white/5">
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleChangeLanguage(opt.value)}
                      className={`px-3 py-1 text-[11px] font-medium rounded-md flex items-center gap-1.5 transition-all duration-200 ${
                        language === opt.value
                          ? `bg-[#1e293b] text-white shadow-lg border ${opt.activeBorder || 'border-white/10'}`
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${language === opt.value ? opt.color.replace('text', 'bg') : 'bg-slate-600'}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    disabled
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-[11px] font-medium text-slate-500 opacity-50 cursor-not-allowed hover:bg-white/5"
                  >
                    <Play size={12} />
                    <span>실행</span>
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !problem}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none hover:translate-y-[-1px] active:translate-y-[0px]"
                  >
                    {isSubmitting ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <Send size={12} />
                    )}
                    <span>{isSubmitting ? "채점 중" : "제출"}</span>
                  </button>
                </div>
              </div>

              {/* 에디터 영역 */}
              <div className="flex-1 relative group bg-[#050914] overflow-hidden"> 
                <textarea
                  className="w-full h-full bg-transparent text-[13px] font-mono text-slate-200 p-6 outline-none resize-none leading-7 selection:bg-indigo-500/30 scrollbar-thin scrollbar-thumb-indigo-500/20 hover:scrollbar-thumb-indigo-500/40 placeholder:text-slate-600/70"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  placeholder="// 이곳에 코드를 작성하세요..."
                />
              </div>
            </section>

            {/* 2. 실행 결과 카드 */}
            <section className="shrink-0 h-[280px] flex flex-col rounded-3xl bg-[#0b101b]/95 backdrop-blur-md border border-indigo-500/10 overflow-hidden shadow-2xl relative group">
              <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.01] shrink-0">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={14} className={result ? "text-yellow-500" : "text-slate-600"} />
                  채점 결과
                </h3>
                {result && (
                  <span className="text-[10px] font-mono text-slate-500 bg-white/[0.05] px-2 py-0.5 rounded">
                    ID: #{result.submissionId}
                  </span>
                )}
              </div>

              <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/20">
                {result ? (
                  <div className="animate-in slide-in-from-bottom-2 fade-in">
                    
                    {/* 상단 요약/피드백 토글 */}
                    <div className="flex items-center justify-between gap-5 mb-5">
                      <div className="flex items-center gap-4">
                         {/* 결과 상태 표시 */}
                        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-bold shadow-lg backdrop-blur-sm ${
                          isPassed(result.status)
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10"
                        }`}>
                          {isPassed(result.status) ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                          <span>{isPassed(result.status) ? "정답입니다! 🎉" : result.status === 'PARTIAL' ? "부분 정답입니다" : "오답입니다"}</span>
                        </div>
                        
                        {/* 테스트 통과 수 (피드백 모드가 아닐 때만 표시) */}
                        {!showFeedback && (
                          <span className="text-sm text-slate-400">
                            테스트 통과: <span className="text-white font-mono font-bold text-base">{result.passedCount ?? 0}</span>
                            <span className="mx-1.5 opacity-50">/</span>
                            {result.totalCount ?? 0}
                          </span>
                        )}
                      </div>

                      {/* AI 피드백 토글 버튼 */}
                      {result.aiFeedback && (
                        <button
                          onClick={() => setShowFeedback((prev) => !prev)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-all"
                        >
                          <ChevronRight
                            size={12}
                            className={`transition-transform ${showFeedback ? "rotate-90" : ""}`}
                          />
                          {showFeedback ? "결과 요약 보기" : "AI 피드백 보기"}
                        </button>
                      )}
                    </div>
                    
                    {/* 결과 내용 */}
                    {showFeedback && result.aiFeedback ? (
                      // AI 피드백 섹션
                      <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 shadow-inner">
                        <h4 className="text-xs font-bold text-cyan-200 flex items-center gap-2 mb-2 uppercase tracking-wider">
                            <Sparkles size={14} className="text-cyan-400" />
                            AI 코드 리뷰
                        </h4>
                        <div className="text-sm text-slate-300 whitespace-pre-wrap font-light leading-relaxed">
                            {result.aiFeedback}
                        </div>
                      </div>
                    ) : (
                      // 결과 요약 섹션
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-[#1e293b]/50 border border-white/5 shadow-inner">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Total Score</p>
                          <p className="text-3xl font-bold font-mono text-white tracking-tight">{result.score ?? 0}</p>
                        </div>
                        <div className="col-span-2 p-4 rounded-xl bg-[#1e293b]/50 border border-white/5 shadow-inner">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">System Message</p>
                          <p className="text-sm text-slate-300 leading-relaxed font-light">
                            {result.message || "채점 결과 메시지가 없습니다."}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3 py-2">
                    <Code2 size={28} className="opacity-20" />
                    <p className="text-xs font-medium opacity-50">코드를 제출하면 여기에 실행 결과가 표시됩니다.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}