
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyUserRequest {
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const { userId, message, type, relatedId, sendEmail, sendSms } = await req.json() as NotifyUserRequest;

    if (!userId || !message || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating notification for user ${userId}: ${message}`);
    
    // Insert notification using service role to bypass RLS
    const { data: notification, error: notifyError } = await supabaseClient
      .from("notifications")
      .insert([
        {
          user_id: userId,
          message: message,
          type: type,
          related_id: relatedId || null,
        },
      ])
      .select()
      .single();

    if (notifyError) {
      console.error(`Error creating notification:`, notifyError);
      throw notifyError;
    }
    
    console.log(`Created notification:`, notification);

    // Handle email notification if requested
    let emailResult = null;
    if (sendEmail) {
      try {
        // Get user's email
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
        
        if (userError || !userData) {
          console.error(`Error fetching user email:`, userError || "No user data");
        } else if (userData.user.email) {
          // Here you would integrate with an email service
          console.log(`Would send email to ${userData.user.email}: ${message}`);
          emailResult = { success: true, email: userData.user.email, message: "Email would be sent here" };
        }
      } catch (emailError) {
        console.error(`Error processing email notification:`, emailError);
        emailResult = { success: false, error: emailError.message };
      }
    }

    // Handle SMS notification if requested
    let smsResult = null;
    if (sendSms) {
      try {
        // Get worker's phone number if this user is a worker
        const { data: workerData, error: workerError } = await supabaseClient
          .from("workers")
          .select("phone_number")
          .eq("user_id", userId)
          .single();
          
        if (workerError || !workerData || !workerData.phone_number) {
          console.error(`Error fetching worker phone:`, workerError || "No phone found");
        } else {
          // Here you would integrate with an SMS service like Twilio
          console.log(`Would send SMS to ${workerData.phone_number}: ${message}`);
          smsResult = { success: true, phone: workerData.phone_number, message: "SMS would be sent here" };
        }
      } catch (smsError) {
        console.error(`Error processing SMS notification:`, smsError);
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
    console.error("Error in notify-user function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
