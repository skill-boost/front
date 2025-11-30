import GithubLoginButton from "./GithubLoginButton";

export default function Login() {
  return (
    <div className="bg-app min-h-screen flex items-center justify-center p-4">
      <div className="gcard max-w-md w-full">
        <div className="ginner glass-sheen p-6 space-y-4">
          <div className="gheader text-base">Sign in</div>
          <GithubLoginButton />
        </div>
      </div>
    </div>
  );
}
