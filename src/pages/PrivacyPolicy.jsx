import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0f111a] to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
            Privacy Policy
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full mb-6"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Last Updated: April 4, 2025
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 md:p-10 shadow-xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 mb-6">
              At DebtFriends, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-medium text-blue-400 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-300 mb-4">
              We may collect personal information that you voluntarily provide to us when registering for our platform, expressing interest in obtaining information about us or our products, or otherwise contacting us. The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>Name, email address, and contact information</li>
              <li>Username and password</li>
              <li>Financial information necessary for the functioning of our services</li>
              <li>Profile information and preferences</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-medium text-blue-400 mt-6 mb-3">Information Automatically Collected</h3>
            <p className="text-gray-300 mb-4">
              We automatically collect certain information when you visit, use, or navigate our platform. This information does not reveal your specific identity but may include:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>Device and usage information</li>
              <li>IP address and browser type</li>
              <li>Operating system</li>
              <li>Usage patterns and preferences</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              How We Use Your Information
            </h2>
            <p className="text-gray-300 mb-4">
              We use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>Provide, operate, and maintain our platform</li>
              <li>Improve, personalize, and expand our platform</li>
              <li>Understand and analyze how you use our platform</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you about our services, updates, and other information</li>
              <li>Process transactions and manage your account</li>
              <li>Find and prevent fraud</li>
              <li>For other purposes such as data analysis and compliance with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Sharing Your Information
            </h2>
            <p className="text-gray-300 mb-4">
              We may share information in the following situations:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li><strong>With Your Consent:</strong> We may disclose your information with your consent.</li>
              <li><strong>With Group Members:</strong> Information related to group debts and savings will be shared with members of your groups as necessary for the functioning of our services.</li>
              <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, service providers, and other third parties who perform services for us.</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with a merger, acquisition, or sale of all or a portion of our assets.</li>
              <li><strong>Legal Obligations:</strong> We may disclose your information where required by law or to protect our rights.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Data Security
            </h2>
            <p className="text-gray-300 mb-6">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards, no security system is impenetrable. We cannot guarantee the security of our databases, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Your Privacy Rights
            </h2>
            <p className="text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>The right to access personal information we hold about you</li>
              <li>The right to request correction of your personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p className="text-gray-300 mb-6">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-300 mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Contact Us
            </h2>
            <p className="text-gray-300 mb-4">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-700/30 p-6 rounded-lg mb-6">
              <p className="text-white">DebtFriends, Inc.</p>
              <p className="text-gray-300">207/2 Lotus Street</p>
              <p className="text-gray-300">Colombo, CA 94107</p>
              <p className="text-gray-300 mt-2">Email: debtmates.friends@gmail.com</p>
              <p className="text-gray-300">Phone: (94) 11-133-8888</p>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
