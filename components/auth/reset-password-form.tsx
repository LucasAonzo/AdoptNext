"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada.",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Error al intentar enviar el enlace de recuperación",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-adopt-purple-100 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-adopt-gray-900">
          Recuperar Contraseña
        </CardTitle>
        <CardDescription className="text-center text-adopt-gray-600">
          Te enviaremos un enlace para restablecer tu contraseña
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div
            className={`p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-adopt-purple-200 focus:border-adopt-purple-400"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg-pill"
            className="w-full"
            disabled={loading || message?.type === "success"}
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-adopt-gray-600">
          ¿Recordaste tu contraseña?{" "}
          <Link
            href="/auth/sign-in"
            className="text-adopt-purple-600 hover:text-adopt-purple-700 font-medium"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
} 