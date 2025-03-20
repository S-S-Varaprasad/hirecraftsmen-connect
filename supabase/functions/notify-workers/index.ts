
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyWorkersRequest {
  jobId: string;
  jobTitle: string;
  skills: string[];
  category?: string;
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
    const { jobId, jobTitle, skills, category, sendEmail, sendSms } = await req.json() as NotifyWorkersRequest;

    if (!jobId || !jobTitle || !skills || skills.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Notifying workers about job: ${jobTitle} with skills: ${skills.join(', ')}`);
    
    // Get workers with matching skills or profession
    const { data: workers, error: workersError } = await supabaseClient
      .from('workers')
      .select('id, user_id, skills, profession, name')
      .eq('is_available', true);
    
    if (workersError) {
      console.error("Error fetching workers:", workersError);
      throw workersError;
    }

    const notifications = [];
    const skillsLower = skills.map(s => s.toLowerCase());
    const matchedWorkers = [];
    
    // Filter workers with matching skills and send notifications
    for (const worker of workers) {
      if (!worker.user_id) continue;
      
      const workerSkillsLower = worker.skills.map((s: string) => s.toLowerCase());
      const hasMatchingSkill = workerSkillsLower.some((skill: string) => 
        skillsLower.some(jobSkill => skill.includes(jobSkill) || jobSkill.includes(skill))
      );
      
      const matchingProfession = category && 
        worker.profession.toLowerCase().includes(category.toLowerCase());
      
      if (hasMatchingSkill || matchingProfession) {
        console.log(`Found matching worker: ${worker.name} (ID: ${worker.id})`);
        matchedWorkers.push(worker);
        
        try {
          // Insert notification into the database
          const { data: notification, error: notifyError } = await supabaseClient
            .from("notifications")
            .insert([
              {
                user_id: worker.user_id,
                message: `New job posted that matches your skills: ${jobTitle}`,
                type: 'new_job',
                related_id: jobId,
              },
            ])
            .select()
            .single();

          if (notifyError) {
            console.error(`Error creating notification for worker ${worker.id}:`, notifyError);
          } else {
            console.log(`Created notification for worker ${worker.id}:`, notification);
            notifications.push(notification);
          }
        } catch (error) {
          console.error(`Error in notification process for worker ${worker.id}:`, error);
        }
      }
    }

    // Handle email notifications (placeholder - would integrate with email service)
    let emailResults = null;
    if (sendEmail && matchedWorkers.length > 0) {
      console.log("Would send email notifications to matched workers");
      emailResults = {
        success: true,
        sent: matchedWorkers.length,
        message: "Email notifications would be sent here (simulation)"
      };
    }

    // Handle SMS notifications (placeholder - would integrate with SMS service)
    let smsResults = null;
    if (sendSms && matchedWorkers.length > 0) {
      console.log("Would send SMS notifications to matched workers");
      smsResults = {
        success: true,
        sent: matchedWorkers.length,
        message: "SMS notifications would be sent here (simulation)"
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        notifications_created: notifications.length,
        matched_workers: matchedWorkers.length,
        email: emailResults,
        sms: smsResults,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in notify-workers function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
