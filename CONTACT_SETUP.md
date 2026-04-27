# Contact Form Setup

The contact form sends submissions from the Contact Us modal to `src/app/api/contact/route.ts`, then delivers the message through Resend.

## 1. Create a Resend API key

1. Sign in to Resend.
2. Go to **API Keys**.
3. Create an API key with permission to send emails.
4. Copy the key. It should start with `re_`.

## 2. Configure sender email

For local testing, Resend can use:

```env
CONTACT_FROM_EMAIL="Website Contact <onboarding@resend.dev>"
```

For production, verify your domain in Resend, then use an address from that domain:

```env
CONTACT_FROM_EMAIL="MS18 Website <contact@yourdomain.com>"
```

## 3. Add environment variables

Create or update `.env.local` for local development:

```env
NEXT_PUBLIC_COMPANY_EMAIL=your-company-inbox@example.com
RESEND_API_KEY=re_your_resend_api_key
CONTACT_FROM_EMAIL="MS18 Website <contact@yourdomain.com>"
```

Variable meanings:

- `NEXT_PUBLIC_COMPANY_EMAIL`: inbox that receives contact form messages and appears on the page.
- `RESEND_API_KEY`: private Resend key used by `/api/contact`.
- `CONTACT_FROM_EMAIL`: verified sender address used by Resend.

Do not commit real `RESEND_API_KEY` values.

## 4. Restart the dev server

Environment variables are read at startup, so restart Next.js after editing `.env.local`.

```bash
npm run dev
```

## 5. Test the form

1. Open the site.
2. Go to the Contact section.
3. Click **Contact Us**.
4. Fill in name, email, contact number, and message.
5. Submit.

Expected result:

- Success message appears in the modal.
- `NEXT_PUBLIC_COMPANY_EMAIL` receives an email.
- The sender can be replied to because the API sets `reply_to` to the submitted email.

## Troubleshooting

If the page says email sending is not configured:

- Check `RESEND_API_KEY` exists.
- Restart the dev server.

If Resend rejects the email:

- Make sure `CONTACT_FROM_EMAIL` uses a verified Resend sender/domain.
- For production, avoid `onboarding@resend.dev`; use a verified domain email.

If the form submits but no email arrives:

- Check spam/junk.
- Check Resend logs.
- Confirm `NEXT_PUBLIC_COMPANY_EMAIL` is correct.
