import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ValidateTokenRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Reset password function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const body = await req.json();

    // Check if this is a validation request or a reset request
    if (body.newPassword) {
      // Reset password request
      const { token, newPassword }: ResetPasswordRequest = body;

      console.log("Processing password reset with token");

      // Find and validate the token
      const { data: tokenData, error: tokenError } = await supabase
        .from("password_reset_tokens")
        .select("*")
        .eq("token", token)
        .eq("used", false)
        .single();

      if (tokenError || !tokenData) {
        console.error("Token not found or already used:", tokenError);
        return new Response(
          JSON.stringify({ error: "Invalid or expired reset token" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Check if token is expired
      if (new Date(tokenData.expires_at) < new Date()) {
        console.log("Token has expired");
        return new Response(
          JSON.stringify({ error: "Reset token has expired" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Find user by email
      const { data: users, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        console.error("Error finding user:", userError);
        throw new Error("Failed to find user");
      }

      const user = users.users.find(u => u.email === tokenData.email);
      
      if (!user) {
        console.error("User not found for email:", tokenData.email);
        return new Response(
          JSON.stringify({ error: "User not found" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (updateError) {
        console.error("Error updating password:", updateError);
        throw new Error("Failed to update password");
      }

      // Mark token as used
      await supabase
        .from("password_reset_tokens")
        .update({ used: true })
        .eq("token", token);

      console.log("Password reset successful for:", tokenData.email);

      return new Response(
        JSON.stringify({ success: true, message: "Password updated successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      // Validate token request
      const { token }: ValidateTokenRequest = body;

      console.log("Validating reset token");

      const { data: tokenData, error: tokenError } = await supabase
        .from("password_reset_tokens")
        .select("email, expires_at, used")
        .eq("token", token)
        .single();

      if (tokenError || !tokenData) {
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid token" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      if (tokenData.used) {
        return new Response(
          JSON.stringify({ valid: false, error: "Token already used" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      if (new Date(tokenData.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ valid: false, error: "Token expired" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({ valid: true, email: tokenData.email }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in reset-password function:", error);
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
