
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Policy</h1>
            
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Last Updated: June 1, 2023
              </p>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    We collect personal information (name, email, phone), professional details (skills, experience), and payment information when you register and use our services.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    We use your information to connect workers with clients, process payments, send notifications, and protect against fraud.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    You can access, update or delete your account information anytime by logging in or contacting our support team.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  If you have questions about this policy, please contact us:
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Email:</strong> privacy@hireease.com<br />
                  <strong>Phone:</strong> +91 80 2345 6789<br />
                  <strong>Address:</strong> 123 Brigade Road, Bengaluru, Karnataka 560001
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
