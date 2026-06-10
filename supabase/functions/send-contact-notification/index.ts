import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFICATION_EMAIL = "Chimneyforceinc@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const submission = await req.json();
    console.log("✅ Edge function received submission:", submission);

    let emailSent = false;
    let emailError = null;

    if (RESEND_API_KEY) {
      try {
        const isQuote = submission.submission_type === 'quote';
        const emailSubject = isQuote
          ? `New Quote Request - ${submission.service}`
          : `New Contact Form Submission - ${submission.service}`;

        const emailBody = isQuote
          ? `
            <h2>New Quote Request</h2>
            <p><strong>Phone:</strong> ${submission.phone}</p>
            <p><strong>Service:</strong> ${submission.service}</p>
          `
          : `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${submission.name}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Phone:</strong> ${submission.phone}</p>
            <p><strong>Service:</strong> ${submission.service}</p>
            <p><strong>Message:</strong></p>
            <p>${submission.message || 'No message provided'}</p>
          `;

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Chimney Force Website <notifications@chimneyforce.com>",
            to: [NOTIFICATION_EMAIL],
            subject: emailSubject,
            html: emailBody,
          }),
        });

        if (emailResponse.ok) {
          emailSent = true;
          console.log("✅ Email sent successfully");
        } else {
          const errorData = await emailResponse.text();
          emailError = `Email API error: ${errorData}`;
          console.error("❌ Email sending failed:", errorData);
        }
      } catch (error) {
        emailError = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Error sending email:", error);
      }
    } else {
      emailError = "RESEND_API_KEY not configured";
      console.warn("⚠️ RESEND_API_KEY not set - emails disabled");
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        message: emailSent
          ? "Form received and notification sent successfully"
          : `Form received successfully (email notification failed: ${emailError})`,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        emailSent: false,
        message: "Failed to process form submission",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
