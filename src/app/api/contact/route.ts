import { NextResponse } from 'next/server';

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'ms18@demo.com';
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.CONTACT_FROM_EMAIL ?? 'Website Contact <onboarding@resend.dev>';

function normalize(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  const name = normalize(body?.name);
  const email = normalize(body?.email).toLowerCase();
  const phone = normalize(body?.phone);
  const message = normalize(body?.message);

  if (!name || !email || !phone || !message) {
    return NextResponse.json(
      { error: 'Please complete your name, email, contact number, and message.' },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  if (!resendApiKey) {
    return NextResponse.json(
      {
        error:
          'Email sending is not configured yet. Add RESEND_API_KEY and NEXT_PUBLIC_COMPANY_EMAIL to your environment.',
      },
      { status: 500 }
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [companyEmail],
      reply_to: email,
      subject: `New contact request from ${name}`,
      text: [
        'New contact request',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Contact Number: ${phone}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="margin-bottom: 16px;">New contact request</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Contact Number:</strong> ${safePhone}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `,
    }),
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text().catch(() => '');
    console.error('Failed to send contact email:', resendError);

    return NextResponse.json(
      { error: 'We could not deliver your message right now. Please try again shortly.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
