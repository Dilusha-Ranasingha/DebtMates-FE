import { useState } from 'react';

const Footer = () => {
  const [hoverStates, setHoverStates] = useState({
    features: false,
    resources: false,
    company: false
  });

  const toggleHover = (section, isHovered) => {
    setHoverStates(prev => ({
      ...prev,
      [section]: isHovered
    }));
  };

  return (
    <footer className="bg-[#0f111a] text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="transform transition-all duration-300 hover:translate-y-[-5px]">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-4">DebtMates</h3>
            <p className="mb-4 text-gray-400">Your partner in financial freedom.</p>
            <div className="flex space-x-4 mt-6">
              {/* Social Media Icons */}
              <a href="#" className="w-10 h-10 rounded-full bg-[#1a1d2a] flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1a1d2a] flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1a1d2a] flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div 
            className={`transition-all duration-300 ${hoverStates.features ? 'transform -translate-y-1' : ''}`}
            onMouseEnter={() => toggleHover('features', true)}
            onMouseLeave={() => toggleHover('features', false)}
          >
            <h4 className="text-lg font-semibold text-white mb-4 relative">
              Features
              <span className={`absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500 transition-all duration-300 ${hoverStates.features ? 'w-20' : ''}`}></span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Debt Tracking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Payment Reminders
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Payoff Strategies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Financial Reports
                </a>
              </li>
            </ul>
          </div>

          <div 
            className={`transition-all duration-300 ${hoverStates.resources ? 'transform -translate-y-1' : ''}`}
            onMouseEnter={() => toggleHover('resources', true)}
            onMouseLeave={() => toggleHover('resources', false)}
          >
            <h4 className="text-lg font-semibold text-white mb-4 relative">
              Resources
              <span className={`absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500 transition-all duration-300 ${hoverStates.resources ? 'w-24' : ''}`}></span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div 
            className={`transition-all duration-300 ${hoverStates.company ? 'transform -translate-y-1' : ''}`}
            onMouseEnter={() => toggleHover('company', true)}
            onMouseLeave={() => toggleHover('company', false)}
          >
            <h4 className="text-lg font-semibold text-white mb-4 relative">
              Company
              <span className={`absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500 transition-all duration-300 ${hoverStates.company ? 'w-20' : ''}`}></span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/aboutUs" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Careers
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} DebtMates. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors duration-300 text-sm">Privacy Policy</a>
            <span className="text-gray-700">•</span>
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors duration-300 text-sm">Terms of Service</a>
            <span className="text-gray-700">•</span>
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors duration-300 text-sm">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
