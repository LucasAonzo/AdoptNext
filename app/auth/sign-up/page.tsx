import { SignUpForm } from "@/components/auth/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Cuenta | AdoptMe",
  description: "Crea una cuenta en AdoptMe para comenzar a adoptar",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-adopt-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
} 