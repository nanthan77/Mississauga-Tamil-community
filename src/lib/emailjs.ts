import emailjs from '@emailjs/browser';

// ============================================================
// EmailJS Configuration
// Sign up at https://www.emailjs.com/ (free tier: 200 emails/month)
//
// Setup steps:
// 1. Create account at emailjs.com
// 2. Add Gmail service: Email Services → Add Service → Gmail
// 3. Create email template: Email Templates → Create Template
//    Use these template variables:
//      {{to_email}}     - member's email
//      {{to_name}}      - member's full name
//      {{reference}}    - registration reference number
//      {{amount}}       - payment amount
//      {{membership}}   - membership type
//      {{payment_email}} - email to send e-transfer to
// 4. Copy your Service ID, Template ID, and Public Key below
// ============================================================

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

export interface PaymentEmailParams {
  to_email: string;
  to_name: string;
  reference: string;
  amount: number;
  membership: string;
  payment_email: string;
}

export async function sendPaymentInstructionsEmail(params: PaymentEmailParams): Promise<boolean> {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in .env.local');
    return false;
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: params.to_email,
        to_name: params.to_name,
        reference: params.reference,
        amount: params.amount.toString(),
        membership: params.membership,
        payment_email: params.payment_email,
      },
      EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
