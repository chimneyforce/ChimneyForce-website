# EmailJS Setup Guide

## Current Issue - Error 422: Recipients Address is Empty

This error means the "To Email" field in your EmailJS templates isn't configured to receive the variables we're sending.

## IMPORTANT: Check Your Template Settings

Go to https://dashboard.emailjs.com/admin/templates and for EACH template, check the "To Email" field:

### For Business Notification (template_2rksi2m):
The "To Email" should be set to: `Chimneyforceinc@gmail.com` (hardcoded)

### For Customer Auto-Reply (template_ipga2xn):
The "To Email" should be set to: `{{user_email}}`

If your templates use different variable names, let me know what they are.

## Your Current Configuration

```
VITE_EMAILJS_SERVICE_ID=service_dmakq2l
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_0s16fmm
VITE_EMAILJS_BUSINESS_TEMPLATE_ID=template_2rksi2m
VITE_EMAILJS_PUBLIC_KEY=o4pzglXc9BsYRFa-2
```

## Step 1: Create Email Templates

Go to https://dashboard.emailjs.com/admin/templates

### Template 1: Business Notification (template_2rksi2m)

This receives notifications when someone submits a form.

**Template Name:** Business Notification
**Subject:** New {{submission_type}} - {{service}}

**Content:**
```html
<h2>New {{submission_type}}</h2>

{{#name}}
<p><strong>Name:</strong> {{name}}</p>
{{/name}}

{{#email}}
<p><strong>Email:</strong> {{email}}</p>
{{/email}}

<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Service:</strong> {{service}}</p>

{{#message}}
<p><strong>Message:</strong></p>
<p>{{message}}</p>
{{/message}}
```

**Variables used:**
- `submission_type` (Quote Request / Contact Form)
- `name`
- `email`
- `phone`
- `service`
- `message`
- `to_email` (Chimneyforceinc@gmail.com)

**To Email:** {{to_email}}

### Template 2: Customer Auto-Reply (template_0s16fmm)

This sends an automatic reply to customers.

**Template Name:** Customer Auto-Reply
**Subject:** Thank you for contacting Chimney Force

**Content:**
```html
<h2>Thank you for reaching out!</h2>

<p>Hi {{to_name}},</p>

<p>We've received your inquiry about <strong>{{service}}</strong> and will get back to you shortly.</p>

<p>Our team typically responds within 24 hours. If you need immediate assistance, please call us at <strong>(555) 123-4567</strong>.</p>

<p>Best regards,<br>
The Chimney Force Team</p>
```

**Variables used:**
- `to_name`
- `to_email`
- `service`

**To Email:** {{to_email}}

## Step 2: Verify Template IDs

After creating the templates, verify the template IDs match:
- Business Notification: `template_2rksi2m`
- Customer Auto-Reply: `template_0s16fmm`

If they don't match, update your `.env` file with the correct IDs.

## Step 3: Test Your Setup

1. Clear your browser cache
2. Refresh the website
3. Submit a test form
4. Check your email (Chimneyforceinc@gmail.com)
5. Check the browser console for any errors

## Troubleshooting

### Error: "Template ID not found"
- The template IDs in `.env` don't match your EmailJS templates
- Create the templates or update the IDs in `.env`

### Error: "Public key is invalid"
- Your public key might be incorrect
- Get the correct key from https://dashboard.emailjs.com/admin/account

### Emails not sending
- Check that all environment variables are set correctly
- Verify your EmailJS account is active
- Check the browser console for error details

### Variables not showing in emails
- Make sure template variable names match exactly (case-sensitive)
- Use double curly braces: `{{variable_name}}`
