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
import { useRouter } from "next/navigation";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      // Redirect to login page with success parameter
      router.push("/auth/sign-in?passwordUpdated=true");
    } catch (error: any) {
      setError(error.message || "Error al actualizar la contraseña");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-adopt-purple-100 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-adopt-gray-900">
          Crear nueva contraseña
        </CardTitle>
        <CardDescription className="text-center text-adopt-gray-600">
          Por favor ingresa y confirma tu nueva contraseña
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border-adopt-purple-200 focus:border-adopt-purple-400"
              minLength={8}
            />
            <p className="text-xs text-adopt-gray-500">
              Mínimo 8 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border-adopt-purple-200 focus:border-adopt-purple-400"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg-pill"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-adopt-gray-600">
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