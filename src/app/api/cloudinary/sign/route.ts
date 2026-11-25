import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado para firmar subidas multimedia" },
        { status: 401 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Faltan variables de entorno de Cloudinary en el servidor" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const paramsToSign = body?.paramsToSign;

    if (!paramsToSign || typeof paramsToSign !== "object" || Array.isArray(paramsToSign)) {
      return NextResponse.json(
        { error: "paramsToSign inválido" },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      signature,
      apiKey,
      cloudName,
    });
  } catch (error: any) {
    console.error("POST /api/cloudinary/sign error:", error);
    return NextResponse.json(
      { error: error?.message || "Error al generar firma de Cloudinary" },
      { status: 500 }
    );
  }
}