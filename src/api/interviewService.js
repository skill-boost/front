const BASE_URL =
  import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")
    : "/api";

/**
 * 새 AI 면접 세션 시작 (레포 URL 기반 질문 생성)
 * -> POST /interview/start
 */
export const startInterview = async (repoUrl) => {
  const res = await fetch(`${BASE_URL}/interview/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "AI 면접 세션 시작에 실패했습니다.");
  }

  return res.json(); // { sessionId, durationSec, questions }
};

/**
 * 모든 질문 답변(STT 포함) 전달하고 최종 피드백 받기
 * -> POST /interview/feedback
 */
export const requestInterviewFeedback = async (sessionId, answers) => {
  const res = await fetch(`${BASE_URL}/interview/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, answers }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "AI 면접 피드백 요청에 실패했습니다.");
  }

  return res.json();
};

/**
 * 음성 Blob → 텍스트(STT)
 * -> POST /interview/stt
 */
export const transcribeAnswer = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  const res = await fetch(`${BASE_URL}/interview/stt`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "음성 인식에 실패했습니다.");
  }

  const data = await res.json(); // { text: "..." }
  return data.text || "";
};
