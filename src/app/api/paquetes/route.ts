import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Package from "@/models/Package";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";
    const featuredOnly = searchParams.get("featured") === "true";
    const category = searchParams.get("category")?.trim();

    const filter: Record<string, any> = {};

    if (!includeInactive) {
      filter.isActive = true;
    }

    if (featuredOnly) {
      filter.featured = true;
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    const paquetes = await Package.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, data: paquetes },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/paquetes error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Error al obtener paquetes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado para crear paquetes" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();

    const rawSeo = body?.seo && typeof body.seo === "object" ? body.seo : {};
    const seoH1 = typeof rawSeo.h1 === "string" ? rawSeo.h1.trim() : undefined;
    const seoH2 = typeof rawSeo.h2 === "string" ? rawSeo.h2.trim() : undefined;
    const seoMetaDescription =
      typeof rawSeo.metaDescription === "string"
        ? rawSeo.metaDescription.trim()
        : undefined;

    const payload = {
      name: typeof body.name === "string" ? body.name.trim() : "",
      slug:
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug.trim().toLowerCase()
          : undefined,
      category:
        typeof body.category === "string" && body.category.trim()
          ? body.category.trim()
          : "Eventos",
      basePrice: Number(body.basePrice),
      depositPrice:
        body.depositPrice !== undefined &&
        body.depositPrice !== "" &&
        !Number.isNaN(Number(body.depositPrice))
          ? Number(body.depositPrice)
          : undefined,
      durationHours:
        body.durationHours !== undefined &&
        body.durationHours !== "" &&
        !Number.isNaN(Number(body.durationHours))
          ? Number(body.durationHours)
          : undefined,
      maxGuests:
        body.maxGuests !== undefined &&
        body.maxGuests !== "" &&
        !Number.isNaN(Number(body.maxGuests))
          ? Number(body.maxGuests)
          : undefined,
      shortDescription:
        typeof body.shortDescription === "string"
          ? body.shortDescription.trim()
          : undefined,
      description:
        typeof body.description === "string" ? body.description.trim() : "",
      highlights: Array.isArray(body.highlights)
        ? body.highlights.map((h: any) => String(h).trim()).filter(Boolean)
        : [],
      media: Array.isArray(body.media)
        ? body.media
            .map((m: any) =>
              typeof m === "string"
                ? { url: m.trim(), type: "image" }
                : {
                    url: String(m?.url || "").trim(),
                    publicId: m?.publicId ? String(m.publicId).trim() : undefined,
                    alt: m?.alt ? String(m.alt).trim() : undefined,
                    type: m?.type === "video" ? "video" : "image",
                  }
            )
            .filter((m: any) => Boolean(m.url))
        : [],
      seo: {
        h1: seoH1,
        h2: seoH2,
        metaDescription: seoMetaDescription,
      },
      seoTitle:
        typeof body.seoTitle === "string" && body.seoTitle.trim()
          ? body.seoTitle.trim()
          : seoH1,
      seoDescription:
        typeof body.seoDescription === "string" && body.seoDescription.trim()
          ? body.seoDescription.trim()
          : seoMetaDescription,
      featured: Boolean(body.featured),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    };

    if (!payload.name || Number.isNaN(payload.basePrice)) {
      return NextResponse.json(
        {
          success: false,
          error: "Nombre y precio base válido son obligatorios",
        },
        { status: 400 }
      );
    }

    const nuevoPaquete = await Package.create(payload);

    return NextResponse.json(
      { success: true, data: nuevoPaquete },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "El slug ya existe. Elige uno diferente para SEO.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error?.message || "Error al crear paquete" },
      { status: 400 }
    );
  }
}