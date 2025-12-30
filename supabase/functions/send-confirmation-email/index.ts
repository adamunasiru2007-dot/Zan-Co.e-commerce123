import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send confirmation email function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, customerName, orderId, items, total }: EmailRequest = await req.json();
    
    console.log("Sending confirmation email to:", customerEmail);

    const itemsList = items
      .map((item) => `<li>${item.name} x ${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}</li>`)
      .join("");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ZAN&CO <onboarding@resend.dev>",
        to: [customerEmail],
        subject: "Order Confirmed - ZAN&CO",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Order Confirmed!</h1>
            <p>Hello ${customerName},</p>
            <p>Thank you for shopping with ZAN&CO. Your order has been confirmed.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <ul style="list-style: none; padding: 0;">
                ${itemsList}
              </ul>
              <hr style="border: 1px solid #ddd;">
              <p style="font-size: 18px;"><strong>Total: ₦${total.toLocaleString()}</strong></p>
            </div>
            
            <p>Please proceed to make payment using the bank details provided.</p>
            <p>If you have any questions, feel free to contact us.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>ZAN&CO Team</strong></p>
          </div>
        `,
      }),
    });

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    if (!res.ok) {
      throw new Error(emailResponse.message || "Failed to send email");
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
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
