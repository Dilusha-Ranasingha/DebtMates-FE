"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import debtImage from "../assets/debtImage.jpeg";
import { 
  getUserGroups, 
  getRotationalGroups, 
  getGroupDebts 
} from "../services/api"; // Using your existing API services

const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [demoStats, setDemoStats] = useState({
    debtProgress: 65,
    savingsProgress: 42,
    budgetProgress: 78
  })
  const [isVisible, setIsVisible] = useState({})
  const sectionRefs = {
    hero: useRef(null),
    features: useRef(null),
    progress: useRef(null),
    testimonials: useRef(null),
    cta: useRef(null)
  }

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true)
      navigate("/dashboard")
    }
  }, [token, navigate])

  // Demo progress tracker animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStats(prev => ({
        debtProgress: Math.min(100, prev.debtProgress + 1) % 101,
        savingsProgress: Math.min(100, prev.savingsProgress + 1) % 101,
        budgetProgress: Math.min(100, prev.budgetProgress + 1) % 101
      }))
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }))
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    
    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-200">
      {/* Main Hero */}
      <section 
        id="hero" 
        ref={sectionRefs.hero} 
        className={`py-16 md:py-24 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Take Control of Your <span className="text-blue-400 animate-pulse">Financial Future</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              DebtMates helps you track, manage, and eliminate debt while building healthy financial habits.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <a
                href="/user-register"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 font-semibold text-lg shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 animate-fadeInUp"
                style={{ animationDelay: '0.2s' }}
              >
                Get Started Free
              </a>
              <a
                href="#features"
                className="px-8 py-4 bg-[#1a1d2a] text-blue-400 border border-blue-500 rounded-lg hover:bg-[#252a3d] transition duration-300 font-semibold text-lg shadow hover:shadow-blue-500/10 animate-fadeInUp"
                style={{ animationDelay: '0.4s' }}
              >
                Learn More
              </a>
            </div>
          </div>
          
          {/* Progress Tracking Demo */}
          <div className="bg-[#1a1d2a] rounded-xl shadow-xl p-6 max-w-4xl mx-auto mb-12 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-2xl font-bold text-white mb-6">Track Your Financial Progress</h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Debt Reduction Progress */}
              <div className="bg-[#252a3d] p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blue-500/10">
                <h4 className="text-lg font-semibold mb-3 text-white">Debt Reduction</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-900/50">
                        In Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-400">
                        {demoStats.debtProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-900/30">
                    <div 
                      style={{ width: `${demoStats.debtProgress}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">$15,000 paid off of $23,000</p>
                </div>
              </div>
              
              {/* Savings Progress */}
              <div className="bg-[#252a3d] p-6 rounded-lg shadow-md border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-green-500/10">
                <h4 className="text-lg font-semibold mb-3 text-white">Savings Goal</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-400 bg-green-900/50">
                        Building
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-400">
                        {demoStats.savingsProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-900/30">
                    <div 
                      style={{ width: `${demoStats.savingsProgress}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500 ease-in-out"
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">$4,200 saved of $10,000 goal</p>
                </div>
              </div>
              
              {/* Budget Adherence */}
              <div className="bg-[#252a3d] p-6 rounded-lg shadow-md border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-purple-500/10">
                <h4 className="text-lg font-semibold mb-3 text-white">Budget Adherence</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-400 bg-purple-900/50">
                        On Track
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-purple-400">
                        {demoStats.budgetProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-900/30">
                    <div 
                      style={{ width: `${demoStats.budgetProgress}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500 ease-in-out"
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">$1,560 spent of $2,000 monthly budget</p>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg shadow-xl border border-gray-700 group">
              <img
                src={debtImage || "/placeholder.svg"}
                alt="DebtMates Dashboard Preview"
                className="w-full transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        ref={sectionRefs.features} 
        className={`py-16 bg-[#151823] transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Powerful Features to Manage Your Finances
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1a1d2a] p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Debt Tracking</h3>
              <p className="text-gray-400">
                Track all your debts in one place with visual charts and progress indicators.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center text-sm text-blue-400 group">
                  <span>Interactive dashboards</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1d2a] p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Payment Reminders</h3>
              <p className="text-gray-400">Never miss a payment with automated reminders and notifications.</p>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center text-sm text-blue-400 group">
                  <span>Smart notifications</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1d2a] p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
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
              <h3 className="text-xl font-semibold mb-2 text-white">Debt Payoff Strategies</h3>
              <p className="text-gray-400">Optimize your debt payoff with snowball or avalanche methods.</p>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center text-sm text-blue-400 group">
                  <span>Customized plans</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracking Section */}
      <section 
        id="progress" 
        ref={sectionRefs.progress} 
        className={`py-16 bg-[#0f111a] transition-all duration-1000 ${isVisible.progress ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Track Your Progress in Real-Time
          </h2>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-12">
            Visualize your financial journey with intuitive progress tracking tools
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Circular Progress Indicators */}
              <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform rotate-[-90deg]">
                      <circle 
                        className="text-gray-700" 
                        strokeWidth="10" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="56" 
                        cx="64" 
                        cy="64"
                      />
                      <circle 
                        className="text-blue-500" 
                        strokeWidth="10" 
                        strokeDasharray={352} 
                        strokeDashoffset={352 * (1 - demoStats.debtProgress/100)} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="56" 
                        cx="64" 
                        cy="64"
                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                      />
                    </svg>
                    <span className="absolute text-xl font-bold text-blue-400">{demoStats.debtProgress}%</span>
                  </div>
                  <p className="mt-2 font-medium text-white">Debt Reduction</p>
                </div>
                
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform rotate-[-90deg]">
                      <circle 
                        className="text-gray-700" 
                        strokeWidth="10" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="56" 
                        cx="64" 
                        cy="64"
                      />
                      <circle 
                        className="text-green-500" 
                        strokeWidth="10" 
                        strokeDasharray={352} 
                        strokeDashoffset={352 * (1 - demoStats.savingsProgress/100)} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="56" 
                        cx="64" 
                        cy="64"
                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                      />
                    </svg>
                    <span className="absolute text-xl font-bold text-green-400">{demoStats.savingsProgress}%</span>
                  </div>
                  <p className="mt-2 font-medium text-white">Savings Goals</p>
                </div>
              </div>
              
              <div className="bg-[#1a1d2a] p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-white">Financial Health Score</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-900/50">
                        Improving
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-400">
                        72/100
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div 
                      style={{ width: "72%" }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 animate-pulse"
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 text-xs text-gray-400">
                    <div>Needs Attention</div>
                    <div className="text-center">Good</div>
                    <div className="text-right">Excellent</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1d2a] p-6 rounded-lg shadow-lg border border-gray-700 transform transition-all duration-500 hover:shadow-blue-500/10 hover:border-blue-500">
              <h3 className="text-xl font-semibold mb-4 text-white">Monthly Budget Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Housing</span>
                    <span className="text-sm font-medium text-gray-300">$1,200 / $1,200</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-widthGrow" style={{ width: "100%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Transportation</span>
                    <span className="text-sm font-medium text-gray-300">$250 / $300</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-widthGrow" style={{ width: "83%", animationDelay: "0.2s" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Food</span>
                    <span className="text-sm font-medium text-gray-300">$420 / $500</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-widthGrow" style={{ width: "84%", animationDelay: "0.4s" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Entertainment</span>
                    <span className="text-sm font-medium text-gray-300">$150 / $200</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-widthGrow" style={{ width: "75%", animationDelay: "0.6s" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Debt Payments</span>
                    <span className="text-sm font-medium text-gray-300">$500 / $500</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-widthGrow" style={{ width: "100%", animationDelay: "0.8s" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Savings</span>
                    <span className="text-sm font-medium text-gray-300">$300 / $300</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full animate-widthGrow" style={{ width: "100%", animationDelay: "1s" }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">Total Spent:</span>
                  <span className="font-semibold text-white">$2,820 / $3,000</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                  <div className="bg-blue-500 h-3 rounded-full animate-widthGrow" style={{ width: "94%", animationDelay: "1.2s" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        id="testimonials" 
        ref={sectionRefs.testimonials} 
        className={`py-16 bg-[#151823] transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">What Our Users Say</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1a1d2a] p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-400 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">John Doe</h4>
                  <p className="text-gray-400 text-sm">Paid off $15,000 in 8 months</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "DebtMates helped me visualize my debt and create a realistic plan to pay it off. The reminders kept me
                accountable and the progress tracking motivated me to keep going."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: `${star * 0.1}s` }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1d2a] p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-400 font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Jane Smith</h4>
                  <p className="text-gray-400 text-sm">Improved credit score by 120 points</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "I was overwhelmed by my finances until I found DebtMates. Now I have a clear path to financial
                freedom and can see my progress every step of the way. The visual trackers keep me motivated!"
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: `${star * 0.1}s` }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        ref={sectionRefs.cta} 
        className={`py-16 bg-gradient-to-r py-16 bg-[#151823] text-white transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial future with DebtMates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/user-register"
              className="px-8 py-4 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition duration-300 font-semibold text-lg shadow-lg hover:shadow-white/20 transform hover:-translate-y-1 animate-pulse"
            >
              Create Free Account
            </a>
            <a
              href="/user-login"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-[#151823] transition duration-300 font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1"
            >
              Login
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
