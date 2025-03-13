
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, ArrowLeft, Paperclip, Image, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Sample data - in a real app, this would come from an API
const workerData = {
  '1': {
    id: '1',
    name: 'Rajesh Kumar',
    profession: 'Master Carpenter',
    location: 'Bengaluru, Karnataka',
    imageUrl: '/lovable-uploads/b2aa6fb3-3f41-46f1-81ea-37ea94ae8af3.png',
  },
  '2': {
    id: '2',
    name: 'Priya Sharma',
    profession: 'Electrician',
    location: 'Mysuru, Karnataka',
    imageUrl: '/lovable-uploads/b680b077-f224-42f8-a2d3-95b48ba6e0eb.png',
  },
  '3': {
    id: '3',
    name: 'Mohammed Ali',
    profession: 'Plumber',
    location: 'Mangaluru, Karnataka',
    imageUrl: '/lovable-uploads/f5bdc72f-cebf-457f-a3f5-46334ba5cb06.png',
  }
};

const MessageWorker = () => {
  const { id } = useParams<{ id: string }>();
  const worker = id ? workerData[id as keyof typeof workerData] : null;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">Worker not found</h1>
            <p className="mt-4">The worker you're trying to message doesn't exist.</p>
            <Button className="mt-8" asChild>
              <Link to="/workers">Browse All Workers</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    // Add message to the conversation
    setMessages([
      ...messages,
      {
        id: Date.now(),
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Clear the input
    setMessage('');
    
    // Simulate a reply (in a real app, this would come from the backend)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + 1,
          content: `Thank you for your message. I'll get back to you as soon as possible.`,
          sender: 'worker',
          timestamp: new Date().toISOString()
        }
      ]);
    }, 1000);
    
    toast.success("Message sent!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            {/* Chat Header */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <Link to={`/workers/${worker.id}`} className="mr-4">
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              
              <div className="flex-shrink-0 mr-3">
                <img 
                  src={worker.imageUrl || '/placeholder.svg'} 
                  alt={worker.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              
              <div>
                <h2 className="font-medium text-gray-900 dark:text-white">{worker.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{worker.profession}</p>
              </div>
              
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Call
                </Button>
                <Button variant="default" size="sm" className="hidden md:flex" asChild>
                  <Link to={`/workers/${worker.id}`}>View Profile</Link>
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="p-4 h-[400px] overflow-y-auto flex flex-col space-y-4">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Send className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Start a conversation with {worker.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Send a message to discuss your project requirements, availability, or any questions you might have.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[80px]"
                    placeholder={`Message ${worker.name}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="absolute right-2 bottom-2 flex">
                    <Button variant="ghost" size="sm" type="button" className="rounded-full p-2">
                      <Paperclip className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" type="button" className="rounded-full p-2">
                      <Image className="h-5 w-5 text-gray-500" />
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="bg-[#F97316] hover:bg-[#EA580C]">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MessageWorker;
