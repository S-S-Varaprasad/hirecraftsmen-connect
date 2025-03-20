
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getWorkerById } from '@/services/workerService';
import { createNotification } from '@/services/notificationService';
import { toast } from 'sonner';

// Define the Message interface
interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

const MessageWorker = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchWorkerAndMessages = async () => {
      if (!workerId) return;
      
      try {
        const workerData = await getWorkerById(workerId);
        setWorker(workerData);
        
        // Since we don't have a messages table yet, we'll use notifications as messages
        // This is a temporary solution
        const mockMessages: Message[] = [
          {
            id: '1',
            sender_id: user?.id || '',
            receiver_id: workerId,
            content: 'Hello, are you available for work next week?',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            is_read: true
          },
          {
            id: '2',
            sender_id: workerId,
            receiver_id: user?.id || '',
            content: 'Yes, I am available. What kind of work do you need done?',
            timestamp: new Date(Date.now() - 3000000).toISOString(),
            is_read: true
          }
        ];
        
        setMessages(mockMessages);
        setLoading(false);
        
        // Scroll to bottom of messages
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching worker or messages:', error);
        toast.error('Failed to load conversation');
        navigate('/workers');
      }
    };
    
    fetchWorkerAndMessages();
  }, [workerId, user, navigate]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !worker) return;
    
    try {
      setSending(true);
      
      // Create a new message object
      const message: Message = {
        id: Date.now().toString(),
        sender_id: user.id || '',
        receiver_id: workerId || '',
        content: newMessage,
        timestamp: new Date().toISOString(),
        is_read: false
      };
      
      // Add to local messages
      setMessages([...messages, message]);
      
      // Clear input
      setNewMessage('');
      
      // Create a notification for the worker (this is our temporary messaging solution)
      if (worker.user_id) {
        await createNotification(
          worker.user_id,
          `New message from ${user.email}: ${newMessage}`,
          'message',
          user.id
        );
        
        toast.success('Message sent');
      } else {
        // If the worker doesn't have a user account
        toast.info('Message sent (demo only)');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="border-b">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={worker?.image_url || ''} alt={worker?.name} />
                  <AvatarFallback>{worker ? getInitials(worker.name) : 'W'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{worker?.name}</CardTitle>
                  <CardDescription>{worker?.profession}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="h-[400px] overflow-y-auto p-4 flex flex-col space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === user?.id 
                          ? 'text-primary-foreground/70' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t flex gap-2">
                <Textarea 
                  placeholder="Type your message here..." 
                  className="flex-1 min-h-[60px]" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim() || sending}
                  className="self-end"
                >
                  {sending ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MessageWorker;
