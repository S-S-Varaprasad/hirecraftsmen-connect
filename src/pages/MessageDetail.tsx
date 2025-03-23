
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MessageDetail = () => {
  const { messageId } = useParams<{ messageId: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-4"
              onClick={() => navigate('/messages')}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Messages</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Message Detail</h1>
              <p className="text-muted-foreground">Message ID: {messageId}</p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Message Content</CardTitle>
              <CardDescription>
                View message details and conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  This page is coming soon. We're working on implementing the full messaging functionality.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => navigate('/messages')}>
                    Back to Messages
                  </Button>
                  <Button onClick={() => navigate('/')}>
                    Return to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MessageDetail;
