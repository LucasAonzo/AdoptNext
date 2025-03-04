import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualizar Contraseña | AdoptMe",
  description: "Actualiza tu contraseña para tu cuenta de AdoptMe",
};

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-adopt-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <UpdatePasswordForm />
      </div>
    </div>
  );
} 