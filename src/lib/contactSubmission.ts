import { supabase } from './supabase';
import emailjs from '@emailjs/browser';

// Development-only logging
const isDev = import.meta.env.DEV;
const logger = {
  log: (...args: unknown[]) => isDev && console.log(...args),
  error: (...args: unknown[]) => console.error(...args),
  warn: (...args: unknown[]) => isDev && console.warn(...args),
};

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_CUSTOMER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID;
const EMAILJS_BUSINESS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_BUSINESS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

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

export async function submitQuoteRequest(
  formData: QuoteFormData
): Promise<SubmissionResult> {
  try {
    if (!supabase) {
      logger.error('Supabase client not initialized');
      return { success: false, error: 'Database connection not available. Please try again later.' };
    }

    logger.log('Submitting quote request with data:', {
      submission_type: 'quote',
      phone: formData.phone,
      service: formData.service
    });

    const submissionData = {
      submission_type: 'quote',
      name: formData.name || '',
      phone: formData.phone,
      service: formData.service,
      email_sent: false,
    };

    const { error, status, statusText } = await supabase
      .from('contact_submissions')
      .insert([submissionData]);

    if (error) {
      logger.error('Error saving quote request:', error);
      logger.error('Error code:', error.code);
      logger.error('Error message:', error.message);
      logger.error('Error details:', error.details);
      logger.error('Error hint:', error.hint);
      logger.error('Status:', status, statusText);
      return { success: false, error: `Failed to save your request: ${error.message || 'Please try again.'}` };
    }

    logger.log('Quote request saved successfully');

    // Fire GA4 generate_lead event — Enhanced Measurement misses AJAX forms
    try {
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'quote_form',
          event_label: formData.service,
          form_name: 'get_free_consultation',
          value: 1,
          currency: 'USD',
        });
      }
    } catch (_) { /* gtag not available */ }

    // Send email notification (non-blocking)
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_BUSINESS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_BUSINESS_TEMPLATE_ID,
          {
            name: formData.name || 'Quote Request',
            phone: formData.phone,
            service: formData.service,
            message: 'Quick quote request via phone',
            reply_to: 'noreply@chimneyforce.com',
          }
        );
        logger.log('Business notification email sent successfully');
      } else {
        logger.warn('EmailJS not configured - skipping email notification');
      }
    } catch (emailError) {
      logger.error('Error sending email notification:', emailError instanceof Error ? emailError.message : String(emailError));
      // Don't fail the submission if email fails
    }

    return { success: true };
  } catch (error) {
    logger.error('Error submitting quote request:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function submitContactForm(
  formData: ContactFormData
): Promise<SubmissionResult> {
  try {
    if (!supabase) {
      logger.error('Supabase client not initialized');
      return { success: false, error: 'Database connection not available. Please try again later.' };
    }

    logger.log('Submitting contact form with data:', {
      submission_type: 'contact',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      hasMessage: !!formData.message
    });

    const submissionData = {
      submission_type: 'contact',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      message: formData.message,
      email_sent: false,
    };

    const { error, status, statusText } = await supabase
      .from('contact_submissions')
      .insert([submissionData]);

    if (error) {
      logger.error('Error saving contact form:', error);
      logger.error('Error code:', error.code);
      logger.error('Error message:', error.message);
      logger.error('Error details:', error.details);
      logger.error('Error hint:', error.hint);
      logger.error('Status:', status, statusText);
      return { success: false, error: `Failed to save your message: ${error.message || 'Please try again.'}` };
    }

    logger.log('Contact form saved successfully');

    // Fire GA4 generate_lead event — Enhanced Measurement misses AJAX forms
    try {
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'contact_form',
          event_label: formData.service,
          form_name: 'contact_page',
          value: 1,
          currency: 'USD',
        });
      }
    } catch (_) { /* gtag not available */ }

    // Send email notifications (non-blocking)
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_CUSTOMER_TEMPLATE_ID && EMAILJS_BUSINESS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        // Send business notification first
        await emailjs.send(
          EMAILJS_SERVICE_ID,
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
        logger.log('Business notification email sent successfully');

        // Send customer auto-reply
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_CUSTOMER_TEMPLATE_ID,
          {
            name: formData.name,
            email: formData.email,
            service: formData.service,
            reply_to: 'Chimneyforceinc@gmail.com',
          }
        );
        logger.log('Customer auto-reply sent successfully');
      } else {
        logger.warn('EmailJS not configured - skipping email notifications');
      }
    } catch (emailError) {
      logger.error('Error sending email notification:', emailError instanceof Error ? emailError.message : String(emailError));
      // Don't fail the submission if email fails
    }

    return { success: true };
  } catch (error) {
    logger.error('Error submitting contact form:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
