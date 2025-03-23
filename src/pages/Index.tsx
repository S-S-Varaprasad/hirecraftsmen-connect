
import React from "react";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AiChat from "@/components/AiChat";
import CategoryCard from "@/components/CategoryCard";
import { Bot, ChevronRight, Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <HeroSection />
        
        {/* Explore by Category Section */}
        <div className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Explore by Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find the perfect skilled worker for your specific needs from our wide range of professional categories
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <CategoryCard 
                icon="PaintBucket"
                title="Painter"
                description="Expert painters for interior and exterior home decoration."
                slug="painter"
              />
              
              <CategoryCard 
                icon="Hammer"
                title="Carpenter"
                description="Skilled woodworkers for furniture and custom projects."
                slug="carpenter"
              />
              
              <CategoryCard 
                icon="Wrench"
                title="Plumber"
                description="Professional plumbing services and repairs."
                slug="plumber"
              />
              
              <CategoryCard 
                icon="Zap"
                title="Electrician"
                description="Licensed electricians for all electrical work."
                slug="electrician"
              />
              
              <CategoryCard 
                icon="Settings"
                title="Mechanic"
                description="Expert vehicle and machinery repair services."
                slug="mechanic"
              />
              
              <CategoryCard 
                icon="Shield"
                title="Security Guard"
                description="Professional security services for events and properties."
                slug="security-guard"
              />
              
              <CategoryCard 
                icon="Utensils"
                title="Chef"
                description="Experienced chefs for restaurants and private events."
                slug="chef"
              />
              
              <CategoryCard 
                icon="Droplet"
                title="House Cleaner"
                description="Professional cleaning services for homes and offices."
                slug="cleaner"
              />
              
              <CategoryCard 
                icon="HardHat"
                title="Construction Worker"
                description="Skilled construction workers for building projects."
                slug="construction-worker"
              />
            </div>
            
            <div className="flex justify-center mt-12">
              <Link 
                to="/workers" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-blue-600 bg-white border border-blue-100 rounded-lg shadow-sm hover:bg-blue-50 transition-all duration-200"
              >
                View All Categories
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* AI Chat Assistant Section */}
        <div className="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl my-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
              <Bot className="h-6 w-6 text-orange-500" />
            </div>
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
            placeholder="Type your question here..."
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
