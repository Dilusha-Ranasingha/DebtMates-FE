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
    savingsGoal: 0,
    debtReduction: 0,
  })
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

        // Get stats from API (assuming this would be part of one of the responses)
        // For now using placeholder empty values that will be filled by API
        setStats({
          totalDebt: profileResponse.data?.totalDebt || 0,
          totalSavings: profileResponse.data?.totalSavings || 0,
          monthlyPayments: profileResponse.data?.monthlyPayments || 0,
          savingsGoal: profileResponse.data?.savingsGoal || 0,
          debtReduction: profileResponse.data?.debtReduction || 0,
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

       { /* Dashboard Hero Image */}
              <div className={`mb-8 transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="relative rounded-xl overflow-hidden h-94 md:h-100 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/30">
                <div className="absolute inset-0 flex items-center justify-center">
                <img 
              src="https://i.pinimg.com/736x/38/26/e4/3826e416a4e659ecacc52420ccdc40e5.jpg" 
              alt="Financial Management Dashboard" 
              className="object-cover w-full h-full opacity-40"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Take Control of Your Finances</h2>
              <p className="text-lg text-blue-100 max-w-md">Track your debt, build savings, and achieve financial freedom</p>
                </div>
                </div>
              </div>
              </div>
              
            <div >
              {/* Left Column - Quick Actions & Groups */}
          <div
            className={`lg:col-span-1 space-y-6 transition-all duration-700 delay-500 transform ${animate ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            {/* Quick Actions */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/groups/create"
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
                  <span className="text-sm">Record Debt Group</span>
                </Link>
                <Link
                  to="/rotational-page"
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
                  <span className="text-sm">Record Rotational Payment</span>
                </Link>
                <Link
                  to="/personal-saving"
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
                  <span className="text-sm">Add Savings Plan</span>
                </Link>
                <Link
                  to="/rotational/create"
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
                  <span className="text-sm">Create Rotational Group</span>
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
                      key={group.groupId || index}
                      to={`/groups/${group.groupId}/debts`}
                      className="flex items-center p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <span className="font-semibold text-blue-400">{group.groupName?.charAt(0) || "G"}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{group.groupName || `Group ${index + 1}`}</h4>
                        <p className="text-sm text-gray-400">{group.members?.length || 0} members</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{formatCurrency(group.totalDebt || 0)}</span>
                      </div>
                    </Link>
                  ))}
                  {groups.length > 3 && (
                    <Link to="/dashboard" className="text-blue-400 text-sm flex items-center hover:underline">
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
                      key={group.groupId || index}
                      to={`/rotational/${group.groupId}/payments`}
                      className="flex items-center p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                        <span className="font-semibold text-green-400">{group.groupName?.charAt(0) || "R"}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{group.groupName || `Rotational ${index + 1}`}</h4>
                        <p className="text-sm text-gray-400">Next payout: {group.nextPayoutDate || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{formatCurrency(group.contributionAmount || 0)}/mo</span>
                      </div>
                    </Link>
                  ))}
                  {rotationalGroups.length > 3 && (
                    <Link to="/rotational/${group.groupId}/payments" className="text-green-400 text-sm flex items-center hover:underline">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage