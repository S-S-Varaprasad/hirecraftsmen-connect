
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
    
    switch (fieldType) {
      case 'message':
        systemPrompt += " Generate a professional message to send to an employer about a job.";
        userPrompt = `Generate a professional message to send to an employer regarding their job post for ${contextData?.title || 'this position'}. The message should express interest, highlight relevant skills, and inquire about the opportunity. Keep it under 200 words, professional, and friendly.`;
        break;
        
      case 'subject':
        systemPrompt += " Generate a clear and concise email subject line.";
        userPrompt = `Generate a professional subject line for an email regarding the job post for ${contextData?.title || 'this position'}. Keep it under 10 words, clear, and relevant.`;
        break;
        
      case 'description':
        systemPrompt += " Generate detailed and informative descriptions.";
        userPrompt = `Generate a description for ${contextData?.context || 'this item'}. Make it informative, detailed, and well-structured.`;
        break;
        
      case 'email':
        systemPrompt += " Generate professional email templates.";
        userPrompt = `Generate a professional email template for ${contextData?.purpose || 'business communication'}. Include appropriate greeting, body, and closing.`;
        break;
        
      default:
        userPrompt = `Generate appropriate text for a ${fieldType} field related to ${contextData?.context || 'this context'}.`;
    }
    
    return { systemPrompt, userPrompt };
  };
  
  const generateSuggestion = async () => {
    setIsGenerating(true);
    
    try {
      const { systemPrompt, userPrompt } = generatePrompt();
      
      const { data, error } = await supabase.functions.invoke("openai-chat", {
        body: { 
          prompt: userPrompt,
          systemPrompt: systemPrompt
        },
      });
      
      if (error) {
        throw new Error(error.message || "Failed to generate suggestion");
      }
      
      onSuggestionSelect(data.response);
      toast.success("AI suggestion added");
    } catch (error) {
      console.error("Error generating suggestion:", error);
      toast.error("Failed to generate suggestion. Please try again.");
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
