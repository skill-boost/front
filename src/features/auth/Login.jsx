import GithubLoginButton from "./GithubLoginButton";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D1117] text-white p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="flex flex-col items-center mb-8 text-center space-y-4">
            <svg
              height="48"
              viewBox="0 0 16 16"
              version="1.1"
              width="48"
              aria-hidden="true"
              className="fill-white/90"
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Master Your Code
              </h1>
              <p className="mt-2 text-sm text-[#8B949E]">
                AI-powered code reviews, mock interviews,<br />and technical testing.
              </p>
            </div>
          </div>

          <div className="w-full">
            <GithubLoginButton />
          </div>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[#30363D]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#161B22] text-[#8B949E] text-xs uppercase tracking-wide">
                Developer Focused
              </span>
            </div>
          </div>
        </div>

        {/* 링크 제거 및 단순 카피라이트 텍스트 */}
        <p className="mt-8 text-center text-xs text-[#484F58]">
          © 2025 SkillBoost. All rights reserved.
        </p>

      </div>
    </div>
  );
}