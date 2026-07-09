import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | DocSync",
  description: "Sign in to your DocSync account",
};

export default function LoginPage() {
  return <LoginForm />;
}
