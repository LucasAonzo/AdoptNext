import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddPetForm from "@/components/admin/add-pet-form";
import { PetCategory } from "@/types/database";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Añadir Mascota | Admin AdoptMe",
  description: "Formulario para añadir una nueva mascota al sistema.",
};

export const revalidate = 0; // Dynamic route - do not cache

async function getPetCategories() {
  const supabase = await createClient();
  
  // Check if user is authenticated and is admin
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/auth/signin?redirect=/admin/pets/add");
  }
  
  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  
  if (profileError || !profile || !profile.is_admin) {
    return redirect("/");
  }
  
  // Get pet categories
  const { data: categories, error } = await supabase
    .from("pet_categories")
    .select("*")
    .order("name");
  
  if (error) {
    console.error("Error fetching pet categories:", error);
    return [];
  }
  
  return categories || [];
}

export default async function AddPetPage() {
  const categories = await getPetCategories();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-adopt-gray-900">Añadir Nueva Mascota</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/pets">
            Volver a la lista
          </Link>
        </Button>
      </div>
      
      <AddPetForm categories={categories} />
    </div>
  );
} 