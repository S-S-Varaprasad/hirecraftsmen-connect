
import React from 'react';
import { Users, ThumbsUp, Clock, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">About CraftConnect</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Bridging the gap between skilled workers and those who need them.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  At CraftConnect, we're dedicated to creating opportunities for skilled craftspeople 
                  while helping individuals and organizations find the perfect professionals for their projects.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  We believe in the value of craftsmanship and the importance of connecting talented 
                  workers with those who appreciate their skills. Our platform is designed to make 
                  these connections simple, transparent, and beneficial for everyone involved.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-radial from-primary/10 to-transparent opacity-70 blur-3xl"></div>
                <img 
                  src="/about-mission.jpg" 
                  alt="Craftspeople working together" 
                  className="rounded-lg shadow-2xl relative"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Our Values</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card animate-in">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Community</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We build meaningful connections between workers and employers, creating a vibrant community of professionals.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card animate-in">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Quality</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We celebrate craftsmanship and skilled work, helping to connect those who value quality with those who provide it.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card animate-in">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Reliability</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We believe in creating reliable connections that you can count on, with transparent information and availability.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card animate-in">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Trust</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We foster trust between workers and employers through verified profiles, ratings, and reviews.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Our Story</h2>
              <div className="prose dark:prose-invert prose-lg mx-auto">
                <p>
                  CraftConnect was founded in 2023 with a simple mission: to create meaningful 
                  connections between skilled craftspeople and those who need their expertise.
                </p>
                <p>
                  Our founder, having worked as both a contractor and a project manager, saw the 
                  disconnect between talented workers struggling to find consistent work and 
                  property owners desperate to find reliable, skilled help for their projects.
                </p>
                <p>
                  What started as a small local network has grown into a comprehensive platform 
                  serving communities across the country, helping thousands of skilled workers 
                  find opportunities and enabling countless projects to be completed successfully.
                </p>
                <p>
                  Today, CraftConnect continues to grow and evolve, always with our core mission 
                  in mind: to celebrate craftsmanship and create opportunities for skilled workers 
                  while helping individuals and organizations find the perfect professionals for their needs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
