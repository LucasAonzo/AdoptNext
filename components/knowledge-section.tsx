import { createClient } from '@/lib/supabase-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface KnowledgeItem {
  title: string;
  description: string;
  imageUrl: string;
}

// Static knowledge items as a fallback
const fallbackKnowledgeItems: KnowledgeItem[] = [
  {
    title: 'Preparación para la adopción',
    description: 'Prepara tu hogar y familia para recibir una nueva mascota con estos consejos de los expertos.',
    imageUrl: '/images/pet-placeholder.jpg',
  },
  {
    title: 'Cuidados veterinarios',
    description: 'Aprende sobre los cuidados de salud esenciales para mantener a tu mascota feliz y saludable.',
    imageUrl: '/images/pet-placeholder.jpg',
  },
  {
    title: 'Educación y entrenamiento',
    description: 'Descubre métodos efectivos para entrenar a tu mascota y construir una relación basada en confianza.',
    imageUrl: '/images/pet-placeholder.jpg',
  },
];

async function getKnowledgeItems(): Promise<KnowledgeItem[]> {
  const supabase = await createClient();
  
  // Try to fetch from the database if we have a "knowledge_articles" table
  try {
    const { data, error } = await supabase
      .from('knowledge_articles')
      .select('*')
      .limit(3);
    
    if (error || !data || data.length === 0) {
      // If there's an error or no data, use fallback
      return fallbackKnowledgeItems;
    }
    
    // Map the database data to the KnowledgeItem interface
    return data.map(item => ({
      title: item.title,
      description: item.description,
      imageUrl: item.image_url || '/images/knowledge-placeholder.webp',
    }));
  } catch (error) {
    // If there's an error (e.g., table doesn't exist), use fallback
    return fallbackKnowledgeItems;
  }
}

export async function KnowledgeSection() {
  const knowledgeItems = await getKnowledgeItems();
  
  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Conocimiento de Mascotas</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Aprende todo lo que necesitas saber para cuidar de tu nueva mascota con nuestros recursos educativos.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeItems.map((item, index) => (
            <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

