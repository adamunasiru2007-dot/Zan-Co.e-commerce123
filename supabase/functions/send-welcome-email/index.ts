import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send welcome email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();

    console.log("Sending welcome email to:", email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ZAN&CO <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to ZAN&CO!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; font-size: 32px; margin: 0;">Welcome to ZAN&CO</h1>
            </div>
            
            <p style="font-size: 16px; color: #555;">Hello ${name},</p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Welcome to ZAN&CO, your registration has been completed.
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              You now have access to our exclusive collection of premium quality wears. 
              Start exploring our latest products and enjoy a seamless shopping experience.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app') || '#'}" 
                 style="background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Start Shopping
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              If you have any questions, feel free to contact us via WhatsApp at 08144853538.
            </p>
            
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #888; text-align: center;">
              Best regards,<br><strong>ZAN&CO Team</strong>
            </p>
          </div>
        `,
      }),
    });

    const emailResponse = await res.json();
    console.log("Welcome email response:", emailResponse);

    if (!res.ok) {
      throw new Error(emailResponse.message || "Failed to send welcome email");
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
