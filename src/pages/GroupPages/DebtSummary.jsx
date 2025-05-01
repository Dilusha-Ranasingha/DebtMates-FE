"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LoadingSpinner from "../../components/LoadingSpinner"
import { getGroupDebts } from "../../services/api"

const DebtSummary = () => {
  const { groupId } = useParams() // Get groupId from the URL
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        console.log("Fetching debts for group ID:", groupId) // Debug groupId
        const response = await getGroupDebts(groupId) // Fetch debts using the API
        console.log("API Response:", response.data) // Debug API response
        setDebts(response.data) // Set the debts data
      } catch (error) {
        console.error("Error fetching debts:", error) // Debug errors
      } finally {
        setLoading(false)
      }
    }

    fetchDebts()
  }, [groupId])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Calculate total debt
  const totalDebt = debts.reduce((sum, debt) => sum + (debt.expected || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden mb-6">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1">
              <div
                className={`h-full ${totalDebt > 5000 ? "bg-red-500" : totalDebt > 1000 ? "bg-orange-500" : totalDebt > 0 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${Math.min((totalDebt / 10000) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="p-5">
              <h2 className="text-3xl font-bold text-white mb-2">Debt Summary</h2>
              <p className="text-gray-400 text-sm">
                Group ID: {groupId} • Total Expected: {formatCurrency(totalDebt)}
              </p>
            </div>
          </div>
        </div>

        {debts.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl text-gray-300 font-medium">No debts found for this group</p>
            <p className="text-gray-400 mt-2">When debts are recorded, they will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {debts.map((debt, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-700/50"
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{debt.memberName}</h3>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-700/30 p-3 rounded-lg">
                          <p className="text-gray-400 text-xs mb-1">Contributed</p>
                          <p className="text-lg font-semibold text-green-400">
                            {formatCurrency(debt.contributed || 0)}
                          </p>
                        </div>
                        <div className="bg-gray-700/30 p-3 rounded-lg">
                          <p className="text-gray-400 text-xs mb-1">Expected</p>
                          <p className="text-lg font-semibold text-red-400">{formatCurrency(debt.expected || 0)}</p>
                        </div>
                      </div>

                      {(debt.toWhoPay || debt.amountToPay) && (
                        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
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
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                            <h4 className="text-blue-300 font-medium">Payment Details</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Pay To</p>
                              <p className="text-white font-medium">{debt.toWhoPay || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Amount</p>
                              <p className="text-lg font-semibold text-purple-400">
                                {formatCurrency(debt.amountToPay || 0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Debt Progress Bar */}
                <div className="w-full bg-gray-700 h-1">
                  <div
                    className={`h-1 ${debt.contributed >= debt.expected ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min((debt.contributed / debt.expected) * 100 || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DebtSummary

