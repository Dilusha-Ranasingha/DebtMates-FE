// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">DebtMates</h3>
          <p className="mb-4">Your partner in financial freedom.</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Debt Tracking
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Payment Reminders
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Payoff Strategies
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Financial Reports
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Guides
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Support
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center">
        <p>&copy; {new Date().getFullYear()} DebtMates. All rights reserved.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;