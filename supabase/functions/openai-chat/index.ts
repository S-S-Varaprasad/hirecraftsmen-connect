
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, systemPrompt = "You are a helpful assistant. Provide concise and accurate information.", model = "gpt-4o-mini" } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing request with model: ${model}, prompt: ${prompt.substring(0, 50)}...`);
    
    // Check if OpenAI API key is available
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OpenAI API key is not set");
      throw new Error("OpenAI API key is not configured");
    }

    try {
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
      }

      const data = await openaiResponse.json();
      const response = data.choices[0].message.content;

      console.log("Response generated successfully");

      return new Response(
        JSON.stringify({ response }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("OpenAI API call failed:", error);
      
      // Return a generic response based on the prompt type
      let fallbackResponse = "";
      if (prompt.includes("subject line")) {
        fallbackResponse = "Interested in your job posting";
      } else if (prompt.includes("message to send to an employer")) {
        fallbackResponse = "Hello,\n\nI'm writing to express my interest in the position you've posted. My experience and skills align well with the requirements you've outlined, and I'm excited about the opportunity to contribute to your team.\n\nI'd appreciate the chance to discuss this position further and learn more about your specific needs. Please let me know if you require any additional information from me.\n\nThank you for your consideration.\n\nBest regards";
      } else {
        fallbackResponse = "Sorry, I couldn't generate a specific response at this time.";
      }
      
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in openai-chat function:", error);
    
    // Return a simple fallback response
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I couldn't generate a specific response at this time."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
