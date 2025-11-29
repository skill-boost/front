import { useEffect, useState, useRef } from "react";

/**
 * ⏱️ 60초 카운트다운 타이머
 * props:
 *  - running: boolean (true = 시작/재시작, false = 정지)
 *  - onTimeout: () => void (0초 도달 시 1회 호출)
 */
export default function Timer60({ running, onTimeout }) {
  const [sec, setSec] = useState(60);
  const calledRef = useRef(false); // 타임아웃 중복 방지

  // running이 true가 될 때마다 타이머 리셋
  useEffect(() => {
    if (running) {
      setSec(60);
      calledRef.current = false;
    }
  }, [running]);

  // 카운트다운 기능
  useEffect(() => {
    if (!running) return;

    if (sec === 0) {
      if (!calledRef.current) {
        calledRef.current = true;
        onTimeout?.();
      }
      return;
    }

    const id = setTimeout(() => setSec((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [sec, running, onTimeout]);

  return (
    <div className="text-2xl font-semibold tabular-nums tracking-wider text-slate-100">
      {sec}s
    </div>
  );
}
