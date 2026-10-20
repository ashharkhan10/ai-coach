/**
 * CameraView — shows the webcam with the skeleton drawn on top.
 *
 * The <video> shows the camera. The <canvas> sits exactly on top of it
 * and is where the skeleton is drawn. Both are mirrored so it feels
 * like looking in a mirror.
 *
 * Anything passed as children (like the rest timer) appears over the camera.
 */
"use client";

import type { ReactNode, RefObject } from "react";
import type { CameraStatus } from "@/hooks/useCamera";
import type { TrackingStatus } from "@/hooks/usePoseTracking";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cameraStatus: CameraStatus;
  trackingStatus: TrackingStatus;
  formStatus?: string;
  hasIssue?: boolean;
  children?: ReactNode;
};

export function CameraView({
  videoRef,
  canvasRef,
  cameraStatus,
  trackingStatus,
  formStatus,
  hasIssue,
  children,
}: Props) {
  const showFormBadge = formStatus && trackingStatus === "tracking";

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-line bg-[#15171A]">
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
      />

      {/* Top-left badges */}
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        {showFormBadge && (
          <span
            className={`rounded-lg bg-ground/80 px-3 py-2 text-sm font-semibold ${
              hasIssue ? "text-warn" : "text-accent"
            }`}
          >
            {formStatus}
          </span>
        )}
        <span className="rounded-lg bg-ground/80 px-3 py-2 text-sm text-muted">
          {getStatusMessage(cameraStatus, trackingStatus)}
        </span>
      </div>

      {children}
    </div>
  );
}

function getStatusMessage(camera: CameraStatus, tracking: TrackingStatus): string {
  if (camera === "starting") return "Starting camera…";
  if (camera === "error") return "Camera blocked — allow camera access and reload";
  if (tracking === "loading") return "Loading pose model…";
  if (tracking === "error") return "Pose model failed to load";
  if (tracking === "no-pose") return "No body found — step back into the frame";
  return "Tracking";
}
