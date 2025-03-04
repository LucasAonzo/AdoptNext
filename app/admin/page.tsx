"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    adoptedPets: 0,
    pendingApplications: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get pets count
        const { count: totalPets } = await supabase
          .from("pets")
          .select("*", { count: "exact", head: true });

        // Get available pets count
        const { count: availablePets } = await supabase
          .from("pets")
          .select("*", { count: "exact", head: true })
          .eq("status", "available");

        // Get adopted pets count
        const { count: adoptedPets } = await supabase
          .from("pets")
          .select("*", { count: "exact", head: true })
          .eq("status", "adopted");

        // Get pending applications count
        const { count: pendingApplications } = await supabase
          .from("adoption_applications")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        // Get total users count
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        setStats({
          totalPets: totalPets || 0,
          availablePets: availablePets || 0,
          adoptedPets: adoptedPets || 0,
          pendingApplications: pendingApplications || 0,
          totalUsers: totalUsers || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!profile?.is_admin) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-adopt-gray-900 mb-4">Acceso Restringido</h1>
        <p className="text-adopt-gray-600 mb-6">No tienes permisos para acceder a esta sección.</p>
        <Link href="/">
          <Button variant="primary" size="lg-pill">
            Volver al inicio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-adopt-gray-900">Panel de Administración</h1>
        <Button
          variant="primary"
          size="lg-pill"
          onClick={() => window.location.href = "/admin/pets/new"}
        >
          Agregar Mascota
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="bg-white border-adopt-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-adopt-gray-500 text-sm font-medium">Mascotas Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-adopt-gray-900">
              {loading ? (
                <div className="h-6 w-16 bg-adopt-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.totalPets
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-adopt-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-adopt-gray-500 text-sm font-medium">Mascotas Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-adopt-purple-600">
              {loading ? (
                <div className="h-6 w-16 bg-adopt-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.availablePets
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-adopt-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-adopt-gray-500 text-sm font-medium">Mascotas Adoptadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {loading ? (
                <div className="h-6 w-16 bg-adopt-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.adoptedPets
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-adopt-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-adopt-gray-500 text-sm font-medium">Solicitudes Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {loading ? (
                <div className="h-6 w-16 bg-adopt-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.pendingApplications
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pets" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pets">Mascotas</TabsTrigger>
          <TabsTrigger value="applications">Solicitudes</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pets">
          <Card className="border-adopt-purple-100">
            <CardHeader>
              <CardTitle>Gestión de Mascotas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20">
                <p className="text-adopt-gray-500 mb-4">Aquí se mostrarán las mascotas para gestionar</p>
                <div className="space-x-4">
                  <Button variant="outline">Ver todas las mascotas</Button>
                  <Button variant="primary">Agregar mascota</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card className="border-adopt-purple-100">
            <CardHeader>
              <CardTitle>Gestión de Solicitudes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20">
                <p className="text-adopt-gray-500 mb-4">Aquí se mostrarán las solicitudes de adopción para revisar</p>
                <Button variant="outline">Ver todas las solicitudes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="border-adopt-purple-100">
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20">
                <p className="text-adopt-gray-500 mb-4">Total de usuarios registrados: {stats.totalUsers}</p>
                <Button variant="outline">Ver todos los usuarios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 