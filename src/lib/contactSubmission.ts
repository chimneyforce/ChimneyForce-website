const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_CUSTOMER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID;
const EMAILJS_BUSINESS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_BUSINESS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export interface QuoteFormData {
  phone: string;
  service: string;
  name?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface SubmissionResult {
  success: boolean;
  error?: string;
}

async function getEmailJS() {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
    return null;
  }
  const emailjs = (await import('@emailjs/browser')).default;
  emailjs.init(EMAILJS_PUBLIC_KEY);
  return emailjs;
}

export async function submitQuoteRequest(
  formData: QuoteFormData
): Promise<SubmissionResult> {
  try {
    const emailjs = await getEmailJS();
    if (!emailjs || !EMAILJS_BUSINESS_TEMPLATE_ID) {
      return { success: false, error: 'Email service is not configured. Please call us directly.' };
    }

    await emailjs.send(
      EMAILJS_SERVICE_ID!,
      EMAILJS_BUSINESS_TEMPLATE_ID,
      {
        name: formData.name || 'Quote Request',
        phone: formData.phone,
        service: formData.service,
        message: 'Quick quote request via phone',
        reply_to: 'noreply@chimneyforce.com',
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error submitting quote request:', error);
    return { success: false, error: 'Something went wrong. Please try again or call us directly.' };
  }
}

export async function submitContactForm(
  formData: ContactFormData
): Promise<SubmissionResult> {
  try {
    const emailjs = await getEmailJS();
    if (!emailjs || !EMAILJS_BUSINESS_TEMPLATE_ID) {
      return { success: false, error: 'Email service is not configured. Please call us directly.' };
    }

    await emailjs.send(
      EMAILJS_SERVICE_ID!,
      EMAILJS_BUSINESS_TEMPLATE_ID,
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        reply_to: formData.email,
      }
    );

    if (EMAILJS_CUSTOMER_TEMPLATE_ID) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID!,
          EMAILJS_CUSTOMER_TEMPLATE_ID,
          {
            name: formData.name,
            email: formData.email,
            service: formData.service,
            reply_to: 'Chimneyforceinc@gmail.com',
          }
        );
      } catch {
        // Customer auto-reply failed but the main submission succeeded
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Something went wrong. Please try again or call us directly.' };
  }
}
