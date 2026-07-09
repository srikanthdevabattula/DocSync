import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | DocSync",
  description: "Create your DocSync account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
