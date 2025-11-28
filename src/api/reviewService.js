// src/api/reviewService.js

// 중요: 백엔드 주소를 정확하게 입력 (Proxy 설정이 없다면 전체 주소 필수)
const BASE_URL = "http://localhost:8080/api";

export const fetchCodeReview = async (code, comment) => {
  // 1. 데이터 객체 생성
  const payload = {
    code: code,
    comment: comment && comment.trim() ? comment.trim() : null,
  };

  try {
    // 2. fetch 요청 (JSON 모드)
    const res = await fetch(`${BASE_URL}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 나 JSON 보낸다고 알려줌
      },
      body: JSON.stringify(payload), // 객체를 문자열로 변환
    });

    // 3. 에러 처리
    const raw = await res.text();
    
    if (!res.ok) {
      // 서버가 에러 응답을 준 경우
      let errMsg = raw;
      try {
        const json = JSON.parse(raw);
        errMsg = json.message || json.error || json.detail || raw;
      } catch {
        // JSON 파싱 실패 시 raw text 사용
      }
      throw new Error(errMsg || `요청 실패 (${res.status})`);
    }

    if (!raw) return {};
    
    // 정상 응답 파싱
    try {
      return JSON.parse(raw);
    } catch {
      return { review: raw, questions: [] };
    }

  } catch (error) {
    console.error("API 요청 실패:", error);
    // "Failed to fetch"는 보통 서버가 꺼져있거나 주소가 틀렸을 때 발생
    if (error.message === "Failed to fetch") {
        throw new Error("서버에 연결할 수 없습니다. 백엔드 서버가 켜져 있는지 확인해주세요.");
    }
    throw error;
  }
};