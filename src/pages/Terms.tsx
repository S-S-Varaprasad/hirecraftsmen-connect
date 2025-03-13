
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>
            
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <p className="text-gray-600 dark:text-gray-400">
                Last Updated: June 1, 2023
              </p>
              
              <h2>Agreement to Terms</h2>
              <p>
                By accessing or using CraftConnect's website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
              </p>
              
              <h2>Description of Service</h2>
              <p>
                CraftConnect provides an online platform that connects skilled workers with individuals and organizations seeking their services. Our platform allows workers to create profiles showcasing their skills and experience, and allows employers to post jobs and search for qualified professionals.
              </p>
              
              <h2>User Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              
              <p>
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
              </p>
              
              <h2>User Content</h2>
              <p>
                Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content you post, including its legality, reliability, and appropriateness.
              </p>
              
              <p>
                By posting content, you grant CraftConnect a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media.
              </p>
              
              <h2>Prohibited Uses</h2>
              <p>
                You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service:
              </p>
              <ul>
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior consent</li>
                <li>To impersonate or attempt to impersonate another user or person</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service</li>
              </ul>
              
              <h2>Fees and Payment</h2>
              <p>
                Some aspects of the service may be offered for a fee. You agree to pay all fees associated with your use of the service. We may modify the fees at any time upon notice to you.
              </p>
              
              <h2>Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              
              <h2>Limitation of Liability</h2>
              <p>
                In no event shall CraftConnect, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
              
              <h2>Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of significant changes to the Terms by posting a notice on our website.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Email: legal@craftconnect.com<br />
                Phone: +1 (800) 123-4567<br />
                Address: 123 Craft Avenue, San Francisco, CA 94103
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
