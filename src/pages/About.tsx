
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col app-page-background">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About HireEase</h1>
              
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="mb-4">
                  HireEase is a platform that connects skilled workers with individuals and businesses looking for their services. 
                  Our mission is to empower the unorganized sector workforce by providing them with a digital presence and helping them find work opportunities.
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">Our Vision</h2>
                <p className="mb-4">
                  We envision a future where every skilled worker, regardless of their digital literacy, can access job opportunities 
                  and showcase their skills to potential clients across India. By bridging this gap, we aim to reduce unemployment 
                  and enhance livelihoods.
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">How It Works</h2>
                <p className="mb-4">
                  For workers, HireEase offers a simple platform to create a profile highlighting their skills, experience, and availability. 
                  Workers can be discovered by potential employers and receive job notifications that match their expertise.
                </p>
                <p className="mb-4">
                  For employers, HireEase provides access to a diverse pool of skilled professionals. Employers can post jobs, 
                  browse worker profiles, and connect directly with workers who meet their requirements.
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">Our Commitment</h2>
                <p className="mb-4">
                  HireEase is committed to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Promoting fair wages and working conditions</li>
                  <li>Ensuring transparency in the hiring process</li>
                  <li>Protecting user privacy and data security</li>
                  <li>Supporting workers in developing their skills and growing their businesses</li>
                  <li>Creating an inclusive platform that is accessible to all</li>
                </ul>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">Join Us</h2>
                <p className="mb-4">
                  Whether you're a skilled worker looking for opportunities or an employer in need of services, 
                  HireEase is here to help you connect. Join our growing community today and be a part of our mission 
                  to transform how work happens in India.
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

export default About;
