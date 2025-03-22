
import React from "react";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AiChat from "@/components/AiChat";
import { 
  Wrench, 
  Zap, 
  PaintBucket, 
  Users, 
  Truck, 
  BriefcaseBusiness, 
  Bot,
  Search
} from "lucide-react";

const CategoryCard = ({ 
  icon, 
  title, 
  color, 
  href 
}: { 
  icon: React.ReactNode; 
  title: string; 
  color: string; 
  href: string;
}) => (
  <Link 
    to={href}
    className={`relative group overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${color} h-full`}
  >
    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
    <div className="p-6 flex flex-col items-center text-center h-full">
      <div className="mb-4 p-3 bg-white/20 rounded-full">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-white">{title}</h3>
    </div>
  </Link>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <HeroSection />
        
        {/* Explore by Category Section */}
        <div className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-950">
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
                icon={<Wrench className="h-8 w-8 text-white" />}
                title="Plumbers"
                color="bg-gradient-to-br from-blue-500 to-blue-600"
                href="/search?searchTerm=Plumber"
              />
              
              <CategoryCard 
                icon={<Zap className="h-8 w-8 text-white" />}
                title="Electricians"
                color="bg-gradient-to-br from-green-500 to-green-600"
                href="/search?searchTerm=Electrician"
              />
              
              <CategoryCard 
                icon={<BriefcaseBusiness className="h-8 w-8 text-white" />}
                title="Carpenters"
                color="bg-gradient-to-br from-amber-500 to-amber-600"
                href="/search?searchTerm=Carpenter"
              />
              
              <CategoryCard 
                icon={<PaintBucket className="h-8 w-8 text-white" />}
                title="Painters"
                color="bg-gradient-to-br from-purple-500 to-purple-600"
                href="/search?searchTerm=Painter"
              />
              
              <CategoryCard 
                icon={<Truck className="h-8 w-8 text-white" />}
                title="Drivers"
                color="bg-gradient-to-br from-yellow-500 to-yellow-600"
                href="/search?searchTerm=Driver"
              />
              
              <CategoryCard 
                icon={<Search className="h-8 w-8 text-white" />}
                title="View All"
                color="bg-gradient-to-br from-gray-600 to-gray-700"
                href="/search"
              />
            </div>
            
            <div className="text-center mt-10">
              <Button 
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full px-8 py-6 h-auto"
              >
                <Link to="/search">
                  Browse All Categories
                </Link>
              </Button>
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
