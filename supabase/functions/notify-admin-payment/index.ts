import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentNotificationRequest {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Notify admin payment function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerName, customerEmail, total }: PaymentNotificationRequest = await req.json();

    console.log("Sending payment notification for order:", orderId);

    const adminEmail = "zahloaded@gmail.com"; // Admin email

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ZAN&CO <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🔔 Payment Notification - Order ${orderId.slice(0, 8)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; font-size: 32px; margin: 0;">ZAN&CO</h1>
              <p style="color: #666; font-size: 14px; margin-top: 5px;">Payment Notification</p>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #155724; margin: 0 0 10px 0;">💰 Customer Claims Payment Sent!</h2>
              <p style="color: #155724; margin: 0;">A customer has clicked "I've Paid" for their order.</p>
            </div>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Order ID:</td>
                  <td style="padding: 8px 0; font-weight: bold; font-family: monospace;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Customer Name:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Customer Email:</td>
                  <td style="padding: 8px 0;">${customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Amount:</td>
                  <td style="padding: 8px 0; font-weight: bold; font-size: 18px; color: #28a745;">₦${total.toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>⚠️ Action Required:</strong> Please verify the payment in your bank account and update the order status accordingly.
              </p>
            </div>
            
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #888; text-align: center;">
              This is an automated notification from ZAN&CO
            </p>
          </div>
        `,
      }),
    });

    const emailResponse = await res.json();
    console.log("Admin notification email response:", emailResponse);

    if (!res.ok) {
      throw new Error(emailResponse.message || "Failed to send notification email");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending admin notification:", error);
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
