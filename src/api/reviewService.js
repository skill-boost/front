// src/api/reviewService.js
const BASE_URL = "http://localhost:8080/api";

export const fetchCodeReview = async (code, comment, repoUrl) => {
  const payload = {
    code: code,
    comment: comment && comment.trim() ? comment.trim() : null,
    repoUrl: repoUrl && repoUrl.trim() ? repoUrl.trim() : null,
  };

  try {
    const res = await fetch(`${BASE_URL}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();

    if (!res.ok) {
      try {
        const errJson = JSON.parse(raw);
        throw new Error(
          errJson.message ||
            errJson.error ||
            `코드 리뷰 요청 실패 (status: ${res.status})`
        );
      } catch {
        throw new Error(
          raw || `코드 리뷰 요청 실패 (status: ${res.status})`
        );
      }
    }

    try {
      return JSON.parse(raw);
    } catch {
      return { review: raw, questions: [] };
    }
  } catch (error) {
    console.error("API 요청 실패:", error);
    if (error.message === "Failed to fetch") {
      throw new Error(
        "서버에 연결할 수 없습니다. 백엔드 서버가 켜져 있는지 확인해주세요."
      );
    }
    throw error;
  }
};
