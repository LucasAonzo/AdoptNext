'use client';

import { Check, Info } from 'lucide-react';

interface AdoptionStepsProps {
  currentStep?: number;
}

export default function AdoptionSteps({ currentStep = 0 }: AdoptionStepsProps) {
  const steps = [
    {
      title: 'Conoce a la mascota',
      description: 'Lee toda la información sobre la mascota para asegurarte de que es compatible con tu estilo de vida.',
    },
    {
      title: 'Solicitud de adopción',
      description: 'Completa el formulario de solicitud con tus datos personales y referencias.',
    },
    {
      title: 'Entrevista y verificación',
      description: 'Participa en una entrevista con nuestro equipo y permite que verifiquemos tus referencias.',
    },
    {
      title: 'Visita tu hogar',
      description: 'Permitimos una visita a tu hogar para asegurar que es un ambiente adecuado para la mascota.',
    },
    {
      title: 'Conoce a tu mascota',
      description: 'Visita a la mascota para asegurar que hay una buena conexión entre ambos.',
    },
    {
      title: 'Adopción finalizada',
      description: 'Firma el contrato de adopción, realiza el pago de la tarifa y lleva a tu nueva mascota a casa.',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Info className="h-5 w-5 text-adopt-purple-600" />
        <h2 className="text-xl font-bold text-adopt-gray-900">Proceso de adopción</h2>
      </div>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute left-[15px] top-[30px] bottom-0 w-0.5 ${
                  index < currentStep ? 'bg-adopt-purple-600' : 'bg-adopt-gray-200'
                }`}
              />
            )}
            
            <div className="flex items-start">
              {/* Step indicator */}
              <div 
                className={`
                  relative z-10 flex items-center justify-center w-[30px] h-[30px] rounded-full mr-4 flex-shrink-0
                  ${index < currentStep 
                    ? 'bg-adopt-purple-600 text-white' 
                    : index === currentStep 
                      ? 'bg-adopt-purple-100 text-adopt-purple-600 ring-2 ring-adopt-purple-600 ring-offset-2' 
                      : 'bg-adopt-gray-100 text-adopt-gray-500'
                  }
                `}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Step content */}
              <div className={`pt-1 ${index < currentStep ? 'opacity-75' : ''}`}>
                <h3 className={`font-medium ${
                  index === currentStep ? 'text-adopt-purple-600' : 'text-adopt-gray-900'
                }`}>
                  {step.title}
                </h3>
                <p className="text-sm text-adopt-gray-600 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-adopt-gray-200">
        <p className="text-sm text-adopt-gray-600">
          <span className="font-medium">Nota:</span> El proceso puede variar 
          ligeramente dependiendo de la mascota y las circunstancias específicas. 
          Nuestro objetivo es asegurar que cada mascota encuentre el hogar perfecto.
        </p>
      </div>
    </div>
  );
} 