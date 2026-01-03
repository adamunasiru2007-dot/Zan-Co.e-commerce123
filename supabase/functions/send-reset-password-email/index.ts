import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  email: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send reset password email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl }: ResetPasswordRequest = await req.json();

    console.log("Processing password reset for:", email);

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check if user exists
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error checking user:", userError);
      throw new Error("Failed to verify user");
    }

    const userExists = users.users.some(user => user.email === email);
    
    if (!userExists) {
      // Don't reveal if user exists or not for security
      console.log("User not found, but returning success for security");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate a secure token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store the token in the database
    const { error: insertError } = await supabase
      .from("password_reset_tokens")
      .insert({
        email,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Error storing token:", insertError);
      throw new Error("Failed to create reset token");
    }

    // Create reset link
    const resetLink = `${redirectUrl}?reset_token=${token}`;

    // Send branded email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ZAN&CO <onboarding@resend.dev>",
        to: [email],
        subject: "Reset Your ZAN&CO Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; font-size: 32px; margin: 0;">ZAN&CO</h1>
              <p style="color: #666; font-size: 14px; margin-top: 5px;">Password Reset Request</p>
            </div>
            
            <p style="font-size: 16px; color: #555;">Hello,</p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              We received a request to reset your password for your ZAN&CO account. 
              Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #000; color: #fff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; line-height: 1.6;">
              This link will expire in 1 hour. If you didn't request a password reset, 
              you can safely ignore this email.
            </p>
            
            <p style="font-size: 14px; color: #888;">
              Or copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color: #2754C5; word-break: break-all;">${resetLink}</a>
            </p>
            
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #888; text-align: center;">
              Best regards,<br><strong>ZAN&CO Team</strong>
            </p>
            
            <p style="font-size: 12px; color: #aaa; text-align: center; margin-top: 20px;">
              If you have any questions, contact us via WhatsApp at 08144853538.
            </p>
          </div>
        `,
      }),
    });

    const emailResponse = await res.json();
    console.log("Reset email response:", emailResponse);

    if (!res.ok) {
      throw new Error(emailResponse.message || "Failed to send reset email");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending reset email:", error);
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
