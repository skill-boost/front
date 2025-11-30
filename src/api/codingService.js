const BASE_URL =
  import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "") // 끝에 / 제거
    : "/api";

/**
 * 난이도에 따라 랜덤 코딩 문제를 가져옵니다.
 *
 * @param {"EASY"|"MEDIUM"|"HARD"|undefined} difficulty
 * @returns {Promise<object>} - { id, title, description, difficulty, tags, samples: [...] }
 */
export const fetchRandomProblem = async (difficulty) => {
  const query = difficulty ? `?difficulty=${difficulty}` : "";
  const response = await fetch(`${BASE_URL}/coding/problems/random${query}`);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `랜덤 문제를 불러오지 못했습니다. (status: ${response.status})`);
  }

  return await response.json();
};

/**
 * 코드를 백엔드로 제출하여 전체 테스트 케이스로 채점합니다.
 *
 * @param {object} params
 * @param {number} params.problemId
 * @param {string} params.code
 * @param {string} params.language
 * @param {string} [params.userId]
 * @returns {Promise<object>}
 */
export const submitCode = async ({ problemId, code, language, userId }) => {
  const payload = {
    problemId,
    sourceCode: code,
    language,
    userId: userId ?? "guest",
  };

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
