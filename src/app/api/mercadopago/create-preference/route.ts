import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

// Configura el cliente de MP
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { packageId, clientEmail } = body;

    // Validación estricta del precio desde la base de datos
    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) {
      return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 });
    }

    // Calcular el anticipo (50%)
    const advanceAmount = Math.round(selectedPackage.basePrice / 2);

    // Crear la Preferencia
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: packageId,
            title: `Anticipo de Reserva (50%) - ${selectedPackage.name}`,
            quantity: 1,
            unit_price: advanceAmount,
            currency_id: 'MXN'
          }
        ],
        payer: {
          email: clientEmail
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_URL}/paquetes`,
          pending: `${process.env.NEXT_PUBLIC_URL}/reservar/${packageId}/pago`
        },
        auto_return: 'approved',
        statement_descriptor: 'REVELACION MX',
      }
    });

    // Retornamos el init_point (URL donde el cliente va a pagar)
    return NextResponse.json({ id: result.id, init_point: result.init_point });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}