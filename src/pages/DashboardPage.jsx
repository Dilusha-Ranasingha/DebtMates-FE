"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserGroups, getRotationalGroups, getProfile } from "../services/api"

const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [groups, setGroups] = useState([])
  const [rotationalGroups, setRotationalGroups] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalDebt: 0,
    totalSavings: 0,
    monthlyPayments: 0,
    savingsGoal: 10000,
    debtReduction: 0,
  })

  // Animation states
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch user profile
        const profileResponse = await getProfile()
        setUserData(profileResponse.data)

        // Fetch user groups
        const groupsResponse = await getUserGroups()
        setGroups(groupsResponse.data || [])

        // Fetch rotational groups
        const rotationalResponse = await getRotationalGroups()
        setRotationalGroups(rotationalResponse.data || [])

        // Calculate stats (this would normally come from the API)
        setStats({
          totalDebt: 15750,
          totalSavings: 4200,
          monthlyPayments: 1250,
          savingsGoal: 10000,
          debtReduction: 3500,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Trigger animations after component mounts
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true)
    }, 100)
  }, [])

  // Recent activity data (would normally come from API)
  const recentActivity = [
    { id: 1, type: "payment", amount: 350, date: "2023-06-15", description: "Monthly payment to Credit Card" },
    { id: 2, type: "savings", amount: 200, date: "2023-06-14", description: "Deposit to emergency fund" },
    { id: 3, type: "debt", amount: 1000, date: "2023-06-10", description: "New loan recorded" },
    { id: 4, type: "payment", amount: 150, date: "2023-06-05", description: "Payment to Student Loan" },
    { id: 5, type: "savings", amount: 300, date: "2023-06-01", description: "Rotational savings contribution" },
  ]

  // Upcoming payments (would normally come from API)
  const upcomingPayments = [
    { id: 1, dueDate: "2023-06-20", amount: 350, description: "Credit Card Payment", status: "upcoming" },
    { id: 2, dueDate: "2023-06-25", amount: 500, description: "Car Loan", status: "upcoming" },
    { id: 3, dueDate: "2023-06-30", amount: 200, description: "Student Loan", status: "upcoming" },
    { id: 4, dueDate: "2023-07-05", amount: 150, description: "Personal Loan", status: "upcoming" },
  ]

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f111a] text-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-400">Loading your financial dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div
          className={`mb-8 transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.username || "User"}</h1>
          <p className="text-gray-400">Here's an overview of your financial health</p>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Debt Card */}
          <div
            className={`bg-gradient-to-br from-red-900/40 to-red-700/20 rounded-xl p-6 border border-red-800/30 shadow-lg transition-all duration-700 delay-100 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Debt</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalDebt)}</h3>
              </div>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Debt Reduction</span>
                <span className="text-green-400">-{formatCurrency(stats.debtReduction)} YTD</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${(stats.debtReduction / stats.totalDebt) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Total Savings Card */}
          <div
            className={`bg-gradient-to-br from-green-900/40 to-green-700/20 rounded-xl p-6 border border-green-800/30 shadow-lg transition-all duration-700 delay-200 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Savings</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalSavings)}</h3>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Savings Goal</span>
                <span>{Math.round((stats.totalSavings / stats.savingsGoal) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${(stats.totalSavings / stats.savingsGoal) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Monthly Payments Card */}
          <div
            className={`bg-gradient-to-br from-blue-900/40 to-blue-700/20 rounded-xl p-6 border border-blue-800/30 shadow-lg transition-all duration-700 delay-300 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Monthly Payments</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.monthlyPayments)}</h3>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Next Payment</span>
                <span className="text-yellow-400">June 20, 2023</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-yellow-500 h-1.5 rounded-full animate-pulse" style={{ width: "75%" }}></div>
              </div>
            </div>
          </div>

          {/* Financial Health Score Card */}
          <div
            className={`bg-gradient-to-br from-purple-900/40 to-purple-700/20 rounded-xl p-6 border border-purple-800/30 shadow-lg transition-all duration-700 delay-400 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Financial Health</p>
                <h3 className="text-2xl font-bold mt-1">72/100</h3>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-400"
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
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Status</span>
                <span className="text-blue-400">Good</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-1.5 rounded-full">
                  <div
                    className="h-3 w-3 bg-white rounded-full relative -top-0.75 shadow-lg"
                    style={{ marginLeft: "72%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & Groups */}
          <div
            className={`lg:col-span-1 space-y-6 transition-all duration-700 delay-500 transform ${animate ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            {/* Quick Actions */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/record-debt"
                  className="bg-blue-900/30 hover:bg-blue-800/50 transition-colors duration-200 p-4 rounded-lg flex flex-col items-center text-center"
                >
                  <div className="bg-blue-500/20 p-2 rounded-full mb-2">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Record Debt</span>
                </Link>
                <Link
                  to="/make-payment"
                  className="bg-green-900/30 hover:bg-green-800/50 transition-colors duration-200 p-4 rounded-lg flex flex-col items-center text-center"
                >
                  <div className="bg-green-500/20 p-2 rounded-full mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-400"
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
                  <span className="text-sm">Make Payment</span>
                </Link>
                <Link
                  to="/add-savings"
                  className="bg-purple-900/30 hover:bg-purple-800/50 transition-colors duration-200 p-4 rounded-lg flex flex-col items-center text-center"
                >
                  <div className="bg-purple-500/20 p-2 rounded-full mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Add Savings</span>
                </Link>
                <Link
                  to="/create-group"
                  className="bg-yellow-900/30 hover:bg-yellow-800/50 transition-colors duration-200 p-4 rounded-lg flex flex-col items-center text-center"
                >
                  <div className="bg-yellow-500/20 p-2 rounded-full mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Create Group</span>
                </Link>
              </div>
            </div>

            {/* Your Groups */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Your Groups</h3>
              {groups.length > 0 ? (
                <div className="space-y-3">
                  {groups.slice(0, 3).map((group, index) => (
                    <Link
                      key={group.id || index}
                      to={`/groups/${group.id}`}
                      className="flex items-center p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <span className="font-semibold text-blue-400">{group.name?.charAt(0) || "G"}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{group.name || `Group ${index + 1}`}</h4>
                        <p className="text-sm text-gray-400">{group.members?.length || 0} members</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{formatCurrency(group.totalDebt || 0)}</span>
                      </div>
                    </Link>
                  ))}
                  {groups.length > 3 && (
                    <Link to="/groups" className="text-blue-400 text-sm flex items-center hover:underline">
                      <span>View all groups</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-700/20 rounded-lg">
                  <p className="text-gray-400 mb-3">You haven't joined any groups yet</p>
                  <Link to="/create-group" className="text-blue-400 hover:underline">
                    Create your first group
                  </Link>
                </div>
              )}
            </div>

            {/* Rotational Savings */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Rotational Savings</h3>
              {rotationalGroups.length > 0 ? (
                <div className="space-y-3">
                  {rotationalGroups.slice(0, 3).map((group, index) => (
                    <Link
                      key={group.id || index}
                      to={`/rotational/${group.id}`}
                      className="flex items-center p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                        <span className="font-semibold text-green-400">{group.name?.charAt(0) || "R"}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{group.name || `Rotational ${index + 1}`}</h4>
                        <p className="text-sm text-gray-400">Next payout: {group.nextPayoutDate || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{formatCurrency(group.contributionAmount || 0)}/mo</span>
                      </div>
                    </Link>
                  ))}
                  {rotationalGroups.length > 3 && (
                    <Link to="/rotational-page" className="text-green-400 text-sm flex items-center hover:underline">
                      <span>View all rotational groups</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-700/20 rounded-lg">
                  <p className="text-gray-400 mb-3">No rotational savings groups yet</p>
                  <Link to="/create-rotational" className="text-green-400 hover:underline">
                    Start a rotational savings group
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Middle & Right Columns - Main Content */}
          <div
            className={`lg:col-span-2 space-y-6 transition-all duration-700 delay-600 transform ${animate ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            {/* Tabs Navigation */}
            <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg">
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${activeTab === "overview" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("debts")}
                  className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${activeTab === "debts" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
                >
                  Debts
                </button>
                <button
                  onClick={() => setActiveTab("savings")}
                  className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${activeTab === "savings" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
                >
                  Savings
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${activeTab === "activity" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
                >
                  Activity
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Financial Progress */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Financial Progress</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Debt Reduction</span>
                            <span className="text-sm font-medium">
                              {formatCurrency(stats.debtReduction)} / {formatCurrency(stats.totalDebt)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full animate-pulse"
                              style={{ width: `${(stats.debtReduction / stats.totalDebt) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Savings Goal</span>
                            <span className="text-sm font-medium">
                              {formatCurrency(stats.totalSavings)} / {formatCurrency(stats.savingsGoal)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full animate-pulse"
                              style={{ width: `${(stats.totalSavings / stats.savingsGoal) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Monthly Budget</span>
                            <span className="text-sm font-medium">$2,820 / $3,000</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Payments */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Upcoming Payments</h3>
                        <Link to="/payments" className="text-sm text-blue-400 hover:underline">
                          View all
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {upcomingPayments.slice(0, 3).map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-blue-400"
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
                              <div>
                                <h4 className="font-medium">{payment.description}</h4>
                                <p className="text-sm text-gray-400">Due: {payment.dueDate}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">{formatCurrency(payment.amount)}</span>
                              <span className="block text-xs text-yellow-400">{payment.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Recent Activity</h3>
                        <Link to="/activity" className="text-sm text-blue-400 hover:underline">
                          View all
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {recentActivity.slice(0, 3).map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                  activity.type === "payment"
                                    ? "bg-green-500/20"
                                    : activity.type === "savings"
                                      ? "bg-blue-500/20"
                                      : "bg-red-500/20"
                                }`}
                              >
                                {activity.type === "payment" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-green-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                                {activity.type === "savings" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                  </svg>
                                )}
                                {activity.type === "debt" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{activity.description}</h4>
                                <p className="text-sm text-gray-400">{activity.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`font-medium ${
                                  activity.type === "payment"
                                    ? "text-green-400"
                                    : activity.type === "savings"
                                      ? "text-blue-400"
                                      : "text-red-400"
                                }`}
                              >
                                {activity.type === "payment" ? "-" : activity.type === "savings" ? "+" : "+"}
                                {formatCurrency(activity.amount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Debts Tab */}
                {activeTab === "debts" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Your Debts</h3>
                      <Link
                        to="/add-debt"
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        Add Debt
                      </Link>
                    </div>

                    {/* Sample Debts */}
                    <div className="space-y-4">
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Credit Card</h4>
                            <p className="text-sm text-gray-400">Chase Bank</p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{formatCurrency(5200)}</span>
                            <p className="text-xs text-gray-400">18.99% APR</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Paid: {formatCurrency(9800)}</span>
                          <span>Total: {formatCurrency(15000)}</span>
                        </div>
                      </div>

                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Student Loan</h4>
                            <p className="text-sm text-gray-400">Sallie Mae</p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{formatCurrency(12500)}</span>
                            <p className="text-xs text-gray-400">5.25% APR</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "37%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Paid: {formatCurrency(7500)}</span>
                          <span>Total: {formatCurrency(20000)}</span>
                        </div>
                      </div>

                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Car Loan</h4>
                            <p className="text-sm text-gray-400">Toyota Financial</p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{formatCurrency(8500)}</span>
                            <p className="text-xs text-gray-400">3.9% APR</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "58%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Paid: {formatCurrency(12000)}</span>
                          <span>Total: {formatCurrency(20500)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Link to="/debts" className="text-blue-400 hover:underline inline-flex items-center">
                        <span>View all debts</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Savings Tab */}
                {activeTab === "savings" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Your Savings</h3>
                      <Link
                        to="/add-savings"
                        className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        Add Savings
                      </Link>
                    </div>

                    {/* Savings Goals */}
                    <div className="space-y-4">
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Emergency Fund</h4>
                            <p className="text-sm text-gray-400">High-yield Savings</p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{formatCurrency(2500)}</span>
                            <p className="text-xs text-gray-400">of {formatCurrency(6000)} goal</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "42%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>42% complete</span>
                          <span>{formatCurrency(3500)} to go</span>
                        </div>
                      </div>

                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Vacation Fund</h4>
                            <p className="text-sm text-gray-400">Travel Savings</p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{formatCurrency(1200)}</span>
                            <p className="text-xs text-gray-400">of {formatCurrency(3000)} goal</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>40% complete</span>
                          <span>{formatCurrency(1800)} to go</span>
                        </div>
                      </div>

                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Home Down Payment</h4>
                            <p className="text-sm text-gray-400">Investment Account</p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{formatCurrency(15000)}</span>
                            <p className="text-xs text-gray-400">of {formatCurrency(50000)} goal</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>30% complete</span>
                          <span>{formatCurrency(35000)} to go</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Link to="/savings" className="text-green-400 hover:underline inline-flex items-center">
                        <span>View all savings</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === "activity" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>

                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                activity.type === "payment"
                                  ? "bg-green-500/20"
                                  : activity.type === "savings"
                                    ? "bg-blue-500/20"
                                    : "bg-red-500/20"
                              }`}
                            >
                              {activity.type === "payment" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-green-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                              {activity.type === "savings" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-blue-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              )}
                              {activity.type === "debt" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-red-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{activity.description}</h4>
                              <p className="text-sm text-gray-400">{activity.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`font-medium ${
                                activity.type === "payment"
                                  ? "text-green-400"
                                  : activity.type === "savings"
                                    ? "text-blue-400"
                                    : "text-red-400"
                              }`}
                            >
                              {activity.type === "payment" ? "-" : activity.type === "savings" ? "+" : "+"}
                              {formatCurrency(activity.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center space-x-2">
                      <button className="px-3 py-1 bg-gray-700 rounded-md text-sm">Previous</button>
                      <button className="px-3 py-1 bg-blue-600 rounded-md text-sm">Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

