/**
 * Login page — http://localhost:3000/login
 */
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { RedirectIfSignedIn } from "@/components/auth/RedirectIfSignedIn";

export default function LoginPage() {
  return (
    <RedirectIfSignedIn>
      <AuthShell>
        <LoginForm />
      </AuthShell>
    </RedirectIfSignedIn>
  );
}
