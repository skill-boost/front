const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 난이도에 따라 랜덤 코딩 문제를 가져옵니다.
 */
export const fetchRandomProblem = async (difficulty) => {
  const accessToken = localStorage.getItem("accessToken");

  const query = difficulty ? `?difficulty=${difficulty}` : "";
  const response = await fetch(
    `${BASE_URL}/api/coding/problems/random${query}`,
    {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      text || `랜덤 문제를 불러오지 못했습니다. (status: ${response.status})`
    );
  }

  return await response.json();
};

/**
 * 코드 제출 & 채점
 */
export const submitCode = async ({ problemId, code, language, userId }) => {
  const accessToken = localStorage.getItem("accessToken");

  const payload = {
    problemId,
    sourceCode: code,
    language,
    userId: userId ?? 1,
  };

  const response = await fetch(`${BASE_URL}/api/coding/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      text || `채점 요청에 실패했습니다. (status: ${response.status})`
    );
  }

  return await response.json();
};
