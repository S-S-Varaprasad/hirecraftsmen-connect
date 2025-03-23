
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, User, Bot, Wand2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    
    // Focus back to textarea after selection
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const generateSuggestion = async () => {
    if (isGeneratingSuggestion) return;
    
    setIsGeneratingSuggestion(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("openai-chat", {
        body: { 
          prompt: "Generate a thoughtful question to ask about hiring skilled workers or finding jobs. Make it specific, concise and under 100 characters. Respond with only the question text.",
          systemPrompt: "You are a helpful assistant that creates concise, relevant queries about employment, hiring, and skilled labor."
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to generate suggestion");
      }

      setPrompt(data.response);
    } catch (error) {
      console.error("Error generating suggestion:", error);
      toast.error("Failed to generate a suggestion");
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  // Handle clicks outside the suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        textareaRef.current && 
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsLoading(true);
    setShowSuggestions(false);
    
    // Add user message to chat
    const userMessage = prompt.trim();
    setMessages(prev => [...prev, {type: 'user', content: userMessage}]);
    setPrompt("");

    try {
      const { data, error } = await supabase.functions.invoke("openai-chat", {
        body: { prompt: userMessage, systemPrompt },
      });

      if (error) {
        throw new Error(error.message || "Failed to get response");
      }

      // Add AI response to chat
      setMessages(prev => [...prev, {type: 'ai', content: data.response}]);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-gray-200 dark:border-gray-700">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-orange-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Chat messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>Ask me anything about finding workers or jobs!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.type === 'ai' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {message.type === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative mb-2">
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
                className="pr-12 min-h-[80px] resize-none"
                disabled={isLoading}
              />
              
              <Button 
                type="submit" 
                size="sm"
                disabled={isLoading || !prompt.trim()}
                className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSuggestion}
                disabled={isGeneratingSuggestion || isLoading}
                className="h-8 flex items-center gap-1 text-xs"
              >
                {isGeneratingSuggestion ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3 w-3" />
                    AI Suggest Question
                  </>
                )}
              </Button>
            </div>
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur before click
                      handleSuggestionClick(suggestion);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </form>
          
          {/* Suggestion chips */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.slice(0, 4).map((suggestion, index) => (
                <div
                  key={index}
                  className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full px-3 py-1 cursor-pointer transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiChat;
