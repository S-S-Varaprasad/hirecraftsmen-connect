
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, User, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { toast } from 'sonner';

// Mock data for messages demonstration - in a real app, this would come from a database
const sampleMessages = [
  {
    id: "1",
    senderId: "user1",
    text: "Hello, I'm interested in hiring you for a carpentry project.",
    timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: "2",
    senderId: "worker1",
    text: "Hi there! I'd be happy to discuss your project. What kind of carpentry work are you looking for?",
    timestamp: new Date(Date.now() - 82800000).toISOString() // 23 hours ago
  },
  {
    id: "3",
    senderId: "user1",
    text: "I need custom bookshelves built for my living room. About 10 feet wide and 8 feet tall. Would you be available next week?",
    timestamp: new Date(Date.now() - 79200000).toISOString() // 22 hours ago
  },
  {
    id: "4",
    senderId: "worker1",
    text: "That sounds like a great project! I would need to see the space. Could you share some pictures and dimensions? I have availability starting Wednesday next week.",
    timestamp: new Date(Date.now() - 75600000).toISOString() // 21 hours ago
  }
];

const MessageWorker = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getWorker } = useWorkerProfiles();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to send messages");
      navigate('/login');
      return;
    }

    if (id) {
      getWorker(id)
        .then(workerData => {
          setWorker(workerData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching worker details:', error);
          toast.error('Could not find worker profile');
          navigate('/workers');
        });
    }
  }, [id, user, navigate, getWorker]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // In a real app, this would send the message to the backend
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user1", // Current user ID would be used here
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate response in demo (would not exist in real app)
    setTimeout(() => {
      const responseMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: "worker1", // Worker ID
        text: "Thanks for your message! I'll get back to you as soon as possible.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
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
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <Button variant="ghost" className="p-2 mr-2" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center flex-1">
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarImage src={worker.image_url || '/placeholder.svg'} alt={worker.name} />
                  <AvatarFallback>{getInitials(worker.name)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="font-medium text-gray-900 dark:text-white">
                    {worker.name}
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {worker.profession}
                  </div>
                </div>
              </div>
              
              <div>
                <Button variant="outline" asChild>
                  <Link to={`/workers/${id}`}>View Profile</Link>
                </Button>
              </div>
            </div>
            
            {/* Messages Container */}
            <div className="h-[400px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg, index) => {
                const isCurrentUser = msg.senderId === "user1";
                
                return (
                  <div 
                    key={msg.id} 
                    className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isCurrentUser && (
                      <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
                        <AvatarImage src={worker.image_url || '/placeholder.svg'} alt={worker.name} />
                        <AvatarFallback>{getInitials(worker.name)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                      <div 
                        className={`p-3 rounded-lg ${
                          isCurrentUser 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                    
                    {isCurrentUser && (
                      <Avatar className="w-8 h-8 ml-2 flex-shrink-0">
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                          <User className="h-4 w-4 text-gray-500" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 mr-2"
                />
                <Button type="submit" disabled={!message.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
              <div className="text-xs text-center mt-2 text-gray-500">
                <Clock className="inline-block h-3 w-3 mr-1" />
                Typical response time: within 2 hours
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MessageWorker;
