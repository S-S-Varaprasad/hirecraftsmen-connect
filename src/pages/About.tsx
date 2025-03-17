
import React from 'react';
import { Users, ThumbsUp, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-orange-50/40 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-orange-100/80 to-transparent dark:from-orange-950/20 dark:to-transparent">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">About HireEase</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Bridging the gap between skilled workers and those who need them.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Our Mission</h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  At HireEase, we're dedicated to creating opportunities for skilled craftspeople 
                  while helping individuals and organizations find the perfect professionals for their projects.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  We believe in the value of craftsmanship and the importance of connecting talented 
                  workers with those who appreciate their skills. Our platform is designed to make 
                  these connections simple, transparent, and beneficial for everyone involved.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-orange-50/50 to-transparent dark:from-transparent dark:via-orange-950/10 dark:to-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Our Values</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-6">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Community</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We build meaningful connections between workers and employers, creating a vibrant community of professionals.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-6">
                  <ThumbsUp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quality</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We celebrate craftsmanship and skilled work, helping to connect those who value quality with those who provide it.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-6">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Reliability</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We believe in creating reliable connections that you can count on, with transparent information and availability.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Trust</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We foster trust between workers and employers through verified profiles, ratings, and reviews.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-t from-orange-50/70 to-transparent dark:from-orange-950/20 dark:to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary/90 to-primary rounded-xl shadow-xl overflow-hidden">
              <div className="px-6 py-12 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to connect with skilled professionals?
                </h2>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                  Join our community today and find the perfect craftsperson for your next project.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                    <Link to="/workers">Find Workers</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-join-worker border-white text-white hover:bg-blue-700" asChild>
                    <Link to="/join-as-worker">Join as a Worker</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto mt-16 text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Have Questions?</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                We're here to help. Contact our support team for assistance with anything related to HireEase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800/80" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button variant="ghost" className="hover:bg-gray-50 hover:text-primary dark:hover:bg-gray-800/80" asChild>
                  <Link to="/privacy">Privacy Policy</Link>
                </Button>
                <Button variant="ghost" className="hover:bg-gray-50 hover:text-primary dark:hover:bg-gray-800/80" asChild>
                  <Link to="/terms">Terms of Service</Link>
                </Button>
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
