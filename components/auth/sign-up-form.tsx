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

export function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 2. Insert the user profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          is_admin: false,
        });

        if (profileError) throw profileError;
      }

      setSuccess(true);
      // Don't redirect immediately, show success message first
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 3000);

    } catch (error: any) {
      setError(error.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto border-adopt-purple-100 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-adopt-gray-900">
            ¡Registro exitoso!
          </CardTitle>
          <CardDescription className="text-center text-adopt-gray-600">
            Por favor revisa tu correo electrónico para confirmar tu cuenta. Serás redirigido a la página de inicio de sesión.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => router.push("/auth/sign-in")} 
            className="mt-4"
          >
            Ir a Iniciar Sesión
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-adopt-purple-100 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-adopt-gray-900">
          Crear Cuenta
        </CardTitle>
        <CardDescription className="text-center text-adopt-gray-600">
          Regístrate para adoptar una mascota
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">Nombre</Label>
              <Input
                id="first-name"
                placeholder="María"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border-adopt-purple-200 focus:border-adopt-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Apellido</Label>
              <Input
                id="last-name"
                placeholder="García"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border-adopt-purple-200 focus:border-adopt-purple-400"
              />
            </div>
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-adopt-purple-200 focus:border-adopt-purple-400"
              minLength={8}
            />
            <p className="text-xs text-adopt-gray-500">
              Mínimo 8 caracteres
            </p>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg-pill"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-adopt-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/sign-in"
            className="text-adopt-purple-600 hover:text-adopt-purple-700 font-medium"
          >
            Iniciar Sesión
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
} 