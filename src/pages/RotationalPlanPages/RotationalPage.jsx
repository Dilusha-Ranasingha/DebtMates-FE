"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import useRotational from "../../hooks/useRotational"
import LoadingSpinner from "../../components/LoadingSpinner"
import RotationalGroupCard from "./RotationalGroupCard"

const RotationalPage = () => {
  const navigate = useNavigate()
  const { groups, loading, deleteGroup } = useRotational()
  const [animate, setAnimate] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState("grid") // grid or carousel

  // Trigger animations after component mounts
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true)
    }, 100)
  }, [])

  // Filter groups based on search term
  const filteredGroups = groups.filter((group) => {
    return (
      group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.groupDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Filter groups based on creator status
  const getFilteredGroups = () => {
    if (activeFilter === "all") return filteredGroups
    if (activeFilter === "created") return filteredGroups.filter((group) => group.creator)
    if (activeFilter === "joined") return filteredGroups.filter((group) => !group.creator)
    return filteredGroups
  }

  // Calculate total savings across all groups
  const totalSavings = groups.reduce((total, group) => {
    return total + (group.contributionAmount || 0) * (group.numMembers || 0)
  }, 0)

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white text-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Circular Design */}
        <div
          className={`mb-12 transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-500 p-8 shadow-lg">
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal-400/20 animate-spin-slow"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-400/20 animate-spin-slow-reverse"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Rotational Savings</h1>
                <p className="text-teal-100 text-lg max-w-xl">
                  Collaborate with friends and family to save together through rotating contributions and payouts
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-teal-200 animate-spin-slow"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-teal-800 text-xs font-medium">Total Savings</p>
                      <p className="text-teal-900 text-2xl font-bold">{formatCurrency(totalSavings)}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/rotational/create")}
                  className="bg-white text-teal-700 hover:bg-teal-50 px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Cycle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with Circular Design */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 transition-all duration-700 delay-100 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* Total Groups Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-teal-100 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-teal-100"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
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
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Total Cycles</h3>
                  <p className="text-gray-500 text-sm">Active and completed savings cycles</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-teal-700">{groups.length}</div>
                <div className="text-sm text-teal-600">
                  <span className="font-medium">{groups.filter((g) => g.creator).length}</span> created by you
                </div>
              </div>
            </div>
          </div>

          {/* Total Members Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-emerald-100"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Total Members</h3>
                  <p className="text-gray-500 text-sm">People participating in your cycles</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-emerald-700">
                  {groups.reduce((sum, group) => sum + (group.numMembers || 0), 0)}
                </div>
                <div className="text-sm text-emerald-600">
                  <span className="font-medium">
                    {groups.length
                      ? (groups.reduce((sum, g) => sum + (g.numMembers || 0), 0) / groups.length).toFixed(1)
                      : 0}
                  </span>{" "}
                  avg per cycle
                </div>
              </div>
            </div>
          </div>

          {/* Savings Status Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-cyan-100 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-cyan-100"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Active Cycles</h3>
                  <p className="text-gray-500 text-sm">Currently running savings cycles</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-cyan-700">{groups.filter((g) => g.active).length}</div>
                <div className="text-sm text-cyan-600">
                  <span className="font-medium">
                    {groups.length
                      ? `${Math.round((groups.filter((g) => g.completed).length / groups.length) * 100)}%`
                      : "0%"}
                  </span>{" "}
                  completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div
          className={`mb-8 transition-all duration-700 delay-200 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 text-gray-700 pl-10 pr-4 py-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Search cycles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex space-x-2 w-full md:w-auto">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeFilter === "all" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Cycles
                </button>
                <button
                  onClick={() => setActiveFilter("created")}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeFilter === "created"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Created by Me
                </button>
                <button
                  onClick={() => setActiveFilter("joined")}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeFilter === "joined" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Joined
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    view === "grid" ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setView("carousel")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    view === "carousel" ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Groups List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : getFilteredGroups().length === 0 ? (
          <div
            className={`bg-white rounded-2xl p-10 text-center border border-gray-200 shadow-md transition-all duration-700 delay-300 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-teal-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No savings cycles found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm
                ? "No cycles match your search criteria."
                : activeFilter === "all"
                  ? "You haven't created or joined any rotational savings cycles yet."
                  : activeFilter === "created"
                    ? "You haven't created any rotational savings cycles yet."
                    : "You haven't joined any rotational savings cycles yet."}
            </p>
            <button
              onClick={() => navigate("/rotational/create")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 inline-flex items-center shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Cycle
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredGroups().map((group, index) => (
              <div
                key={group.groupId}
                className={`transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <RotationalGroupCard group={group} onDelete={deleteGroup} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredGroups().map((group, index) => (
              <div
                key={group.groupId}
                className={`transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <RotationalGroupCard group={group} onDelete={deleteGroup} view="list" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RotationalPage
