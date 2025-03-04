import { SignInForm } from "@/components/auth/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | AdoptMe",
  description: "Inicia sesión en tu cuenta de AdoptMe para comenzar a adoptar",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-adopt-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
} 