/**
 * Sign up page — http://localhost:3000/signup
 */
import { AuthShell } from "@/components/auth/AuthShell";
import { RedirectIfSignedIn } from "@/components/auth/RedirectIfSignedIn";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <RedirectIfSignedIn>
      <AuthShell>
        <SignupForm />
      </AuthShell>
    </RedirectIfSignedIn>
  );
}
