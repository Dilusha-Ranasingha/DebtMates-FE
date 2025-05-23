"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import Dialog from "../../components/Dialog"
import { getRotationalPayments } from "../../services/api"
import toast from "react-hot-toast"

const RotationalGroupCard = ({ group, onDelete, view = "grid" }) => {
  const { groupId, groupName, groupDescription, numMembers, creator } = group
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [contributionAmount, setContributionAmount] = useState(null)
  const [loadingAmount, setLoadingAmount] = useState(true)

  useEffect(() => {
    const fetchPaymentAmount = async () => {
      try {
        const response = await getRotationalPayments(groupId)
        const payments = response.data
        if (payments.length > 0) {
          setContributionAmount(payments[0].amount)
        } else {
          setContributionAmount(0)
        }
      } catch (error) {
        console.error("Error fetching payment amount:", error)
        toast.error("Failed to fetch contribution amount")
        setContributionAmount(0)
      } finally {
        setLoadingAmount(false)
      }
    }

    fetchPaymentAmount()
  }, [groupId])

  const handleDelete = () => {
    onDelete(groupId)
    setDeleteDialog(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    } catch (e) {
      return dateString
    }
  }

  const calculateProgress = () => {
    return Math.floor(Math.random() * 100)
  }

  const progress = calculateProgress()

  if (view === "list") {
    return (
      <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-teal-700">
        <div className="flex flex-col md:flex-row">
          <div className="p-5 flex-grow">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-teal-900/50 flex items-center justify-center mr-4 relative">
                <div className="absolute inset-0 rounded-full border-2 border-teal-500/50 border-dashed animate-spin-slow"></div>
                <span className="font-bold text-teal-400">{groupName.charAt(0)}</span>
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-xl font-bold text-white mr-2">{groupName}</h3>
                  {creator && (
                    <span className="bg-teal-900/50 text-teal-300 text-xs px-2 py-1 rounded-full">Creator</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm line-clamp-1">{groupDescription}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-gray-500 text-xs">Members</p>
                <p className="font-semibold text-white">{numMembers || 0}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Contribution</p>
                <p className="font-semibold text-white">
                  {loadingAmount ? "Loading..." : formatCurrency(contributionAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-5 flex flex-row md:flex-col justify-between items-center md:w-48">
            <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              <Link
                to={`/rotational/${groupId}/payments`}
                className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                View Payments
              </Link>
              <Link
                to={`/rotational/groups/${groupId}/plan`}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Add Plan
              </Link>
              {creator && (
                <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                  <Link
                    to={`/rotational/groups/${groupId}`}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteDialog(true)}
                    className="bg-red-900/50 hover:bg-red-800 text-red-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog
          isOpen={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this rotational savings cycle? This action cannot be undone."
        />
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-teal-700">
      {/* Card Header with Circular Progress */}
      <div className="relative p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-teal-900/50 flex items-center justify-center mr-4 relative">
              <div className="absolute inset-0 rounded-full border-2 border-teal-500/50 border-dashed animate-spin-slow"></div>
              <span className="font-bold text-teal-400">{groupName.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{groupName}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{groupDescription}</p>
            </div>
          </div>
          {creator && (
            <span className="bg-teal-900/50 text-teal-300 text-xs px-2 py-1 rounded-full">Creator</span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 pb-5">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-600" strokeWidth="2"></circle>
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-teal-500"
                strokeWidth="2"
                strokeDasharray={`${progress} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-teal-300">{progress}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1 ml-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Members</p>
              <p className="text-lg font-semibold text-white">{numMembers || 0}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">Monthly Contribution</p>
            <p className="text-lg font-semibold text-white">
              {loadingAmount ? "Loading..." : formatCurrency(contributionAmount)}
            </p>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 space-y-3 border-t border-gray-600 pt-3 animate-fadeIn">
            <p className="text-sm text-gray-300 font-medium">Cycle Details</p>
            <p className="text-xs text-gray-400">Group ID: {groupId}</p>

            <div className="bg-gray-700 p-3 rounded-lg mt-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-300 font-medium">Payment Schedule</p>
                <span className="text-xs text-gray-400">Monthly</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Total Cycle:</span>
                  <span className="text-gray-300">{numMembers} months</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="text-gray-300">
                    {loadingAmount ? "Loading..." : formatCurrency(contributionAmount * numMembers)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={`/rotational/${groupId}/payments`}
            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            View Payments
          </Link>

          <Link
            to={`/rotational/groups/${groupId}/plan`}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Add Plan
          </Link>

          {creator && (
            <>
              <Link
                to={`/rotational/groups/${groupId}`}
                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Edit
              </Link>

              <Link
                to={`/rotational/groups/${groupId}/members`}
                className="bg-blue-900/50 hover:bg-blue-800 text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Add Members
              </Link>

              <button
                onClick={() => setDeleteDialog(true)}
                className="bg-red-900/50 hover:bg-red-800 text-red-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Delete
              </button>

              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg transition-colors duration-200"
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

          {!creator && (
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg transition-colors duration-200"
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

      <Dialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this rotational savings cycle? This action cannot be undone."
      />
    </div>
  )
}

export default RotationalGroupCard