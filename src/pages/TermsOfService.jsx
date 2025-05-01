import { Link } from "react-router-dom"

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0f111a] to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
            Terms of Service
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full mb-6"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">Last Updated: April 4, 2025</p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 md:p-10 shadow-xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 mb-6">
              Welcome to DebtFriends. Please read these Terms of Service ("Terms") carefully as they contain important
              information about your legal rights, remedies, and obligations. By accessing or using the DebtFriends
              platform, you agree to comply with and be bound by these Terms.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Acceptance of Terms
            </h2>
            <p className="text-gray-300 mb-6">
              By accessing or using our platform, you agree to these Terms and our Privacy Policy. If you do not agree
              to these Terms, you may not access or use our platform.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Description of Services
            </h2>
            <p className="text-gray-300 mb-4">DebtFriends provides a platform for users to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>Create and manage groups for tracking shared expenses and debts</li>
              <li>Record and monitor group debts and individual contributions</li>
              <li>Organize and participate in rotational savings groups</li>
              <li>Access personal financial dashboards and insights</li>
              <li>Communicate with group members regarding financial matters</li>
            </ul>
            <p className="text-gray-300 mb-6">
              We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              User Accounts
            </h2>
            <p className="text-gray-300 mb-4">
              To use certain features of our platform, you must register for an account. When you register, you agree
              to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account and password</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="text-gray-300 mb-6">
              We reserve the right to refuse service, terminate accounts, or remove content at our discretion.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              User Responsibilities
            </h2>
            <p className="text-gray-300 mb-4">As a user of our platform, you agree not to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Use our platform for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt our services or servers</li>
              <li>Attempt to gain unauthorized access to any part of our platform</li>
              <li>Use our platform to transmit harmful code or materials</li>
              <li>Impersonate any person or entity</li>
              <li>Engage in any activity that could damage, disable, or impair our services</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Financial Transactions and Group Management
            </h2>
            <p className="text-gray-300 mb-6">
              DebtFriends facilitates the tracking and management of group finances but is not a financial institution
              or payment processor. Users are responsible for the accuracy of financial information entered into the
              platform and for fulfilling their financial obligations to other group members outside of our platform.
            </p>
            <p className="text-gray-300 mb-6">
              Group creators and administrators are responsible for managing their groups, including inviting members,
              recording debts, and ensuring the accuracy of financial information. DebtFriends is not responsible for
              disputes between group members regarding debts, contributions, or payments.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Intellectual Property
            </h2>
            <p className="text-gray-300 mb-6">
              The DebtFriends platform, including its content, features, and functionality, is owned by DebtFriends,
              Inc. and is protected by copyright, trademark, and other intellectual property laws. You may not
              reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish,
              download, store, or transmit any of our materials without our express written consent.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Limitation of Liability
            </h2>
            <p className="text-gray-300 mb-6">
              To the maximum extent permitted by law, DebtFriends and its affiliates, officers, employees, agents,
              partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
              losses, resulting from your access to or use of or inability to access or use the platform.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Indemnification
            </h2>
            <p className="text-gray-300 mb-6">
              You agree to defend, indemnify, and hold harmless DebtFriends, its affiliates, licensors, and service
              providers, and its and their respective officers, directors, employees, contractors, agents, licensors,
              suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards,
              losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your
              violation of these Terms or your use of the platform.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Governing Law
            </h2>
            <p className="text-gray-300 mb-6">
              These Terms shall be governed by and construed in accordance with the laws of the State of California,
              without giving effect to any principles of conflicts of law. Any dispute arising from these Terms shall be
              resolved exclusively in the state or federal courts located in San Francisco County, California.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">
              Changes to Terms
            </h2>
            <p className="text-gray-300 mb-6">
              We reserve the right to modify these Terms at any time. We will provide notice of any material changes by
              posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of the
              platform after such changes constitutes your acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-700 pb-2">Contact Us</h2>
            <p className="text-gray-300 mb-4">If you have any questions about these Terms, please contact us at:</p>
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
  )
}

export default TermsOfService

