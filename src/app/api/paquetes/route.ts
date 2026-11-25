import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // Retorna solo paquetes activos, ordenados por fecha de creación
    const paquetes = await Package.find({ isActive: true }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: paquetes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // El modelo Package de Mongoose validará que vengan los campos SEO y el Slug
    const nuevoPaquete = await Package.create(body);
    
    return NextResponse.json({ success: true, data: nuevoPaquete }, { status: 201 });
  } catch (error: any) {
    // Manejo de error si el slug ya existe (código 11000 en MongoDB)
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'El slug ya existe. Elige uno diferente para SEO.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}