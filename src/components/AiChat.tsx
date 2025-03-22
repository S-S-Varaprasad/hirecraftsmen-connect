
import React, { useState, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AiChatProps {
  title?: string;
  description?: string;
  placeholder?: string;
  systemPrompt?: string;
  suggestions?: string[];
}

const AiChat: React.FC<AiChatProps> = ({
  title = "Ask AI Assistant",
  description = "Get information or help with your questions",
  placeholder = "Type your question here...",
  systemPrompt = "You are a helpful assistant. Provide concise and accurate information.",
  suggestions = [
    "What skills should I look for in a plumber?",
    "How do I write a job description for an electrician?",
    "What's the average pay rate for carpenters in Delhi?",
    "What questions should I ask in an interview?",
    "How to verify the credentials of a skilled worker?",
    "Tips for hiring reliable domestic help",
  ]
}) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionClickedRef = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    
    // Filter suggestions based on input
    if (value.trim() !== "") {
      const filtered = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    
    // Set focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsLoading(true);
    setResponse("");
    setShowSuggestions(false);

    try {
      const { data, error } = await supabase.functions.invoke("openai-chat", {
        body: { prompt, systemPrompt },
      });

      if (error) {
        throw new Error(error.message || "Failed to get response");
      }

      setResponse(data.response);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder={placeholder}
              value={prompt}
              onChange={handleInputChange}
              onFocus={() => {
                if (prompt.trim() && filteredSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              className="min-h-[100px]"
            />
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Response...
              </>
            ) : (
              'Get Answer'
            )}
          </Button>
        </form>

        {response && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Response:</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiChat;
