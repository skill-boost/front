const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCodeReview = async (code, comment, repoUrl) => {
  const accessToken = localStorage.getItem("accessToken");

  const payload = {
    code,
    comment: comment?.trim() || null,
    repoUrl: repoUrl?.trim() || null,
  };

  try {
    const res = await fetch(`${BASE_URL}/api/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();

    if (res.status === 401 || res.status === 403) {
      throw new Error(
        "로그인이 필요합니다. GitHub 로그인 후 다시 시도해 주세요."
      );
    }

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
      // 응답이 순수 텍스트일 때
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
