import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Solo nos interesa cuando el pago se concreta
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { packageId } = paymentIntent.metadata;

      await dbConnect();
      
      // Buscar la reserva asociada a este PaymentIntent y actualizarla
      const booking = await Booking.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { 
          paymentStatus: 'anticipo_pagado',
          paymentProvider: 'stripe'
        },
        { new: true }
      );

      if (booking) {
        console.log(`✅ Pago procesado para reserva: ${booking._id}`);
        // Aquí mandaríamos a llamar a Brevo para enviar el PDF de confirmación
        // y generar el token secreto para el doctor.
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}