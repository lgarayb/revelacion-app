import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(req: Request) {
  try {
    const { packageId } = await req.json();

    await dbConnect();
    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return NextResponse.json({ error: 'Paquete no encontrado' }, { status: 404 });
    }

    // Calcula el anticipo (50% del precio base)
    const advanceAmount = Math.round(pkg.basePrice * 0.5 * 100); // Stripe requiere el monto en centavos

    const paymentIntent = await stripe.paymentIntents.create({
      amount: advanceAmount,
      currency: 'mxn',
      payment_method_types: ['card', 'oxxo'], // Opciones de pago que ofreces
      metadata: {
        packageId: pkg._id.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error al crear PaymentIntent:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}