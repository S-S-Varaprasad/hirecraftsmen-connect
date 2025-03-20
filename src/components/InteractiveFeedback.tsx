
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface InteractiveFeedbackProps {
  pageId: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  compact?: boolean;
}

const InteractiveFeedback: React.FC<InteractiveFeedbackProps> = ({ 
  pageId, 
  position = 'bottom-right',
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { user } = useAuth();
  
  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };
  
  // Randomly decide to show after 45 seconds, but only once per session
  useEffect(() => {
    if (compact || dismissed) return;
    
    const timer = setTimeout(() => {
      const shouldShow = Math.random() > 0.7; // 30% chance to show
      if (shouldShow) {
        setIsOpen(true);
      }
    }, 45000);
    
    return () => clearTimeout(timer);
  }, [compact, dismissed]);
  
  const submitFeedback = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    
    try {
      // Save feedback to Supabase if available
      const { error } = await supabase
        .from('feedback')
        .insert({
          page_id: pageId,
          rating: rating === 'positive' ? 1 : -1,
          comment: feedback,
          user_id: user?.id || null
        });
      
      if (error) throw error;
      
      toast.success('Thank you for your feedback!');
      setIsOpen(false);
      setDismissed(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Still thank the user even if it fails to save
      toast.success('Thank you for your feedback!');
      setIsOpen(false);
      setDismissed(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Close without submitting
  const handleClose = () => {
    setIsOpen(false);
    setDismissed(true);
  };
  
  if (!isOpen && compact) {
    return (
      <motion.div 
        className={`fixed ${positionClasses[position]} z-40`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full h-12 w-12 shadow-lg bg-primary text-white hover:bg-primary/90"
          aria-label="Give feedback"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={`fixed ${positionClasses[position]} z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden p-4`}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">How is your experience?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your feedback helps us improve.</p>
          </div>
          
          <div className="flex justify-center space-x-4 mb-4">
            <Button
              variant={rating === 'positive' ? 'default' : 'outline'}
              onClick={() => setRating('positive')}
              className="flex-1"
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              Good
            </Button>
            <Button
              variant={rating === 'negative' ? 'default' : 'outline'}
              onClick={() => setRating('negative')}
              className="flex-1"
            >
              <ThumbsDown className="h-5 w-5 mr-2" />
              Not Good
            </Button>
          </div>
          
          {rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Textarea
                placeholder="Tell us more about your experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mb-4 resize-none"
                rows={3}
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={submitFeedback} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InteractiveFeedback;
