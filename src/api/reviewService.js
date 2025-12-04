const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCodeReview = async (code, comment, repoUrl) => {
  const accessToken = localStorage.getItem("accessToken");

  // 🔹 백엔드가 @RequestParam("code", "comment", "repo_url", "branch") 를 받으니까
  //    JSON 대신 FormData로 보내주자.
  const formData = new FormData();
  formData.append("code", code); // 필수

  if (comment && comment.trim()) {
    formData.append("comment", comment.trim());
  }

  if (repoUrl && repoUrl.trim()) {
    // 백엔드는 "repo_url" 이라는 이름으로 받음!!
    formData.append("repo_url", repoUrl.trim());
  }

  // branch는 안 보내도 defaultValue = "main" 이지만, 명시적으로 보내줄게
  formData.append("branch", "main");

  try {
    const res = await fetch(`${BASE_URL}/api/review`, {
      method: "POST",
      headers: {
        // ⚠️ FormData 쓸 때는 Content-Type 직접 쓰지 말기!
        // 브라우저가 boundary 포함해서 자동으로 넣어줌.
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: formData,
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