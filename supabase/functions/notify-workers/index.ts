
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
  employerId?: string;
  isUpdate?: boolean;
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
    const requestBody = await req.json();
    console.log("Received request body:", JSON.stringify(requestBody));
    
    const { jobId, jobTitle, skills, category, sendEmail, sendSms, employerId, isUpdate } = requestBody as NotifyWorkersRequest;

    if (!jobId || !jobTitle || !skills || skills.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const notificationType = isUpdate ? "job update" : "new job";
    console.log(`Notifying workers about ${notificationType}: ${jobTitle} with skills: ${skills.join(', ')}`);
    console.log(`Category: ${category || 'None provided'}`);
    
    // Get all available workers
    const { data: workers, error: workersError } = await supabaseClient
      .from('workers')
      .select('id, user_id, skills, profession, name, languages')
      .eq('is_available', true);
    
    if (workersError) {
      console.error("Error fetching workers:", workersError);
      throw workersError;
    }

    console.log(`Found ${workers.length} available workers`);
    
    const notifications = [];
    const skillsLower = skills.map(s => s.toLowerCase());
    const matchedWorkers = [];
    
    // Enhanced function to check for skill matches with better matching logic
    const hasMatchingSkill = (workerSkills: string[], jobSkills: string[]) => {
      if (!workerSkills || workerSkills.length === 0) {
        console.log('Worker has no skills defined');
        return false;
      }
      
      const workerSkillsLower = workerSkills.map(s => s.toLowerCase());
      
      console.log(`Comparing worker skills: [${workerSkillsLower.join(', ')}] with job skills: [${jobSkills.join(', ')}]`);
      
      // Check if any worker skill contains or is contained by any job skill
      for (const workerSkill of workerSkillsLower) {
        for (const jobSkill of jobSkills) {
          const workerSkillTrimmed = workerSkill.trim();
          const jobSkillTrimmed = jobSkill.trim();
          
          // Check for exact match
          if (workerSkillTrimmed === jobSkillTrimmed) {
            console.log(`Exact skill match: ${workerSkillTrimmed} = ${jobSkillTrimmed}`);
            return true;
          }
          
          // Check if worker skill contains job skill or vice versa
          if (workerSkillTrimmed.includes(jobSkillTrimmed) || jobSkillTrimmed.includes(workerSkillTrimmed)) {
            console.log(`Partial skill match: "${workerSkillTrimmed}" includes/is included in "${jobSkillTrimmed}"`);
            return true;
          }
          
          // Check for partial matches (at least 3 characters to avoid false positives)
          if (workerSkillTrimmed.length >= 3 && jobSkillTrimmed.length >= 3) {
            if (workerSkillTrimmed.includes(jobSkillTrimmed.substring(0, 3)) || 
                jobSkillTrimmed.includes(workerSkillTrimmed.substring(0, 3))) {
              console.log(`Substring skill match: "${workerSkillTrimmed}" and "${jobSkillTrimmed}" share substrings`);
              return true;
            }
          }
        }
      }
      
      return false;
    };
    
    const hasMatchingProfession = (workerProfession: string, jobCategory?: string) => {
      if (!jobCategory || !workerProfession) {
        return false;
      }
      
      console.log(`Comparing worker profession: "${workerProfession}" with job category: "${jobCategory}"`);
      
      const workerProfessionLower = workerProfession.toLowerCase().trim();
      const jobCategoryLower = jobCategory.toLowerCase().trim();
      
      // Check for exact match
      if (workerProfessionLower === jobCategoryLower) {
        console.log(`Exact profession match: ${workerProfessionLower} = ${jobCategoryLower}`);
        return true;
      }
      
      // Check if profession contains category or vice versa
      if (workerProfessionLower.includes(jobCategoryLower) || jobCategoryLower.includes(workerProfessionLower)) {
        console.log(`Partial profession match: "${workerProfessionLower}" includes/is included in "${jobCategoryLower}"`);
        return true;
      }
      
      // Check for partial matches (at least 3 characters to avoid false positives)
      if (workerProfessionLower.length >= 3 && jobCategoryLower.length >= 3) {
        if (workerProfessionLower.includes(jobCategoryLower.substring(0, 3)) || 
            jobCategoryLower.includes(workerProfessionLower.substring(0, 3))) {
          console.log(`Substring profession match: "${workerProfessionLower}" and "${jobCategoryLower}" share substrings`);
          return true;
        }
      }
      
      return false;
    };
    
    // Filter workers with matching skills and send notifications
    for (const worker of workers) {
      if (!worker.user_id) {
        console.log(`Skipping worker ${worker.id} - no user_id`);
        continue;
      }
      
      const matchingSkill = hasMatchingSkill(worker.skills || [], skillsLower);
      const matchingProfession = category ? hasMatchingProfession(worker.profession, category) : false;
      
      console.log(`Checking worker ${worker.name || worker.id}:`);
      console.log(`  Skills match: ${matchingSkill}`);
      console.log(`  Profession match: ${matchingProfession}`);
      
      if (matchingSkill || matchingProfession) {
        console.log(`Match found for worker: ${worker.name || worker.id} (ID: ${worker.id})`);
        
        matchedWorkers.push(worker);
        
        try {
          // Insert notification into the database
          const message = isUpdate 
            ? `A job matching your skills was updated: ${jobTitle}` 
            : `New job posted that matches your skills: ${jobTitle}`;
            
          const notificationType = isUpdate ? 'job_updated' : 'new_job';
          
          const { data: notification, error: notifyError } = await supabaseClient
            .from("notifications")
            .insert([
              {
                user_id: worker.user_id,
                message: message,
                type: notificationType,
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
          
          // Send email notification if requested
          if (sendEmail) {
            try {
              await supabaseClient.functions.invoke("send-notification", {
                body: {
                  userId: worker.user_id,
                  message: message,
                  type: notificationType,
                  relatedId: jobId,
                  sendEmail: true
                }
              });
              console.log(`Email notification sent to worker ${worker.id}`);
            } catch (emailError) {
              console.error(`Error sending email to worker ${worker.id}:`, emailError);
            }
          }
          
          // Send SMS notification if requested
          if (sendSms) {
            try {
              await supabaseClient.functions.invoke("send-notification", {
                body: {
                  userId: worker.user_id,
                  message: message,
                  type: notificationType,
                  relatedId: jobId,
                  sendSms: true
                }
              });
              console.log(`SMS notification sent to worker ${worker.id}`);
            } catch (smsError) {
              console.error(`Error sending SMS to worker ${worker.id}:`, smsError);
            }
          }
        } catch (error) {
          console.error(`Error in notification process for worker ${worker.id}:`, error);
        }
      } else {
        console.log(`Worker ${worker.name || worker.id} (ID: ${worker.id}) does not match job requirements`);
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
