/**
 * useCamera — turns on the webcam and shows it in a <video> element.
 *
 * Returns:
 *   videoRef → attach to <video ref={videoRef} />
 *   status   → "starting" | "ready" | "error"
 */
"use client";

import { useEffect, useRef, useState } from "react";

export type CameraStatus = "starting" | "ready" | "error";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>("starting");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
          audio: false,
        });

        // The page may have closed while we were waiting.
        if (cancelled) return;

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();
        setStatus("ready");
      } catch (error) {
        console.error("Camera error:", error);
        if (!cancelled) setStatus("error");
      }
    }

    startCamera();

    // When the page closes, turn the camera off.
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { videoRef, status };
}
