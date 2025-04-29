"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import useGroup from "../../hooks/useGroup"
import GroupCard from "../../components/Group/GroupCard"
import LoadingSpinner from "../../components/LoadingSpinner"

const Dashboard = () => {
  const navigate = useNavigate()
  const { groups, loading } = useGroup()
  const [animate, setAnimate] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Trigger animations after component mounts
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true)
    }, 100)
  }, [])

  // Filter groups based on active filter and search term
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.groupDescription.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeFilter === "all") return matchesSearch
    if (activeFilter === "created" && group.isCreator) return matchesSearch
    if (activeFilter === "joined" && !group.isCreator) return matchesSearch
    return false
  })

  // Calculate total debt across all groups
  const totalDebtAcrossGroups = groups.reduce((total, group) => {
    return total + (group.totalDebt || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className={`mb-8 transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >

          {/* Header title and Create Group Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Debt Management</h1>
              <p className="text-gray-400">Manage your group debts and track payments</p>
            </div>
            <button
              onClick={() => navigate("/groups/create")}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center"
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
              Create New Group
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">


            {/* Total Groups Card */}
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 rounded-xl p-5 border border-blue-800/30 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Groups</p>
                  <h3 className="text-2xl font-bold mt-1">{groups.length}</h3>
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Created by you</span>
                  <span>{groups.filter((g) => g.isCreator).length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{
                      width: `${(groups.filter((g) => g.isCreator).length / Math.max(groups.length, 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Members Card */}
            <div className="bg-gradient-to-br from-green-900/40 to-green-700/20 rounded-xl p-5 border border-green-800/30 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Members</p>
                  <h3 className="text-2xl font-bold mt-1">{groups.reduce((sum, g) => sum + (g.numMembers || 0), 0)}</h3>
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Avg. Members per Group</span>
                  <span>
                    {groups.length
                      ? (groups.reduce((sum, g) => sum + (g.numMembers || 0), 0) / groups.length).toFixed(1)
                      : 0}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>

          </div>


        </div>

        {/* Search and Filter Section */}
        <div
          className={`mb-6 transition-all duration-700 delay-200 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
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
                className="bg-gray-800/50 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                All Groups
              </button>
              <button
                onClick={() => setActiveFilter("created")}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeFilter === "created"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Created by Me
              </button>
              <button
                onClick={() => setActiveFilter("joined")}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeFilter === "joined"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Joined
              </button>
            </div>
          </div>
        </div>

        {/* Groups List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div
            className={`bg-gray-800/50 rounded-xl p-10 text-center border border-gray-700/50 shadow-lg transition-all duration-700 delay-300 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No groups found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? "No groups match your search criteria."
                : activeFilter === "all"
                  ? "You haven't created or joined any groups yet."
                  : activeFilter === "created"
                    ? "You haven't created any groups yet."
                    : "You haven't joined any groups yet."}
            </p>
            <button
              onClick={() => navigate("/groups/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
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
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGroups.map((group, index) => (
              <div
                key={group.groupId}
                className={`transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <GroupCard group={group} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

