
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
    
    // Extract job details for more focused content
    const jobTitle = contextData?.title || 'this position';
    const jobCompany = contextData?.company || 'the company';
    const jobRole = extractJobRole(jobTitle);
    
    switch (fieldType) {
      case 'message':
        systemPrompt += " Generate a professional message focusing on job role skills and experience.";
        userPrompt = `Generate a professional message for a ${jobRole || jobTitle} position at ${jobCompany}.`;
        userPrompt += ` Focus primarily on the ${jobRole || jobTitle} skills and relevant experience. Keep it under 200 words, professional, and concise.`;
        break;
        
      case 'subject':
        systemPrompt += " Generate a clear and concise email subject line focusing on the job role.";
        userPrompt = `Generate a professional subject line for an application to the ${jobRole || jobTitle} position at ${jobCompany}.`;
        userPrompt += ` Keep it under 10 words, clear, and highlight the ${jobRole || jobTitle} focus.`;
        break;
        
      case 'description':
        systemPrompt += " Generate detailed job role descriptions.";
        userPrompt = `Generate a description for a ${jobRole || jobTitle} position. Focus on specific ${jobRole || jobTitle} skills and responsibilities.`;
        break;
        
      case 'email':
        systemPrompt += " Generate professional email templates.";
        userPrompt = `Generate a professional email for a ${jobRole || jobTitle} position application at ${jobCompany}.`;
        userPrompt += ` Focus on ${jobRole || jobTitle}-specific skills and experience.`;
        break;
        
      default:
        userPrompt = `Generate appropriate text for a ${fieldType} field related to a ${jobRole || jobTitle} position.`;
    }
    
    return { systemPrompt, userPrompt };
  };
  
  // Helper function to extract job role from title
  const extractJobRole = (title: string): string => {
    if (!title) return "";
    
    const commonRoles = [
      "Carpenter", "Plumber", "Electrician", "Painter", "Mason", 
      "Mechanic", "Driver", "Chef", "Cleaner", "Security Guard", 
      "Gardener", "Tailor", "Construction Worker", "Welder", 
      "HVAC Technician", "Roofer", "Landscaper", "Handyman"
    ];
    
    const lowerTitle = title.toLowerCase();
    for (const role of commonRoles) {
      if (lowerTitle.includes(role.toLowerCase())) {
        return role;
      }
    }
    
    return "";
  };
  
  const generateSuggestion = async () => {
    setIsGenerating(true);
    
    try {
      const { systemPrompt, userPrompt } = generatePrompt();
      
      console.log("Generating suggestion for:", fieldType);
      console.log("System prompt:", systemPrompt);
      console.log("User prompt:", userPrompt);
      
      // Generate fallback text based on job role
      const jobRole = extractJobRole(contextData?.title || '') || 'skilled worker';
      const company = contextData?.company || 'your company';
      
      let fallbackText = "";
      if (fieldType === 'message') {
        fallbackText = `Hello,\n\nI'm writing to express my interest in the ${jobRole} position at ${company}. I have experience and skills in ${jobRole} work, including all the typical responsibilities this role requires.\n\nI'm reliable, punctual, and take pride in quality workmanship. I would appreciate the opportunity to discuss how my specific ${jobRole} skills can benefit your project or team.\n\nThank you for your consideration.\n\nBest regards`;
      } else if (fieldType === 'subject') {
        fallbackText = `Experienced ${jobRole} interested in your position at ${company}`;
      }
      
      const { data, error } = await supabase.functions.invoke("openai-chat", {
        body: { 
          prompt: userPrompt,
          systemPrompt: systemPrompt,
          model: "gpt-4o-mini",
          contextData: {
            ...contextData,
            jobRole: extractJobRole(contextData?.title || '')
          }
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
      if (fieldType === 'message' || fieldType === 'subject') {
        const jobRole = extractJobRole(contextData?.title || '') || 'skilled worker';
        const company = contextData?.company || 'your company';
        
        let fallbackText = "";
        if (fieldType === 'message') {
          fallbackText = `Hello,\n\nI'm writing to express my interest in the ${jobRole} position at ${company}. I have experience and skills in ${jobRole} work, including all the typical responsibilities this role requires.\n\nI'm reliable, punctual, and take pride in quality workmanship. I would appreciate the opportunity to discuss how my specific ${jobRole} skills can benefit your project or team.\n\nThank you for your consideration.\n\nBest regards`;
        } else if (fieldType === 'subject') {
          fallbackText = `Experienced ${jobRole} interested in your position at ${company}`;
        }
        
        onSuggestionSelect(fallbackText);
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
