"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, profile, loading, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const supabase = createClient();
  const router = useRouter();
  
  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-adopt-purple-500 border-adopt-gray-200 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-adopt-gray-600">Cargando tu perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      await refreshUser();
      setUpdateMessage({ type: "success", text: "Perfil actualizado con éxito" });
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
    } catch (error: any) {
      setUpdateMessage({ type: "error", text: error.message || "Error al actualizar el perfil" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-adopt-gray-900 mb-8">Mi Perfil</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="favorites">Mis Favoritos</TabsTrigger>
              <TabsTrigger value="applications">Mis Solicitudes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información de contacto y datos personales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {updateMessage && (
                    <div 
                      className={`p-3 mb-4 rounded-md ${
                        updateMessage.type === "success" 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {updateMessage.text}
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="border-adopt-purple-200 focus:border-adopt-purple-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="border-adopt-purple-200 focus:border-adopt-purple-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-adopt-gray-50 border-adopt-gray-200"
                      />
                      <p className="text-xs text-adopt-gray-500">
                        El correo electrónico no se puede cambiar
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border-adopt-purple-200 focus:border-adopt-purple-400"
                        placeholder="612 345 678"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border-adopt-purple-200 focus:border-adopt-purple-400"
                        placeholder="Calle, número, ciudad, código postal"
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg-pill"
                      className="mt-2"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Actualizando..." : "Guardar cambios"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Favoritos</CardTitle>
                  <CardDescription>
                    Mascotas que has marcado como favoritas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-adopt-gray-600">
                    <p>No tienes mascotas favoritas todavía.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => router.push('/pets')}
                    >
                      Explorar mascotas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Solicitudes de Adopción</CardTitle>
                  <CardDescription>
                    Seguimiento de tus solicitudes de adopción
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-adopt-gray-600">
                    <p>No tienes solicitudes de adopción activas.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => router.push('/pets')}
                    >
                      Adoptar una mascota
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Cuenta</CardTitle>
              <CardDescription>
                Gestiona los detalles de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-adopt-gray-900">Detalles de usuario</h3>
                <p className="text-sm text-adopt-gray-600 mt-1">
                  Miembro desde {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString() 
                    : "hace poco"}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-adopt-gray-900">Cambiar contraseña</h3>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => router.push('/auth/reset-password')}
                >
                  Cambiar contraseña
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full"
              >
                Cerrar sesión
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}