import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { packageId, addons } = await req.json();

    // 1. Validar el paquete directamente en la base de datos (evita que hackeen el precio en el frontend)
    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) {
      return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 });
    }

    // 2. Calcular el total real
    let totalAmount = selectedPackage.basePrice;
    if (addons && addons.length > 0) {
      addons.forEach((addon: any) => {
        totalAmount += addon.price;
      });
    }

    // 3. El anticipo para agendar es del 50%
    const advanceAmount = Math.round(totalAmount / 2);

    // 4. Crear el intento de pago en Stripe (en centavos para MXN)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: advanceAmount * 100,
      currency: 'mxn',
      payment_method_types: ['card'],
      description: `Anticipo (50%) - ${selectedPackage.name}`,
      metadata: {
        packageId: packageId,
        isAdvance: 'true',
        fullAmount: totalAmount
      }
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      advanceAmount: advanceAmount,
      totalAmount: totalAmount
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}