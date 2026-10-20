/**
 * AuthShell — the login/sign-up layout from the design:
 * intro panel on the left, form on the right.
 */
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/LogoMark";

const HIGHLIGHTS = [
  { value: "5", label: "exercises tracked" },
  { value: "33", label: "body landmarks" },
  { value: "Live", label: "voice feedback" },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap">
      {/* Left: intro */}
      <section className="flex min-w-0 flex-[1_1_520px] flex-col justify-between gap-12 border-r border-line bg-[#141619] px-8 py-12 lg:px-16">
        <div className="flex items-center gap-3">
          <LogoMark size={40} />
          <span className="font-display text-xl font-bold">AI Coach</span>
        </div>

        <div className="flex max-w-lg flex-col gap-5">
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight lg:text-6xl">
            Your camera is now your personal trainer.
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Real-time form tracking, automatic rep counting and a voice coach that corrects you mid-set.
          </p>
        </div>

        <div className="grid max-w-xl grid-cols-3 gap-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="font-display text-3xl font-bold text-accent">{item.value}</span>
              <span className="text-sm text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Right: the form */}
      <section className="flex min-w-0 flex-[1_1_480px] items-center justify-center px-8 py-12 lg:px-16">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  );
}
