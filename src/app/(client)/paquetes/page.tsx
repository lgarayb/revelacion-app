import type { Metadata } from "next";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Package from "@/models/Package";
import { ArrowRight, Sparkles, CalendarCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://revelacion-app.vercel.app";

export const metadata: Metadata = {
  title: "Paquetes y Montajes de Revelación de Género | Revelación",
  description:
    "Explora nuestros paquetes de revelación de género, extintores de polvo holi, humo y montajes con reserva en línea y atención en sitio.",
  alternates: {
    canonical: `${SITE_URL}/paquetes`,
  },
  openGraph: {
    title: "Paquetes y Montajes | Revelación",
    description:
      "Montajes listos para tu evento con precios transparentes y reserva inmediata.",
    url: `${SITE_URL}/paquetes`,
    type: "website",
  },
};

interface ClientPackageItem {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  basePrice: number;
  depositPrice?: number;
  description?: string;
  featured?: boolean;
  media?: Array<{ url?: string; alt?: string }>;
  seo?: {
    h1?: string;
    h2?: string;
    metaDescription?: string;
  };
}

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default async function PaquetesCatalogoPage() {
  await dbConnect();

  const rawPackages = await Package.find({ isActive: true })
    .sort({ featured: -1, createdAt: -1 })
    .lean();

  const paquetes: ClientPackageItem[] = JSON.parse(JSON.stringify(rawPackages));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo de Paquetes de Revelación",
    url: `${SITE_URL}/paquetes`,
    numberOfItems: paquetes.length,
    itemListElement: paquetes.map((pkg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/paquetes/${pkg.slug}`,
      item: {
        "@type": "Product",
        name: pkg.seo?.h1 || pkg.name,
        description:
          pkg.seo?.metaDescription ||
          pkg.description ||
          `Paquete ${pkg.name} para revelación de género y eventos.`,
        image: pkg.media?.[0]?.url,
        offers: {
          "@type": "Offer",
          price: pkg.basePrice || 0,
          priceCurrency: "MXN",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/paquetes/${pkg.slug}`,
        },
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white py-14 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-10">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo Oficial
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Paquetes y Montajes para tu Revelación
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Elige el montaje ideal para tu evento, revisa los detalles del
            paquete y aparta tu fecha en minutos.
          </p>
        </header>

        {paquetes.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <p className="text-lg font-semibold text-white">
              Próximamente nuevos paquetes disponibles
            </p>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Estamos preparando nuestro catálogo actualizado de montajes y
              efectos especiales.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paquetes.map((pkg) => {
              const coverImage = pkg.media?.[0]?.url;
              const subtitle =
                pkg.seo?.h2 ||
                pkg.description ||
                "Montaje profesional con entrega y logística coordinada.";

              return (
                <article
                  key={pkg._id}
                  className="group bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="aspect-[16/10] bg-slate-950 border-b border-slate-800/80 relative overflow-hidden flex items-center justify-center">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={pkg.media?.[0]?.alt || pkg.seo?.h1 || pkg.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="px-6 text-center space-y-1">
                          <p className="text-xs uppercase tracking-widest text-amber-400/80 font-semibold">
                            {pkg.category || "Revelación"}
                          </p>
                          <p className="text-lg font-bold text-slate-200">
                            {pkg.name}
                          </p>
                        </div>
                      )}

                      {pkg.featured && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-600 text-white shadow">
                          Más elegido
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <h2 className="text-xl font-bold text-white">
                          {pkg.name}
                        </h2>
                        <span className="text-lg font-extrabold text-amber-400 shrink-0">
                          {formatMXN(pkg.basePrice)}
                        </span>
                      </div>

                      {typeof pkg.depositPrice === "number" &&
                        pkg.depositPrice > 0 && (
                          <p className="text-xs text-emerald-400 font-medium">
                            Aparta desde {formatMXN(pkg.depositPrice)} MXN
                          </p>
                        )}

                      <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                        {subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-3">
                    <Link
                      href={`/paquetes/${pkg.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Ver detalles
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/reservar/${pkg._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      Reservar
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}