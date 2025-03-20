
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Phone, Mail, Send } from 'lucide-react';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ContactWorker = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();
  const { getWorker } = useWorkerProfiles();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [worker, setWorker] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    phone: ''
  });

  useEffect(() => {
    const fetchWorker = async () => {
      if (!workerId || !user) {
        toast.error("You must be logged in to contact workers");
        navigate('/login');
        return;
      }
      
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
  }, [workerId, getWorker, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !worker || !worker.user_id) {
      toast.error("Cannot send contact request");
      return;
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSending(true);
      
      // Create a notification for the worker
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: worker.user_id,
            message: `Contact request from ${user.email || user.id}: ${formData.subject}`,
            type: 'contact_request',
            related_id: user.id,
            additional_data: JSON.stringify({
              message: formData.message,
              phone: formData.phone || 'Not provided',
              fromEmail: user.email || 'No email'
            })
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      toast.success("Contact request sent successfully!");
      navigate(`/workers/${workerId}`);
    } catch (error: any) {
      console.error("Error sending contact request:", error);
      toast.error(error.message || "Failed to send contact request");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Contact {worker.name}</CardTitle>
              <CardDescription>
                Send a contact request to {worker.name} to discuss potential work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    placeholder="What's this about?" 
                    value={formData.subject} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Describe your requirements or project details"
                    rows={5}
                    value={formData.message} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (optional)</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="Your phone number for immediate contact"
                    value={formData.phone} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={sending}
                  >
                    {sending ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send Contact Request
                      </span>
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">About {worker.name}</h3>
                <p className="text-sm mb-1"><span className="font-semibold">Profession:</span> {worker.profession}</p>
                <p className="text-sm mb-1"><span className="font-semibold">Hourly Rate:</span> {worker.hourly_rate}</p>
                <p className="text-sm mb-1"><span className="font-semibold">Location:</span> {worker.location}</p>
                <p className="text-sm"><span className="font-semibold">Availability:</span> {worker.is_available ? 'Available Now' : 'Currently Unavailable'}</p>
              </div>
              
              <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                <p>The worker will receive your contact request and can get back to you shortly.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactWorker;
