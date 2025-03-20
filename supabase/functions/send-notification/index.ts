
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
        // First, get user's email from auth users table
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(userId);

        if (userError || !userData) {
          console.error("Error fetching user email:", userError || "No user data found");
        } else if (userData.user.email) {
          // Here you would integrate with an email service to send the email
          // This is a placeholder for actual email sending code
          
          console.log(`Would send email to ${userData.user.email}: ${message}`);
          emailResult = { success: true, email: userData.user.email };
          
          // You could implement a real email service here
          // For example, using a service like Mailgun, SendGrid, or AWS SES
          /*
          const emailResponse = await fetch('https://api.mailservice.com/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get("EMAIL_API_KEY")}`
            },
            body: JSON.stringify({
              to: userData.user.email,
              subject: `Notification: ${type}`,
              text: message,
              html: `<div><h1>${type}</h1><p>${message}</p></div>`
            })
          });
          */
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        emailResult = { success: false, error: emailError.message };
      }
    }

    // Handle SMS notification
    let smsResult = null;
    if (sendSms) {
      try {
        // Get worker's phone number
        const { data: workerData, error: workerError } = await supabaseClient
          .from("workers")
          .select("phone_number")
          .eq("user_id", userId)
          .single();
          
        if (workerError || !workerData || !workerData.phone_number) {
          console.error("Error fetching worker phone number:", workerError || "No phone number found");
        } else {
          // Here you would implement SMS sending logic with a service like Twilio
          // This is a placeholder for actual SMS sending code
          
          console.log(`Would send SMS to ${workerData.phone_number}: ${message}`);
          smsResult = { success: true, phone: workerData.phone_number };
          
          // Example implementation with Twilio would be:
          /*
          const twilioResponse = await fetch('https://api.twilio.com/send-sms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${btoa(`${Deno.env.get("TWILIO_ACCOUNT_SID")}:${Deno.env.get("TWILIO_AUTH_TOKEN")}`)}`
            },
            body: JSON.stringify({
              to: workerData.phone_number,
              body: message
            })
          });
          */
        }
      } catch (smsError) {
        console.error("Error sending SMS notification:", smsError);
        smsResult = { success: false, error: smsError.message };
      }
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
