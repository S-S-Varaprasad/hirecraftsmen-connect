import React from "react";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AiChat from "@/components/AiChat";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <HeroSection />
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Get AI Assistance
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have questions about hiring skilled workers or need help with your job search? 
              Our AI assistant can provide guidance and answer your questions.
            </p>
          </div>
          
          <AiChat 
            title="Skilled Worker Assistant" 
            description="Ask questions about finding workers, job requirements, or get help with your job listing" 
            placeholder="E.g., What skills should I look for in a plumber? How do I write a good job description?"
          />
        </div>
        
        <div className="bg-orange-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Explore by Category</h2>
              <p className="text-gray-600 dark:text-gray-400">Find the perfect skilled worker for your specific needs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/search?searchTerm=Plumber">
                <Button className="w-full py-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md">
                  Plumbers
                </Button>
              </Link>
              <Link to="/search?searchTerm=Electrician">
                <Button className="w-full py-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md">
                  Electricians
                </Button>
              </Link>
              <Link to="/search?searchTerm=Carpenter">
                <Button className="w-full py-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md">
                  Carpenters
                </Button>
              </Link>
              <Link to="/search?searchTerm=Painter">
                <Button className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl shadow-md">
                  Painters
                </Button>
              </Link>
              <Link to="/search?searchTerm=Driver">
                <Button className="w-full py-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-xl shadow-md">
                  Drivers
                </Button>
              </Link>
              <Link to="/search">
                <Button className="w-full py-6 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl shadow-md">
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
