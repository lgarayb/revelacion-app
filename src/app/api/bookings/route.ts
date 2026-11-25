import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';
import Booking from '@/models/Booking';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { packageId, clientInfo, eventDate } = body;

    // 1. Validar que el paquete existe
    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) {
      return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 });
    }

    // 2. Calcular los montos reales
    const totalAmount = selectedPackage.basePrice;
    const advanceAmount = Math.round(totalAmount / 2);

    // 3. Crear la reserva en estado "pendiente"
    const newBooking = await Booking.create({
      packageId,
      clientInfo,
      eventDate: new Date(eventDate),
      totalAmount,
      advanceAmount,
      paymentStatus: 'pendiente',
      eventStatus: 'agendado'
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: newBooking._id,
      advanceAmount 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creando reserva:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}