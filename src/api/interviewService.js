const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 새 AI 면접 세션 시작
 */
export const startInterview = async (repoUrl) => {
  const accessToken = localStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}/api/interview/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ repoUrl }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "AI 면접 세션 시작에 실패했습니다.");
  }

  return res.json();
};

/**
 * 최종 피드백 요청
 */
export const requestInterviewFeedback = async (sessionId, answers) => {
  const accessToken = localStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}/api/interview/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ sessionId, answers }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "AI 면접 피드백 요청에 실패했습니다.");
  }

  return res.json();
};

/**
 * 음성 STT
 */
export const transcribeAnswer = async (audioBlob) => {
  const accessToken = localStorage.getItem("accessToken");

  const formData = new FormData();
  formData.append("audio", audioBlob);

  const res = await fetch(`${BASE_URL}/api/interview/stt`, {
    method: "POST",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "음성 인식에 실패했습니다.");
  }

  const data = await res.json();
  return data.text || "";
};
