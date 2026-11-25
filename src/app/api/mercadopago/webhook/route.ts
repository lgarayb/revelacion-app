import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("data.id") || url.searchParams.get("id");
    const type = url.searchParams.get("type");

    // Solo reaccionamos si el evento es un pago finalizado
    if (type === "payment" && id) {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id });

      if (paymentData.status === "approved") {
        await dbConnect();
        
        // MercadoPago guarda el Item ID que mandamos (el packageId)
        const packageId = paymentData.additional_info?.items?.[0]?.id;

        if (packageId) {
          // Buscamos la reserva pendiente que coincida y la actualizamos
          // En un flujo real, buscarías por un bookingId específico
          const booking = await Booking.findOneAndUpdate(
            { packageId: packageId, paymentStatus: 'pendiente' },
            { 
              paymentStatus: 'anticipo_pagado',
              paymentProvider: 'mercadopago',
              paymentIntentId: id
            },
            { new: true }
          );

          if (booking) {
            console.log(`✅ MP Pago aprobado para reserva: ${booking._id}`);
            // Disparar Brevo y Google Calendar
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error en Webhook MercadoPago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}