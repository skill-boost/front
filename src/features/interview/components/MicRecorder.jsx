import { useEffect, useRef, useState } from "react";

/**
 * MicRecorder
 *
 * props:
 *  - running: boolean      // true면 자동 녹음 시작, false면 정지
 *  - onStop: ({ blob, durationSec }) => void
 *      => 녹음이 끝났을 때 한 번만 호출됨
 */
export default function MicRecorder({ running, onStop }) {
  const [recording, setRecording] = useState(false);
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const startAtRef = useRef(0);

  useEffect(() => {
    if (running && !recording) {
      start();
    }
    if (!running && recording) {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 브라우저마다 mimeType 지원이 다를 수 있어서 한번 체크
      const options = {};
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        options.mimeType = "audio/webm";
      }

      const mr = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const durationSec = Math.round(
          (performance.now() - startAtRef.current) / 1000
        );

        onStop?.({ blob, durationSec });

        // 마이크 리소스 해제
        stream.getTracks().forEach((t) => t.stop());
        mrRef.current = null;
      };

      mrRef.current = mr;
      startAtRef.current = performance.now();
      mr.start();
      setRecording(true);
    } catch (err) {
      console.error("마이크 접근 실패 또는 MediaRecorder 오류:", err);
      setRecording(false);
    }
  }

  function stop() {
    if (mrRef.current && mrRef.current.state === "recording") {
      mrRef.current.stop();
    }
    setRecording(false);
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block w-3 h-3 rounded-full ${
          recording ? "bg-red-500 animate-pulse" : "bg-slate-500"
        }`}
        title={recording ? "Recording" : "Idle"}
      />
      <span className="text-xs text-slate-300">
        {recording ? "Recording..." : "Idle"}
      </span>
    </div>
  );
}
