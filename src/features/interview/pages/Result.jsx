import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const feedback = location.state?.feedback;

  if (!feedback) {
    // 새로고침 등으로 state 날아간 경우
    return (
      <div className="bg-app min-h-screen flex items-center justify-center p-4">
        <div className="gcard max-w-md w-full">
          <div className="ginner glass-sheen">
            <div className="gheader text-sm">AI Interview Result</div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-red-300">
                면접 결과 정보를 찾을 수 없습니다. 다시 AI 면접을 진행해 주세요.
              </p>
              <button
                onClick={() => navigate("/interview")}
                className="btn-neon w-full text-sm"
              >
                AI 면접 다시 시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { overallScore, summary } = feedback;

  return (
    <div className="bg-app min-h-screen flex items-center justify-center p-4">
      <div className="gcard max-w-2xl w-full">
        <div className="ginner glass-sheen">
          <div className="gheader flex items-center justify-between text-sm">
            <div>AI Interview Result</div>
          </div>

          <div className="p-4 space-y-6">
            {/* 종합 점수 + 요약 */}
            <section className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  Overall Score
                </p>
                <p className="text-3xl font-bold text-indigo-300 mt-1">
                  {overallScore}
                  <span className="text-sm text-slate-400 ml-1">/ 100</span>
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                  AI Summary
                </p>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {summary}
                </p>
              </div>
            </section>

            {/* 버튼들 */}
            <section className="flex flex-col md:flex-row gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => navigate("/interview")}
                className="btn-neon flex-1 text-center text-sm"
              >
                다시 AI 면접 보기
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 text-[11px] text-slate-300 hover:text-white text-center"
              >
                홈으로 가기
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
