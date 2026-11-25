import Link from 'next/link';
import { Check } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export default async function CatalogoPaquetesPage() {
  await dbConnect();
  // Traemos los paquetes activos desde MongoDB
  const paquetes = await Package.find({ isActive: true }).sort({ basePrice: 1 });

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Catálogo de Experiencias
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Selecciona el nivel de impacto para tu revelación. Todos los paquetes incluyen la logística secreta con tu médico.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {paquetes.map((pkg) => (
            <div key={pkg._id.toString()} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl transition-shadow">
              {/* Espacio para imagen de Cloudinary */}
              <div className="h-48 bg-slate-200 relative">
                {pkg.media && pkg.media[0] && (
                  <img 
                    src={pkg.media[0].url} 
                    alt={pkg.media[0].altText}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                  {pkg.name}
                </h3>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-3xl font-black text-slate-900">
                    ${pkg.basePrice.toLocaleString('es-MX')}
                  </span>
                  <span className="text-slate-500 font-medium"> MXN</span>
                </div>
                
                <p className="text-slate-600 mb-6 flex-1">
                  {pkg.description}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Link secreto para el médico</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Montaje a domicilio (CDMX)</span>
                  </div>
                </div>

                <Link 
                  href={`/reservar/${pkg._id}/pago`}
                  className="w-full block text-center py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                >
                  Agendar con 50%
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}