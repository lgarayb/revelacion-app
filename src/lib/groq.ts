import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const SYSTEM_PROMPT = `Eres el agente de ventas estrella de una agencia premium de revelación de género en CDMX. 
Vendes experiencias con pirotecnia fría, humo denso de colores y extintores. 
Tu objetivo es perfilar al cliente, responder sus dudas rápido y enviarle el link para reservar.
El cliente no sabe de precios, menciónale que los paquetes inician en $2,500 MXN.
Reglas: Sé persuasivo, empático, usa emojis moderadamente y responde en textos cortos (máximo 3 oraciones). No inventes promociones.`;

export async function getGroqChatCompletion(userMessage: string, history: any[] = []) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: userMessage }
      ],
      model: "llama3-8b-8192", // Modelo rapidísimo para chat
      temperature: 0.7,
      max_tokens: 150,
    });

    return chatCompletion.choices[0]?.message?.content || "En este momento todos nuestros asesores están ocupados, ¡te respondemos en un minuto!";
  } catch (error) {
    console.error("Error en Groq API:", error);
    return "Tuvimos un pequeño problema técnico, pero déjame tus dudas y te atiendo enseguida.";
  }
}