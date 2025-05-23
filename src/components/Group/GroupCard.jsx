"use client"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getGroupDebts, getGroupMembers } from "../../services/api"

const GroupCard = ({ group }) => {
  const { groupId, groupName, groupDescription, numMembers, isCreator } = group
  const [debts, setDebts] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Fetch group debts
  useEffect(() => {
    const fetchDebts = async () => {
      setLoading(true)
      try {
        const response = await getGroupDebts(groupId)
        setDebts(response.data || [])
      } catch (error) {
        console.error("Failed to fetch debts:", error)
        setDebts([])
      } finally {
        setLoading(false)
      }
    }
    fetchDebts()
  }, [groupId])

  // Fetch group members
  useEffect(() => {
    const fetchMembers = async () => {
      setLoadingMembers(true)
      try {
        const response = await getGroupMembers(groupId)
        setMembers(response.data || [])
      } catch (error) {
        console.error("Failed to fetch group members:", error)
        setMembers([])
      } finally {
        setLoadingMembers(false)
      }
    }
    fetchMembers()
  }, [groupId])

  // Calculate total debt (sum of expected contributions)
  const totalDebt = debts.reduce((sum, debt) => sum + (debt.expected || 0), 0)

  // Calculate debt per member
  const debtPerMember = members.length > 0 ? totalDebt / members.length : 0

  // Get the highest debt
  const highestDebt = debts.length > 0 ? Math.max(...debts.map((debt) => debt.amountToPay || 0)) : 0

  // Calculate the logged-in user's debt
  const loggedInUser = localStorage.getItem('username') || 'Max'; // Assuming username is stored in localStorage
  const loggedInUserDebt = debts.find(debt => debt.memberName === loggedInUser)?.amountToPay || 0;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Calculate debt status color
  const getDebtStatusColor = () => {
    if (totalDebt === 0) return "bg-green-500"
    if (totalDebt < 1000) return "bg-yellow-500"
    if (totalDebt < 5000) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-700/50">
      
      {/* Card Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1">
          <div
            className={`h-full ${getDebtStatusColor()}`}
            style={{ width: `${Math.min((totalDebt / 10000) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{groupName}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{groupDescription}</p>
            </div>
            {isCreator && <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full">Creator</span>}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 pb-3">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">Total Bill</p>
            <p className="text-lg font-semibold text-white">
              {loading ? (
                <span className="inline-block w-16 h-6 bg-gray-600 animate-pulse rounded"></span>
              ) : (
                formatCurrency(totalDebt)
              )}
            </p>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">All Members</p>
            <p className="text-lg font-semibold text-white">
              {loadingMembers ? (
                <span className="inline-block w-10 h-6 bg-gray-600 animate-pulse rounded"></span>
              ) : (
                numMembers
              )}
            </p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">Current Users</p>
            <p className="text-lg font-semibold text-white">
              {loadingMembers ? (
                <span className="inline-block w-10 h-6 bg-gray-600 animate-pulse rounded"></span>
              ) : (
                members.length || 4
              )}
            </p>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">Fixed Debt</p>
            <p className="text-lg font-semibold text-white">
              {loading ? (
                <span className="inline-block w-16 h-6 bg-gray-600 animate-pulse rounded"></span>
              ) : (
                formatCurrency(loggedInUserDebt) // Display the logged-in user's debt
              )}
            </p>
          </div>
        </div>

        {/* Debt Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Debt Distribution</span>
            <span>{formatCurrency(debtPerMember)} / member</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${getDebtStatusColor()}`}
              style={{ width: `${Math.min((totalDebt / 10000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 space-y-3 border-t border-gray-700/50 pt-3 animate-fadeIn">
            <p className="text-sm text-gray-300 font-medium">Group Details</p>
            <p className="text-xs text-gray-400">Group ID: {groupId}</p>

            {debts.length > 0 && (
              <div>
                <p className="text-sm text-gray-300 font-medium mt-3 mb-2">Recent Debts</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {debts.slice(0, 3).map((debt, index) => (
                    <div key={index} className="bg-gray-700/30 p-2 rounded-lg text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{debt.description || `Debt #${index + 1}`}</span>
                        <span className="text-white font-medium">
                          {formatCurrency((debt.expected || 0) + (debt.gte || 0))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Card Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={`/groups/${groupId}/debts`}
            className="hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{ backgroundColor: '#0c2769' }}
          >
            View Details
          </Link>

          {isCreator && (
            <>
              <Link
                to={`/groups/${groupId}/record-debt`}
                className="text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{ backgroundColor: '#0d401f' }}
              >
                Record Debt
              </Link>

              <Link
                to={`/groups/${groupId}/edit`}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Edit
              </Link>

              <Link
                to={`/groups/${groupId}/add-members`}
                className="hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{ backgroundColor: '#301b40' }}
              >
                Add Members
              </Link>

              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-gray-400 hover:text-white p-1.5 rounded-lg transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {!isCreator && (
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupCard