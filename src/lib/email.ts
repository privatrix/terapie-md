import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ApprovalEmailData {
  name: string;
  email: string;
  tempPassword: string;
  type: 'terapeut' | 'business';
  loginUrl: string;
}

export interface DocumentRequestEmailData {
  name: string;
  email: string;
  documentsList: string[];
}

export interface RejectionEmailData {
  name: string;
  email: string;
  reason: string;
}

export interface ReplyEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Send approval email with temporary password
 */
export async function sendApprovalEmail(data: ApprovalEmailData) {
  const typeText = data.type === 'terapeut' ? 'terapeut' : 'business wellness';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
          .warning { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Aplicația dvs. a fost aprobată!</h1>
          </div>
          <div class="content">
            <p>Bună ${data.name},</p>
            
            <p>Felicitări! Aplicația dvs. pentru <strong>${typeText}</strong> a fost aprobată de echipa Terapie.md.</p>
            
            <div class="credentials">
              <h3>Date de autentificare:</h3>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Parolă temporară:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${data.tempPassword}</code></p>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ IMPORTANT:</strong> La prima autentificare, veți fi nevoit să schimbați parola pentru securitatea contului dvs.</p>
            </div>
            
            <a href="${data.loginUrl}" class="button">Autentifică-te acum</a>
            
            <p>Bine ați venit în echipa Terapie.md!</p>
            
            <p>Cu respect,<br>Echipa Terapie.md</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <onboarding@terapie.md>',
    to: [data.email],
    subject: 'Aplicația dvs. a fost aprobată! 🎉',
    html: htmlContent,
  });

  if (error) {
    throw error;
  }

  return result;
}

/**
 * Send document request email
 */
export async function sendDocumentRequestEmail(data: DocumentRequestEmailData) {
  const documentListHtml = data.documentsList
    .map(doc => `<li>${doc}</li>`)
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          ul { background: white; padding: 20px 40px; border-left: 4px solid #3b82f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 Documente necesare</h1>
          </div>
          <div class="content">
            <p>Bună ${data.name},</p>
            
            <p>Pentru a procesa aplicația dvs., avem nevoie de următoarele documente:</p>
            
            <ul>
              ${documentListHtml}
            </ul>
            
            <p>Vă rugăm să trimiteți documentele la acest email.</p>
            
            <p>Mulțumim pentru înțelegere!</p>
            
            <p>Cu respect,<br>Echipa Terapie.md</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <support@terapie.md>',
    to: [data.email],
    subject: 'Documente necesare pentru aplicație',
    html: htmlContent,
  });

  if (error) {
    throw error;
  }

  return result;
}

/**
 * Send rejection email
 */
export async function sendRejectionEmail(data: RejectionEmailData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6b7280; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .reason { background: white; padding: 20px; border-left: 4px solid #6b7280; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Actualizare aplicație</h1>
          </div>
          <div class="content">
            <p>Bună ${data.name},</p>
            
            <p>Mulțumim pentru interesul acordat platformei Terapie.md.</p>
            
            <p>Din păcate, nu putem aproba aplicația dvs. în acest moment.</p>
            
            <div class="reason">
              <strong>Motiv:</strong> ${data.reason}
            </div>
            
            <p>Vă încurajăm să aplicați din nou în viitor dacă situația se schimbă.</p>
            
            <p>Cu respect,<br>Echipa Terapie.md</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <support@terapie.md>',
    to: [data.email],
    subject: 'Actualizare aplicație',
    html: htmlContent,
  });

  if (error) {
    throw error;
  }

  return result;
}

/**
 * Send booking request email to therapist
 */
export async function sendBookingRequestEmail(data: {
  therapistEmail: string;
  therapistName: string;
  clientName: string;
  date: string;
  time: string;
  notes?: string;
}) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .details { background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Cerere de Programare Nouă</h1>
          </div>
          <div class="content">
            <p>Bună ${data.therapistName},</p>
            
            <p>Ați primit o nouă cerere de programare de la <strong>${data.clientName}</strong>.</p>
            
            <div class="details">
              <p><strong>Data:</strong> ${data.date}</p>
              <p><strong>Ora:</strong> ${data.time}</p>
              ${data.notes ? `<p><strong>Note:</strong> ${data.notes}</p>` : ''}
            </div>
            
            <p>Vă rugăm să accesați dashboard-ul pentru a aproba sau respinge această cerere.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Mergi la Dashboard</a>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <bookings@terapie.md>',
    to: [data.therapistEmail],
    subject: '📅 Cerere de Programare Nouă',
    html: htmlContent,
  });

  if (error) throw error;
  return result;
}

/**
 * Send booking status update email to client
 */
export async function sendBookingStatusEmail(data: {
  clientEmail: string;
  clientName: string;
  therapistName: string;
  therapistId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  reason?: string;
}) {
  const isConfirmed = data.status === 'confirmed';
  const isCompleted = data.status === 'completed';

  const title = isConfirmed
    ? '✅ Programare Confirmată'
    : isCompleted
      ? '✨ Programare Finalizată'
      : '❌ Programare Respinsă';

  const color = isConfirmed || isCompleted ? '#10b981' : '#ef4444';

  const message = isConfirmed
    ? `Programarea dvs. cu <strong>${data.therapistName}</strong> a fost confirmată.`
    : isCompleted
      ? `Sperăm că ședința cu <strong>${data.therapistName}</strong> a fost utilă. Vă invităm să lăsați o recenzie!`
      : `Din păcate, programarea dvs. cu <strong>${data.therapistName}</strong> a fost respinsă.`;

  const footer = isCompleted
    ? `<div style="text-align: center; margin-top: 20px;">
         <a href="${process.env.NEXT_PUBLIC_APP_URL}/terapeuti/${data.therapistId}" class="button" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Lasă o Recenzie</a>
       </div>`
    : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${color}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .details { background: white; padding: 20px; border-left: 4px solid ${color}; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>Bună ${data.clientName},</p>
            
            <p>${message}</p>
            
            <div class="details">
              <p><strong>Terapeut:</strong> ${data.therapistName}</p>
              <p><strong>Data:</strong> ${data.date}</p>
              <p><strong>Ora:</strong> ${data.time}</p>
              ${data.reason ? `<p><strong>${isConfirmed ? 'Mesaj de la terapeut' : 'Notă'}:</strong> ${data.reason}</p>` : ''}
            </div>
            
            ${footer}
            
            <p>Cu respect,<br>Echipa Terapie.md</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <bookings@terapie.md>',
    to: [data.clientEmail],
    subject: title,
    html: htmlContent,
  });

  if (error) throw error;
  return result;
}

/**
 * Send confirmation email for new account
 */
export async function sendConfirmationEmail(email: string, name: string, confirmationUrl: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Confirmă adresa de email</h1>
          </div>
          <div class="content">
            <p>Salut ${name},</p>
            
            <p>Mulțumim că te-ai înregistrat pe Terapie.md! Te rugăm să confirmi adresa de email pentru a activa contul.</p>
            
            <div style="text-align: center;">
              <a href="${confirmationUrl}" class="button">Confirmă Email</a>
            </div>
            
            <p>Dacă nu ai creat acest cont, poți ignora acest email.</p>
            
            <p>Cu respect,<br>Echipa Terapie.md</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <noreply@terapie.md>',
    to: [email],
    subject: 'Confirmă contul Terapie.md',
    html: htmlContent,
  });

  if (error) throw error;
  return result;
}

/**
 * Send generic reply email
 */
export async function sendReplyEmail(data: ReplyEmailData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .message-box { background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Răspuns de la Terapie.md</h1>
          </div>
          <div class="content">
            <p>Bună ${data.name},</p>
            
            <div class="message-box">
              ${data.message}
            </div>
            
            <p>Cu respect,<br>Echipa Terapie.md</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <support@terapie.md>',
    to: [data.email],
    subject: data.subject,
    html: htmlContent,
  });

  if (error) throw error;
  return result;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Resetare Parolă</h1>
          </div>
          <div class="content">
            <p>Salut,</p>
            
            <p>Am primit o cerere de resetare a parolei pentru contul tău Terapie.md.</p>
            
            <p>Pentru a alege o nouă parolă, apasă pe butonul de mai jos:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Resetează Parola</a>
            </div>
            
            <p>Dacă nu ai solicitat acest lucru, poți ignora acest email.</p>
            
            <p>Cu respect,<br>Echipa Terapie.md</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <onboarding@resend.dev>',
    to: [email],
    subject: 'Resetare Parolă Terapie.md',
    html: htmlContent,
  });

  if (error) throw error;
  return result;
}

/**
 * Send booking cancellation email to therapist
 */
export async function sendBookingCancellationEmail(data: {
  therapistEmail: string;
  therapistName: string;
  clientName: string;
  date: string;
  time: string;
  reason?: string;
}) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .details { background: white; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Programare Anulată</h1>
          </div>
          <div class="content">
            <p>Bună ${data.therapistName},</p>
            
            <p>Programarea cu <strong>${data.clientName}</strong> a fost anulată de către client.</p>
            
            <div class="details">
              <p><strong>Data:</strong> ${data.date}</p>
              <p><strong>Ora:</strong> ${data.time}</p>
              ${data.reason ? `<p><strong>Motiv:</strong> ${data.reason}</p>` : ''}
            </div>
            
            <p>Calendarul dvs. a fost actualizat.</p>
            
            <p>Cu respect,<br>Echipa Terapie.md</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <bookings@terapie.md>',
    to: [data.therapistEmail],
    subject: 'Programare Anulată ❌',
    html: htmlContent,
  });

  if (error) throw error;
  return result;
}

/**
 * Send new message notification email
 */
export async function sendNewMessageEmail(data: {
  toEmail: string;
  recipientName: string;
  senderName: string;
  messagePreview: string;
  bookingLink: string;
}) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .message-box { background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; font-style: italic; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { font-size: 12px; color: #666; margin-top: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Mesaj Nou</h1>
          </div>
          <div class="content">
            <p>Bună ${data.recipientName},</p>
            
            <p>Ai primit un mesaj nou de la <strong>${data.senderName}</strong>:</p>
            
            <div class="message-box">
              "${data.messagePreview}"
            </div>
            
            <p>Pentru a răspunde, accesează platforma:</p>
            
            <div style="text-align: center;">
              <a href="${data.bookingLink}" class="button">Vezi Mesajul</a>
            </div>
            
            <p>Cu respect,<br>Echipa Terapie.md</p>
            
            <div class="footer">
              <p>Poți modifica setările de notificare din contul tău.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data: result, error } = await resend.emails.send({
    from: 'Terapie.md <messages@terapie.md>',
    to: [data.toEmail],
    subject: `Mesaj nou de la ${data.senderName}`,
    html: htmlContent,
  });

  if (error) throw error;
  return result;
}
