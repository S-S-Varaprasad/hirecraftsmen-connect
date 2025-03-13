
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Terms of Service</h1>
            
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Last Updated: June 1, 2023
              </p>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Agreement to Terms</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    By accessing or using CraftConnect's website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Description of Service</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    CraftConnect provides an online platform that connects skilled workers with individuals and organizations seeking their services in Karnataka and across India.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">User Accounts</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    When you create an account, you must provide accurate information. You are responsible for safeguarding your password and for all activities under your account.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Prohibited Uses</h2>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Violating any applicable law or regulation</li>
                    <li>Sending unauthorized advertising</li>
                    <li>Impersonating another person</li>
                    <li>Interfering with others' use of the service</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    CraftConnect and its team shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the service.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  If you have any questions about these Terms, please contact us:
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Email:</strong> legal@craftconnect.com<br />
                  <strong>Phone:</strong> +91 80 2345 6789<br />
                  <strong>Address:</strong> 123 Craft Avenue, Bengaluru, Karnataka 560001
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

export default Terms;
