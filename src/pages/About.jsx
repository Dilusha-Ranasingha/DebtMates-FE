"use client"

import { Link } from "react-router-dom"

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0f111a] to-gray-900 text-gray-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
                About Us
              </h1>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full"></div>
            </div>
          </div>

          <section className="mb-20 text-center relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed relative z-10">
              Welcome to <span className="text-blue-400 font-semibold">DebtFriends</span>—your trusted partner in
              managing group finances, reducing debt, and building savings together. We believe that financial freedom
              is a journey best traveled with friends, and we're here to make that journey simpler, smarter, and more
              collaborative.
            </p>
          </section>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <section className="mb-20 max-w-4xl mx-auto">
          <div className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              At DebtFriends, our mission is to empower individuals and groups to take control of their financial
              futures. Whether you're managing shared debts with friends, organizing rotational savings groups, or
              tracking your personal financial health, we provide the tools and insights you need to succeed. We aim to
              foster transparency, accountability, and trust in group financial management, helping you achieve your
              goals while strengthening your community.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">What We Do</h2>
          <p className="text-gray-300 text-lg text-center max-w-3xl mx-auto mb-12">
            DebtFriends is a platform designed to simplify the complexities of group finances. Our key features include:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Group Debt Tracking</h3>
              <p className="text-gray-300">
                Easily record, track, and manage debts within your groups. From splitting bills to monitoring
                repayments, we ensure everyone stays on the same page.
              </p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Rotational Savings Groups</h3>
              <p className="text-gray-300">
                Join or create rotational savings plans (also known as "chit funds" or "susu") to save collectively with
                friends and access funds when you need them most.
              </p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Personal Financial Dashboard</h3>
              <p className="text-gray-300">
                Get a clear overview of your debts, savings, and payments with actionable insights to improve your
                financial health.
              </p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Secure and Transparent</h3>
              <p className="text-gray-300">
                With robust security measures and real-time updates, you can trust that your financial data is safe and
                accessible only to your group members.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Our Story</h2>
          <div className="relative pl-8 border-l border-gray-700 py-4">
            <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-blue-500 -translate-x-1/2"></div>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              DebtFriends was born out of a simple idea: managing money with friends shouldn't be stressful. Our
              founders, a group of friends who often found themselves juggling shared expenses and debts, realized there
              was no easy way to keep track of who owed what—or to save together without the hassle. Inspired by
              traditional rotational savings practices from around the world, they set out to create a modern, digital
              solution that combines the best of community finance with cutting-edge technology.
            </p>
            <div className="absolute left-0 top-1/2 w-4 h-4 rounded-full bg-purple-500 -translate-x-1/2"></div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Since our launch in 2024, we've helped thousands of users across the globe manage over $1 million in group
              debts and savings. From small friend groups to large community organizations, we're proud to be the
              platform that brings people together to achieve their financial dreams.
            </p>
            <div className="absolute left-0 bottom-0 w-4 h-4 rounded-full bg-blue-500 -translate-x-1/2"></div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Why Choose DebtFriends?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-gray-800 p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">Built for Collaboration</h3>
                <p className="text-gray-300">
                  Our platform is designed with groups in mind, making it easy to invite members, assign debts, and
                  track contributions.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-gray-800 p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">User-Friendly Design</h3>
                <p className="text-gray-300">
                  With an intuitive dashboard and seamless navigation, managing your finances has never been easier.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-gray-800 p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">Community-Driven</h3>
                <p className="text-gray-300">
                  We celebrate the power of community and are committed to supporting financial practices that bring
                  people closer together.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-gray-800 p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">Secure and Reliable</h3>
                <p className="text-gray-300">
                  Your data is protected with state-of-the-art encryption, ensuring your financial information is always
                  safe.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center group">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse-slow opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 mx-auto flex items-center justify-center border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-300">
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    ND
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-white">Dilusha Ranasinghe</h3>
              <p className="text-blue-400 text-sm font-medium">Co-Founder & CEO</p>
            </div>

            <div className="text-center group">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 animate-pulse-slow opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 mx-auto flex items-center justify-center border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-300">
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    CS
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-white">Chalani Silva</h3>
              <p className="text-blue-400 text-sm font-medium">Co-Founder & CTO</p>
            </div>

            <div className="text-center group">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse-slow opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 mx-auto flex items-center justify-center border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-300">
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    DB
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-white">Dhanithya Belligolla</h3>
              <p className="text-blue-400 text-sm font-medium">Head of Product</p>
            </div>

            <div className="text-center group">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 animate-pulse-slow opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 mx-auto flex items-center justify-center border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-300">
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    NE
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-white">Nethmi Ekanayaka</h3>
              <p className="text-blue-400 text-sm font-medium">Community Manager</p>
            </div>
          </div>
        </section>

        <section className="text-center py-16 px-4 max-w-3xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-xl p-10 border border-gray-700/50">
            <h2 className="text-3xl font-bold mb-4 text-white">Join the DebtFriends Community</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              We're more than just a platform—we're a community of people working together to achieve financial freedom.
              Ready to take control of your group finances?
            </p>
            <Link
              to="/user-register"
              className="inline-block bg-gradient-to-r from-blue-600  hover:from-blue-700  text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1"
            >
              Sign Up Today
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(55, 65, 81, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(55, 65, 81, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
      `}</style>
    </div>
  )
}

export default About