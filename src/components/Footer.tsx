
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">HireEase</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connecting skilled professionals with those who need their expertise. Build something great together.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                <strong>Address:</strong> 123 Brigade Road, Bengaluru, Karnataka 560001
              </li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                <strong>Phone:</strong> +91 80 2345 6789
              </li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                <strong>Email:</strong> info@hireease.com
              </li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                <strong>Hours:</strong> Mon-Sat: 9:00 AM - 6:00 PM
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-all">
                  Contact Page
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-all">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-all">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} HireEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
