
import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AiTextSuggestionProps {
  fieldType: 'message' | 'subject' | 'description' | 'email' | 'general';
  contextData?: any;
  onSuggestionSelect: (suggestion: string) => void;
}

const AiTextSuggestion: React.FC<AiTextSuggestionProps> = ({
  fieldType,
  contextData,
  onSuggestionSelect,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePrompt = () => {
    let systemPrompt = "You are a helpful assistant that generates professional and concise text for form fields.";
    let userPrompt = "";
    
    // Extract job and worker details for more personalized content
    const jobTitle = contextData?.title || 'this position';
    const jobCompany = contextData?.company || 'the company';
    const jobLocation = contextData?.location || 'the location';
    const jobSkills = contextData?.skills ? contextData.skills.join(', ') : 'the required skills';
    const workerName = contextData?.workerName || '';
    const workerProfession = contextData?.profession || '';
    const workerExperience = contextData?.experience || '';
    
    switch (fieldType) {
      case 'message':
        systemPrompt += " Generate a professional message to send to an employer about a job.";
        userPrompt = `Generate a professional message to send to an employer regarding their job post for ${jobTitle} at ${jobCompany} in ${jobLocation}.`;
        
        if (jobSkills) {
          userPrompt += ` The job requires skills in ${jobSkills}.`;
        }
        
        if (workerName && workerProfession) {
          userPrompt += ` As ${workerName}, a ${workerProfession} with ${workerExperience} experience, I want to express my interest.`;
        }
        
        userPrompt += ` The message should express interest, highlight relevant skills, and inquire about the opportunity. Keep it under 200 words, professional, and friendly.`;
        break;
        
      case 'subject':
        systemPrompt += " Generate a clear and concise email subject line.";
        userPrompt = `Generate a professional subject line for an email regarding the job post for ${jobTitle} at ${jobCompany}.`;
        
        if (workerProfession) {
          userPrompt += ` The applicant is a ${workerProfession} with ${workerExperience} experience.`;
        }
        
        userPrompt += ` Keep it under 10 words, clear, and relevant.`;
        break;
        
      case 'description':
        systemPrompt += " Generate detailed and informative descriptions.";
        userPrompt = `Generate a description for ${contextData?.context || 'this item'}. Make it informative, detailed, and well-structured.`;
        if (contextData?.skills) {
          userPrompt += ` Include these keywords: ${contextData.skills.join(', ')}.`;
        }
        break;
        
      case 'email':
        systemPrompt += " Generate professional email templates.";
        userPrompt = `Generate a professional email template for ${contextData?.purpose || 'business communication'}.`;
        
        if (jobTitle && jobCompany) {
          userPrompt += ` This is regarding the ${jobTitle} position at ${jobCompany}.`;
        }
        
        if (workerName && workerProfession) {
          userPrompt += ` The sender is ${workerName}, a ${workerProfession} with ${workerExperience} experience.`;
        }
        
        userPrompt += ` Include appropriate greeting, body, and closing.`;
        break;
        
      default:
        userPrompt = `Generate appropriate text for a ${fieldType} field related to ${contextData?.context || 'this context'}.`;
        if (contextData?.skills) {
          userPrompt += ` Include references to: ${contextData.skills.join(', ')}.`;
        }
    }
    
    return { systemPrompt, userPrompt };
  };
  
  const generateSuggestion = async () => {
    setIsGenerating(true);
    
    try {
      const { systemPrompt, userPrompt } = generatePrompt();
      
      console.log("Generating suggestion for:", fieldType);
      console.log("System prompt:", systemPrompt);
      console.log("User prompt:", userPrompt);
      
      // Add fallback text in case API fails
      let fallbackText = "";
      if (fieldType === 'message') {
        const jobTitle = contextData?.title || 'position';
        const company = contextData?.company || 'company';
        fallbackText = `Hello,\n\nI'm writing to express my interest in the ${jobTitle} at ${company} you've posted. My experience and skills align well with the requirements you've outlined, and I'm excited about the opportunity to contribute to your team.\n\nI'd appreciate the chance to discuss this position further and learn more about your specific needs. Please let me know if you require any additional information from me.\n\nThank you for your consideration.\n\nBest regards`;
      } else if (fieldType === 'subject') {
        const jobTitle = contextData?.title || 'job';
        const company = contextData?.company || '';
        fallbackText = `Interested in your ${jobTitle} ${company ? 'at ' + company : 'posting'}`;
      }
      
      const { data, error } = await supabase.functions.invoke("openai-chat", {
        body: { 
          prompt: userPrompt,
          systemPrompt: systemPrompt,
          model: "gpt-4o-mini", // Ensure the model is specified
          contextData: contextData // Pass the context data to the edge function
        },
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to generate suggestion");
      }
      
      if (!data || !data.response) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response from AI service");
      }
      
      onSuggestionSelect(data.response);
      toast.success("AI suggestion added");
    } catch (error: any) {
      console.error("Error generating suggestion:", error);
      
      // Use fallback text if API fails
      if (fieldType === 'message') {
        const jobTitle = contextData?.title || 'position';
        const company = contextData?.company || 'company';
        const fallbackMessage = `Hello,\n\nI'm writing to express my interest in the ${jobTitle} at ${company} you've posted. My experience and skills align well with the requirements you've outlined, and I'm excited about the opportunity to contribute to your team.\n\nI'd appreciate the chance to discuss this position further and learn more about your specific needs. Please let me know if you require any additional information from me.\n\nThank you for your consideration.\n\nBest regards`;
        
        onSuggestionSelect(fallbackMessage);
        toast.success("AI suggestion added (using local template)");
      } else if (fieldType === 'subject') {
        const jobTitle = contextData?.title || 'job';
        const company = contextData?.company || '';
        const fallbackSubject = `Interested in your ${jobTitle} ${company ? 'at ' + company : 'posting'}`;
        
        onSuggestionSelect(fallbackSubject);
        toast.success("AI suggestion added (using local template)");
      } else {
        toast.error("Failed to generate suggestion. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={generateSuggestion}
      disabled={isGenerating}
      className="h-8 flex items-center gap-1 text-xs"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="h-3 w-3" />
          AI Suggest
        </>
      )}
    </Button>
  );
};

export default AiTextSuggestion;
