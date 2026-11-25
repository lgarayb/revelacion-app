import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Package from "@/models/Package";
import { ArrowLeft, CalendarCheck, CheckCircle2, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://revelacion-app.vercel.app";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface PackageDetail {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  basePrice: number;
  depositPrice?: number;
  durationHours?: number;
  maxGuests?: number;
  shortDescription?: string;
  description?: string;
  highlights?: string[];
  featured?: boolean;
  media?: Array<{ url?: string; alt?: string }>;
  seo?: {
    h1?: string;
    h2?: string;
    metaDescription?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
}

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

async function getPackageBySlug(slug: string): Promise<PackageDetail | null> {
  await dbConnect();
  const doc = await Package.findOne({ slug, isActive: true }).lean();
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    return {
      title: "Paquete no encontrado | Revelación",
      description: "El paquete solicitado no está disponible actualmente.",
    };
  }

  const title = pkg.seo?.h1 || pkg.seoTitle || `${pkg.name} | Revelación`;
  const description =
    pkg.seo?.metaDescription ||
    pkg.seoDescription ||
    pkg.shortDescription ||
    pkg.description ||
    `Conoce los detalles y reserva ${pkg.name} para tu evento.`;

  const canonicalUrl = `${SITE_URL}/paquetes/${pkg.slug}`;
  const imageUrl = pkg.media?.[0]?.url;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      ...(imageUrl ? { images: [{ url: imageUrl, alt: pkg.media?.[0]?.alt || title }] } : {}),
    },
  };
}

export default async function PaqueteDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const h1Text = pkg.seo?.h1 || pkg.name;
  const h2Text = pkg.seo?.h2 || `Montaje ${pkg.category || "Revelación"}`;
  const coverImage = pkg.media?.[0]?.url;
  const pageUrl = `${SITE_URL}/paquetes/${pkg.slug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: h1Text,
    description:
      pkg.seo?.metaDescription ||
      pkg.description ||
      `Paquete ${pkg.name} disponible para reserva.`,
    image: coverImage ? [coverImage] : undefined,
    category: pkg.category || "Eventos de Revelación",
    brand: {
      "@type": "Brand",
      name: "Revelación",
    },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "MXN",
      price: pkg.basePrice || 0,
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Paquetes",
        item: `${SITE_URL}/paquetes`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pkg.name,
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/paquetes"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo de paquetes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna visual y contenido SEO */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[16/10] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={pkg.media?.[0]?.alt || h1Text}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="px-6 text-center space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    {pkg.category || "Revelación"}
                  </span>
                  <p className="text-2xl font-bold text-white">{pkg.name}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                {h2Text}
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {h1Text}
              </h1>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {pkg.description ||
                  pkg.shortDescription ||
                  "Montaje profesional coordinado para tu celebración."}
              </p>
            </div>

            {Array.isArray(pkg.highlights) && pkg.highlights.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h2 className="text-base font-bold text-white">
                  Lo que incluye este montaje
                </h2>
                <ul className="space-y-2 text-sm text-slate-300">
                  {pkg.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tarjeta de reserva */}
          <aside className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Paquete: {pkg.name}
              </span>
              <div className="text-3xl font-extrabold text-white">
                {formatMXN(pkg.basePrice)}{" "}
                <span className="text-sm font-normal text-slate-400">MXN</span>
              </div>
              {typeof pkg.depositPrice === "number" && pkg.depositPrice > 0 && (
                <p className="text-sm text-emerald-400 font-medium">
                  Aparta tu fecha con {formatMXN(pkg.depositPrice)} MXN
                </p>
              )}
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-400">
              {pkg.durationHours ? (
                <p>Duración estimada: {pkg.durationHours} hrs</p>
              ) : null}
              {pkg.maxGuests ? (
                <p>Capacidad sugerida: hasta {pkg.maxGuests} invitados</p>
              ) : null}
              <p>Confirmación de fecha y logística coordinada al reservar.</p>
            </div>

            <Link
              href={`/reservar/${pkg._id}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition-colors"
            >
              <CalendarCheck className="w-4 h-4" />
              Reservar este paquete
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}