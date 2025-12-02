// src/api/codingService.js

/**
 * Vite 프록시 설정을 통해 백엔드(Spring) API 서버와 통신합니다.
 * vite.config.js에서 '/api' → http://localhost:8080 같은 식으로 프록시된다고 가정합니다.
 */
const BASE_URL = "http://52.79.181.115:30000/api";

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
 * (Spring의 /api/coding/submissions 엔드포인트 호출)
 *
 * @param {object} params
 * @param {number} params.problemId - 문제 ID
 * @param {string} params.code      - 사용자 코드
 * @param {string} params.language  - 언어 ("python" | "java" | "cpp" ...)
 * @param {string} [params.userId]  - 사용자 식별자 (없으면 "guest")
 * @returns {Promise<object>} - { submissionId, status, score, passedCount, totalCount, message }
 */
export const submitCode = async ({ problemId, code, language, userId }) => {
  const payload = {
  problemId,
    sourceCode: code,
    language,
    userId: userId ?? "guest"
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

/**
 * (선택) 코드 실행(run) 기능을 나중에 붙이고 싶다면 여기에 구현할 수 있습니다.
 * 현재 Spring 백엔드에는 /coding/run 같은 엔드포인트가 없어서 기본적으로는 사용하지 않습니다.
 */
// export const runCode = async (code, language, inputData) => {
//   // TODO: 나중에 Judge0/Piston 실행용 엔드포인트 만들면 여기에 연결
// };
