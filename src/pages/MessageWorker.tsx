
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { useAuth } from '@/context/AuthContext';
import { Worker } from '@/services/workerService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

const MessageWorker = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();
  const { getWorker } = useWorkerProfiles();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchWorker = async () => {
      if (!workerId) return;
      
      try {
        const workerData = await getWorker(workerId);
        setWorker(workerData);
      } catch (error) {
        console.error("Error fetching worker:", error);
        toast.error("Could not load worker profile");
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [workerId, getWorker]);

  useEffect(() => {
    if (!user || !workerId) return;

    // Subscribe to messages between current user and worker
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .or(`sender_id.eq.${worker?.user_id},receiver_id.eq.${worker?.user_id}`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${user.id},receiver_id=eq.${worker?.user_id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, workerId, worker?.user_id]);

  const handleSendMessage = async () => {
    if (!user || !worker || !worker.user_id || !newMessage.trim()) return;

    try {
      setSending(true);
      
      // In a real app, you would insert the message to a messages table
      // For now, we'll simulate sending a notification to the worker
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: worker.user_id,
            message: `New message from ${user.email}: ${newMessage.substring(0, 30)}${newMessage.length > 30 ? '...' : ''}`,
            type: 'message',
            related_id: user.id
          }
        ])
        .select();

      if (error) throw error;

      // In a real app with a messages table:
      // const { data, error } = await supabase
      //   .from('messages')
      //   .insert([
      //     {
      //       sender_id: user.id,
      //       receiver_id: worker.user_id,
      //       content: newMessage,
      //       is_read: false
      //     }
      //   ])
      //   .select();

      toast.success("Message sent successfully");
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-orange"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Worker Not Found</h2>
            <Button onClick={() => navigate('/workers')}>Back to Workers</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(`/workers/${workerId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Button>
          
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={worker.image_url || ''} alt={worker.name} />
                  <AvatarFallback className="bg-app-orange text-white">
                    {worker.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>Message {worker.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender_id === user?.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="resize-none"
                />
                <Button 
                  variant="default" 
                  size="icon" 
                  className="h-auto aspect-square" 
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-6">
                <h3 className="font-medium mb-2">About {worker.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Profession:</span> {worker.profession}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Location:</span> {worker.location}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Hourly Rate:</span> {worker.hourly_rate}
                </p>
              </div>
              
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                <p>This is a direct message to {worker.name}. Be respectful and clear in your communication.</p>
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
