
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
            
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <p className="text-gray-600 dark:text-gray-400">
                Last Updated: June 1, 2023
              </p>
              
              <h2>Introduction</h2>
              <p>
                CraftConnect ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              
              <h2>Information We Collect</h2>
              <p>
                We collect information that you provide directly to us when you:
              </p>
              <ul>
                <li>Create an account or profile</li>
                <li>Complete forms on our website</li>
                <li>Communicate with us</li>
                <li>Post jobs or apply for jobs</li>
                <li>Leave reviews or feedback</li>
              </ul>
              
              <p>
                This information may include:
              </p>
              <ul>
                <li>Personal information (name, email address, phone number)</li>
                <li>Professional information (skills, experience, certifications)</li>
                <li>Payment information</li>
                <li>Communication preferences</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>
                We may use the information we collect for various purposes, including to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Connect workers with potential employers</li>
                <li>Process payments and transactions</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
              
              <h2>Information Sharing</h2>
              <p>
                We may share your information with:
              </p>
              <ul>
                <li>Other users as necessary to facilitate connections between workers and employers</li>
                <li>Service providers who perform services on our behalf</li>
                <li>Legal authorities when required by law or to protect our rights</li>
              </ul>
              
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is completely secure, so we cannot guarantee absolute security.
              </p>
              
              <h2>Your Choices</h2>
              <p>
                You can access, update, or delete your account information at any time by logging into your account. You may also contact us directly to request changes to or deletion of your information.
              </p>
              
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Email: privacy@craftconnect.com<br />
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

export default Privacy;
