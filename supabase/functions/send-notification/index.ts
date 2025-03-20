
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  message: string;
  type: string;
  relatedId?: string;
  sendEmail?: boolean;
  sendSms?: boolean;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get request body
    const { userId, message, type, relatedId, sendEmail, sendSms } = await req.json() as NotificationRequest;

    if (!userId || !message || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating notification for user ${userId}: ${message}`);

    // Create the in-app notification
    const { data: notification, error: notificationError } = await supabaseClient
      .from("notifications")
      .insert([
        {
          user_id: userId,
          message,
          type,
          related_id: relatedId || null,
        },
      ])
      .select()
      .single();

    if (notificationError) {
      console.error("Error creating notification:", notificationError);
      throw notificationError;
    }

    console.log("Notification created:", notification);

    // Get user's email if email notification is requested
    let emailResult = null;
    if (sendEmail) {
      try {
        const { data: userData, error: userError } = await supabaseClient
          .from("auth.users")
          .select("email")
          .eq("id", userId)
          .single();

        if (userError || !userData) {
          console.error("Error fetching user email:", userError);
        } else if (userData.email) {
          // Here you would integrate with an email service to send the email
          console.log(`Would send email to ${userData.email}: ${message}`);
          emailResult = { success: true, email: userData.email };
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        emailResult = { success: false, error: emailError.message };
      }
    }

    // Handle SMS notification (placeholder for future implementation)
    let smsResult = null;
    if (sendSms) {
      // Here you would implement SMS sending logic
      console.log(`Would send SMS notification: ${message}`);
      smsResult = { success: true, message: "SMS notification simulated" };
    }

    return new Response(
      JSON.stringify({
        success: true,
        notification,
        email: emailResult,
        sms: smsResult,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
