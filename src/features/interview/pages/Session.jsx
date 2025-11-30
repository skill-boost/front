import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  startInterview,
  requestInterviewFeedback,
  transcribeAnswer,
} from "@/api/interviewService";
import Timer60 from "../components/Timer60";
import MicRecorder from "../components/MicRecorder";
import QuestionBox from "../components/QuestionBox";
import ProgressDots from "../components/ProgressDots";

export default function Session() {
  const location = useLocation();
  const navigate = useNavigate();
  const repoUrl = location.state?.repoUrl || "";

  const [loading, setLoading] = useState(true);
  // loading | prep | answer | analyzing | error
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");

  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [prepSec, setPrepSec] = useState(5);
  const [answerRunning, setAnswerRunning] = useState(false);

  const [answers, setAnswers] = useState([]);

  // StrictMode에서 중복 호출 방지
  const startedRef = useRef(false);
  // 녹음이 끝난 이유를 저장 (timeout / manual 등)
  const stopReasonRef = useRef("manual");

  // 1) repoUrl 없으면 Intro로
  useEffect(() => {
    if (!repoUrl) {
      navigate("/interview", { replace: true });
    }
  }, [repoUrl, navigate]);

  // 2) 세션 시작: 질문 불러오기
  useEffect(() => {
    if (!repoUrl) return;
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await startInterview(repoUrl);
        console.log("startInterview response:", res);

        const qs = Array.isArray(res.questions) ? res.questions : [];
        if (!qs.length) {
          throw new Error("질문을 불러오지 못했습니다.");
        }

        setSessionId(res.sessionId || null);
        setQuestions(qs);
        setCurrentIndex(0);

        setPhase("prep");
        setPrepSec(5);
        setAnswerRunning(false);
      } catch (e) {
        console.error("startInterview error:", e);
        setError(
          e.message || "AI 면접 세션을 시작하는 동안 오류가 발생했습니다."
        );
        setPhase("error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [repoUrl]);

  // 3) 준비 5초 → 끝나면 answer 단계로 전환 + 녹음 시작
  useEffect(() => {
    if (phase !== "prep") return;

    if (prepSec <= 0) {
      setPhase("answer");
      setAnswerRunning(true);
      stopReasonRef.current = "timeout"; // 기본값
      return;
    }

    const id = setTimeout(() => setPrepSec((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, prepSec]);

  // 4) 한 질문 마무리(실제 답변 텍스트까지 받은 뒤)
  const finishCurrentQuestion = async ({
    answerText,
    durationSec,
    reason,
  }) => {
    const q = questions[currentIndex];
    if (!q) return;

    const newAnswer = {
      questionId: q.id,
      type: q.type,
      question: q.text,
      answerText,
      durationSec,
      endReason: reason,
    };

    const merged = [...answers];
    merged[currentIndex] = newAnswer;
    setAnswers(merged);

    // 마지막 질문이면 → 분석 단계로 넘어가서 피드백 요청
    if (currentIndex === questions.length - 1) {
      setPhase("analyzing");
      try {
        const feedback = await requestInterviewFeedback(
          sessionId,
          merged.filter(Boolean)
        );
        navigate("/interview/result", { state: { feedback } });
      } catch (e) {
        console.error("requestInterviewFeedback error:", e);
        setError(e.message || "피드백을 가져오는 중 오류가 발생했습니다.");
        setPhase("error");
      }
      return;
    }

    // 다음 질문 준비
    setCurrentIndex((idx) => {
      const next = idx + 1;
      setPhase("prep");
      setPrepSec(5);
      setAnswerRunning(false);
      return next;
    });
  };

  // 5) Timer가 0이 됐을 때: 녹음만 멈추고, 실제 마무리는 STT 이후에
  const handleTimeout = () => {
    if (phase !== "answer") return;
    stopReasonRef.current = "timeout";
    setAnswerRunning(false); // → MicRecorder가 stop되고 onStop 호출됨
  };

  // 6) MicRecorder가 실제로 녹음을 끝냈을 때
  const handleMicStop = async ({ blob, durationSec }) => {
    if (phase !== "answer") return; // 이미 다른 단계로 넘어갔으면 무시

    try {
      const text = await transcribeAnswer(blob);
      await finishCurrentQuestion({
        answerText: text,
        durationSec,
        reason: stopReasonRef.current || "manual",
      });
    } catch (e) {
      console.error("STT error:", e);
      setError(e.message || "음성 인식 중 오류가 발생했습니다.");

      // STT 실패해도 빈 답변으로 마무리는 해 준다
      await finishCurrentQuestion({
        answerText: "",
        durationSec,
        reason: "stt-error",
      });
    }
  };

  // ===== 화면 분기들 =====

  if (loading || phase === "loading") {
    return (
      <div className="bg-app min-h-screen flex items-center justify-center p-6">
        <div className="gcard max-w-xl w-full">
          <div className="ginner glass-sheen">
            <div className="gheader">분석 중...</div>
            <div className="p-6 space-y-3">
              <p className="text-slate-300 text-sm">
                GitHub 레포지토리를 분석해서 기술 질문을 만드는 중입니다.
              </p>
              <p className="text-xs text-slate-500">
                이 작업은 코드 구조와 기술 스택을 파악하는 데 몇 초 정도 걸릴 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "analyzing") {
    return (
      <div className="bg-app min-h-screen flex items-center justify-center p-6">
        <div className="gcard max-w-xl w-full">
          <div className="ginner glass-sheen">
            <div className="gheader">답변 분석중...</div>
            <div className="p-6 space-y-3">
              <p className="text-slate-300 text-sm">
                방금 녹음된 답변들을 기반으로 AI가 면접 결과를 정리하고 있습니다.
              </p>
              <p className="text-xs text-slate-500">
                예상 피드백 리포트를 생성하는 데 약간의 시간이 걸릴 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="bg-app min-h-screen flex items-center justify-center p-6">
        <div className="gcard max-w-xl w-full">
          <div className="ginner glass-sheen">
            <div className="gheader">AI 면접 세션 오류</div>
            <div className="p-6 space-y-4">
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={() => navigate("/interview")}
                className="btn-neon w-full"
              >
                다시 시도하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = questions.length || 5;
  const current = questions[currentIndex];

  return (
    <div className="bg-app min-h-screen flex items-center justify-center p-6">
      <div className="gcard max-w-4xl w-full">
        <div className="ginner glass-sheen">
          <div className="gheader flex items-center justify-between">
            <div>AI Interview</div>
            <div className="flex items-center gap-3">
              <ProgressDots total={total} current={currentIndex} />
              <div className="text-xs text-slate-300">
                Q {currentIndex + 1} / {total}
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
            {/* 왼쪽: 질문 */}
            <div className="space-y-4">
              {current && (
                <QuestionBox
                  type={current.type === "TECH" ? "tech" : "behav"}
                  text={current.text}
                />
              )}
            </div>

            {/* 오른쪽: 타이머 + 마이크 + 컨트롤 */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 flex flex-col items-center gap-3">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  {phase === "prep" ? "준비 시간" : "답변 시간"}
                </div>

                {phase === "prep" ? (
                  <div className="text-3xl font-semibold text-indigo-300 tabular-nums">
                    {prepSec}s
                  </div>
                ) : (
                  <Timer60 running={answerRunning} onTimeout={handleTimeout} />
                )}

                <MicRecorder running={answerRunning} onStop={handleMicStop} />

                <div className="w-full pt-2 border-t border-slate-800 mt-2">
                  {phase === "answer" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (phase !== "answer") return;
                        stopReasonRef.current = "manual";
                        setAnswerRunning(false); // → MicRecorder stop → STT → finish
                      }}
                      className="btn-neon w-full text-center"
                    >
                      다음 질문으로
                    </button>
                  )}

                  {phase === "prep" && (
                    <p className="text-[11px] text-slate-500 text-center mt-1">
                      5초 준비 후 자동으로 답변 녹음이 시작됩니다.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/interview")}
                className="w-full text-xs text-slate-400 hover:text-slate-200 text-center"
              >
                면접 종료 후 처음으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
