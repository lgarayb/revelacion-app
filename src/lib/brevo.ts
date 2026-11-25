import * as SibApiV3Sdk from '@sendinblue/client';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY as string);

interface EmailParams {
  toEmail: string;
  toName: string;
  subject: string;
  htmlContent: string;
}

export async function sendEmail({ toEmail, toName, subject, htmlContent }: EmailParams) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { name: "Revelación MX", email: "operaciones@revelaciondegenero.mx" };
  sendSmtpEmail.to = [{ email: toEmail, name: toName }];
  sendSmtpEmail.replyTo = { email: "contacto@revelaciondegenero.mx", name: "Soporte Revelación" };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Correo enviado con éxito. ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error enviando correo por Brevo:', error);
    return { success: false, error };
  }
}