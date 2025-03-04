import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | AdoptMe",
  description: "Restablece tu contraseña para acceder a tu cuenta de AdoptMe",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-adopt-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
} 