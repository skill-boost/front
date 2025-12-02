// src/api/interviewService.js

const BASE_URL = "http://52.79.181.115:30000/api";

/**
 * 새 AI 면접 세션 시작 (레포 URL 기반 질문 생성)
 * -> POST /api/interview/start
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
 * 모든 질문에 대한 답변(STT 전환된 텍스트 포함)을 전달하고
 * 최종 면접 결과 피드백을 받음
 * -> POST /api/interview/feedback
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
 * -> POST /api/interview/stt
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
