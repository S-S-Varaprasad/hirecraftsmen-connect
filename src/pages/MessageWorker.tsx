import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, ArrowLeft, Paperclip, Image, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const workerData = {
  '1': {
    id: '1',
    name: 'Rajesh Kumar',
    profession: 'Master Carpenter',
    location: 'Bengaluru, Karnataka',
    imageUrl: '/lovable-uploads/ad12a288-99e5-40cc-9fd9-6b749d86ef72.png',
  },
  '2': {
    id: '2',
    name: 'Priya Sharma',
    profession: 'Electrician',
    location: 'Mysuru, Karnataka',
    imageUrl: '/lovable-uploads/eaac9fe5-7bbf-4230-8d24-39cc8b06a181.png',
  },
  '3': {
    id: '3',
    name: 'Mohammed Ali',
    profession: 'Plumber',
    location: 'Mangaluru, Karnataka',
    imageUrl: '/lovable-uploads/a518f4b7-7466-4a3e-8a41-30b09ed4af12.png',
  },
  '4': {
    id: '4',
    name: 'Anjali Desai',
    profession: 'Interior Designer',
    location: 'Hubballi, Karnataka',
    imageUrl: '/lovable-uploads/76bf7a4e-88ba-4937-836f-334f4c3080e9.png',
  },
  '5': {
    id: '5',
    name: 'Ravi Verma',
    profession: 'Chef',
    location: 'Belagavi, Karnataka',
    imageUrl: '/lovable-uploads/490b07e5-a79e-4584-a48b-d5664014ced2.png',
  },
  '6': {
    id: '6',
    name: 'Deepak Shetty',
    profession: 'Security Guard',
    location: 'Bengaluru, Karnataka',
    imageUrl: '/lovable-uploads/ce356fe1-2b40-4126-88b9-9cb06dea72a3.png',
  },
  '7': {
    id: '7',
    name: 'Aisha Khan',
    profession: 'Mason',
    location: 'Mangaluru, Karnataka',
    imageUrl: '/lovable-uploads/0e1f03a1-4278-4ef2-b427-22b6048ce642.png',
  },
  '8': {
    id: '8',
    name: 'Vikram Reddy',
    profession: 'Mechanic',
    location: 'Mysuru, Karnataka',
    imageUrl: '/lovable-uploads/40353383-4a09-47f7-8c4b-7e93a4c84800.png',
  },
  '9': {
    id: '9',
    name: 'Sunil Patil',
    profession: 'Painter',
    location: 'Bengaluru, Karnataka',
    imageUrl: '/lovable-uploads/b364ee52-a4f0-44ff-90f5-9d5ec2dfa3ac.png',
  },
  '10': {
    id: '10',
    name: 'Kiran Prakash',
    profession: 'Gardener',
    location: 'Dharwad, Karnataka',
    imageUrl: '/lovable-uploads/f46a222d-df5e-43a5-bff6-deed65ae3b15.png',
  },
  '11': {
    id: '11',
    name: 'Sanjay Rao',
    profession: 'Tailor',
    location: 'Bellary, Karnataka',
    imageUrl: '/lovable-uploads/a518f4b7-7466-4a3e-8a41-30b09ed4af12.png',
  },
  '12': {
    id: '12',
    name: 'Lakshmi Devi',
    profession: 'Housekeeper',
    location: 'Bengaluru, Karnataka',
    imageUrl: '/lovable-uploads/eaac9fe5-7bbf-4230-8d24-39cc8b06a181.png',
  },
  '13': {
    id: '13',
    name: 'Ramesh Gowda',
    profession: 'Farmer',
    location: 'Tumkur, Karnataka',
    imageUrl: '/lovable-uploads/f46a222d-df5e-43a5-bff6-deed65ae3b15.png',
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
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
    
    setMessages([
      ...messages,
      {
        id: Date.now(),
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      }
    ]);
    
    setMessage('');
    
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
      
      <main className="flex-grow pt-24 pb-16 bg-orange-50/40 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <Link to={`/workers/${worker.id}`} className="mr-4">
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              
              <div className="flex-shrink-0 mr-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage 
                    src={worker.imageUrl || '/placeholder.svg'} 
                    alt={worker.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(worker.name)}
                  </AvatarFallback>
                </Avatar>
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
            
            <div className="p-4 h-[400px] overflow-y-auto flex flex-col space-y-4">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <Send className="h-8 w-8 text-primary dark:text-primary/90" />
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
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
