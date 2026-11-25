import { NextResponse } from 'next/server';
import { getGroqChatCompletion } from '@/lib/groq';

const EVOLUTION_URL = process.env.EVOLUTION_API_URL!;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY!;
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || "revelacion-bot";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Evolution API manda un payload gigante, extraemos lo importante
    const messageData = body?.data?.message;
    const remoteJid = messageData?.remoteJid; // Número del cliente
    const textMessage = messageData?.conversation || messageData?.extendedTextMessage?.text;

    // Filtros de seguridad (ignorar grupos o mensajes sin texto)
    if (!textMessage || !remoteJid || remoteJid.includes('@g.us') || body?.data?.key?.fromMe) {
      return NextResponse.json({ success: true, reason: 'Ignored' });
    }

    // 1. Procesar respuesta con Inteligencia Artificial
    const aiResponse = await getGroqChatCompletion(textMessage);

    // 2. Comandos de escape (Handoff humano)
    if (textMessage.toLowerCase().includes("humano") || textMessage.toLowerCase().includes("asesor")) {
      // Aquí podrías agregar lógica para silenciar al bot en la BD
      await sendWhatsAppMessage(remoteJid, "¡Claro! En un momento Luis o uno de nuestros asesores humanos tomará el chat.");
      return NextResponse.json({ success: true, handoff: true });
    }

    // 3. Enviar respuesta del Bot de vuelta al cliente
    await sendWhatsAppMessage(remoteJid, aiResponse);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper interno para disparar mensajes desde Evolution API
async function sendWhatsAppMessage(number: string, text: string) {
  return fetch(`${EVOLUTION_URL}/message/sendText/${INSTANCE_NAME}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_KEY
    },
    body: JSON.stringify({
      number: number,
      text: text
    })
  });
}